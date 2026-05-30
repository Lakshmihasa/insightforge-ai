# Base.metadata.create_all(bind=engine)
from fastapi import FastAPI

from src.core.config import settings
from src.api.auth import router as auth_router

from src.database.base import Base
from src.database.database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "InsightForge AI Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }