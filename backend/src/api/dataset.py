import os
import pandas as pd

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException
from src.schemas.question_schema import QuestionRequest

from sqlalchemy.orm import Session

from src.database.session import get_db
from src.models.dataset import Dataset

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.get("/test")
def dataset_test():

    return {
        "message": "Dataset API working"
    }


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    upload_dir = "src/uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    df = pd.read_csv(file_path)

    dataset = Dataset(
        filename=file.filename,
        filepath=file_path,
        rows=len(df),
        columns=len(df.columns)
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return {
        "dataset_id": dataset.id,
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns)
    }


@router.get("/")
def get_datasets(
    db: Session = Depends(get_db)
):

    datasets = db.query(Dataset).all()

    return datasets
@router.get("/{dataset_id}/summary")
def dataset_summary(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = pd.read_csv(dataset.filepath)

    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "data_types": {
            col: str(dtype)
            for col, dtype in df.dtypes.items()
        }
    }
@router.get("/{dataset_id}/statistics")
def dataset_statistics(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = pd.read_csv(dataset.filepath)

    numeric_df = df.select_dtypes(
        include=["number"]
    )

    stats = {}

    for column in numeric_df.columns:

        stats[column] = {
            "mean": float(numeric_df[column].mean()),
            "median": float(numeric_df[column].median()),
            "min": float(numeric_df[column].min()),
            "max": float(numeric_df[column].max()),
            "std": float(numeric_df[column].std())
        }

    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "statistics": stats
    }
@router.get("/{dataset_id}/quality")
def dataset_quality(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = pd.read_csv(dataset.filepath)

    total_cells = df.shape[0] * df.shape[1]

    missing_cells = df.isnull().sum().sum()

    quality_score = (
        (total_cells - missing_cells)
        / total_cells
    ) * 100

    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "missing_cells": int(missing_cells),
        "quality_score": round(
            quality_score,
            2
        )
    }
@router.get("/{dataset_id}/insights")
def dataset_insights(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = pd.read_csv(dataset.filepath)

    insights = []

    # Missing values insight
    missing_values = df.isnull().sum().sum()

    if missing_values == 0:
        insights.append(
            "Dataset contains no missing values."
        )
    else:
        insights.append(
            f"Dataset contains {missing_values} missing values."
        )

    # Numeric column insights
    numeric_df = df.select_dtypes(
        include=["number"]
    )

    for column in numeric_df.columns:

        insights.append(
            f"{column}: average = {round(numeric_df[column].mean(), 2)}"
        )

        insights.append(
            f"{column}: minimum = {numeric_df[column].min()}"
        )

        insights.append(
            f"{column}: maximum = {numeric_df[column].max()}"
        )

    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "insights": insights
    }
@router.post("/{dataset_id}/ask")
def ask_dataset(
    dataset_id: int,
    request: QuestionRequest,
    db: Session = Depends(get_db)
):

    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = pd.read_csv(dataset.filepath)

    question = request.question.lower()

    if "average salary" in question:
        return {
            "answer": f"The average salary is {df['salary'].mean():.2f}"
        }

    if "maximum salary" in question:
        return {
            "answer": f"The maximum salary is {df['salary'].max()}"
        }

    if "minimum salary" in question:
        return {
            "answer": f"The minimum salary is {df['salary'].min()}"
        }

    return {
        "answer": "Question not supported yet."
    }