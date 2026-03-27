import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    @property
    def sqlalchemy_database_url(self):
        return self.DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")

    # Security
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_TO_A_RANDOM_64_CHARACTER_STRING"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Environment
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Some env files are shared/contain extra keys that are not represented
    # in this Settings model (e.g. frontend variables). Ignore them instead
    # of crashing the app on startup.
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )


settings = Settings()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

STORAGE_DIR = os.path.join(BASE_DIR, "storage")
MUSIC_DIR = os.path.join(STORAGE_DIR, "music")
COVER_DIR = os.path.join(STORAGE_DIR, "covers")

os.makedirs(MUSIC_DIR, exist_ok=True)
os.makedirs(COVER_DIR, exist_ok=True)