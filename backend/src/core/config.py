from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    DATABASE_URL: str
    DEBUG: bool
    GEMINI_API_KEY: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"


settings = Settings()

settings = Settings()

print("DATABASE_URL =", settings.DATABASE_URL)