from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.api.auth import router as auth_router
from src.api.users import router as user_router
from src.api.dataset import router as dataset_router

app = FastAPI(
    title="InsightForge AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve chart images
app.mount(
    "/charts",
    StaticFiles(directory="src/charts"),
    name="charts"
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(dataset_router)

@app.get("/")
def home():
    return {"message": "InsightForge AI Running"}