from pydantic import BaseModel
from datetime import datetime


class DatasetResponse(BaseModel):

    id: int
    filename: str
    filepath: str
    rows: int
    columns: int
    uploaded_at: datetime

    class Config:
        from_attributes = True