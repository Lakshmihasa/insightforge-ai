import os
import pandas as pd

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

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