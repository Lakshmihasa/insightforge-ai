from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from src.database.base import Base


class Dataset(Base):

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    rows = Column(Integer)

    columns = Column(Integer)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )