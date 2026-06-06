import os
import pandas as pd
import matplotlib.pyplot as plt

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from src.database.session import get_db
from src.models.dataset import Dataset
from src.schemas.question_schema import QuestionRequest


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

    file_path = file_path.replace(
        "\\",
        "/"
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
        "filepath": file_path,
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

    missing_values = df.isnull().sum().sum()

    if missing_values == 0:
        insights.append(
            "Dataset contains no missing values."
        )
    else:
        insights.append(
            f"Dataset contains {missing_values} missing values."
        )

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
        "rows": len(df),
        "columns": len(df.columns),
        "insights": insights
    }


@router.post("/{dataset_id}/ask")
def ask_dataset(
    dataset_id: int,
    request: QuestionRequest,
    db: Session = Depends(get_db)
):

    return {
        "answer": (
            "AI chat is temporarily disabled. "
            "Use Summary, Statistics, Quality and Insights endpoints."
        )
    }


@router.get("/{dataset_id}/chart")
def generate_chart(
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

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    if len(numeric_columns) == 0:
        raise HTTPException(
            status_code=400,
            detail="No numeric columns found"
        )

    column = numeric_columns[0]

    os.makedirs(
        "src/charts",
        exist_ok=True
    )

    chart_path = (
        f"src/charts/chart_{dataset_id}.png"
    )

    plt.figure(figsize=(8, 5))

    df[column].hist()

    plt.title(
        f"{column} Distribution"
    )

    plt.savefig(chart_path)

    plt.close()

    return FileResponse(
        chart_path,
        media_type="image/png"
    )


@router.get("/{dataset_id}/report")
def download_report(
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

    report = f"""
Dataset Report
==============

Filename : {dataset.filename}
Rows     : {len(df)}
Columns  : {len(df.columns)}

Column Names:
{chr(10).join(f"  - {col}" for col in df.columns)}

Data Types:
{chr(10).join(f"  {col}: {dtype}" for col, dtype in df.dtypes.items())}

Missing Values:
{chr(10).join(f"  {col}: {count}" for col, count in df.isnull().sum().items())}

Statistics (Numeric Columns):
{df.describe().to_string()}
"""

    os.makedirs(
        "src/reports",
        exist_ok=True
    )

    report_path = (
        f"src/reports/report_{dataset_id}.txt"
    )

    with open(report_path, "w") as f:
        f.write(report)

    return FileResponse(
        report_path,
        filename=f"report_{dataset_id}.txt"
    )