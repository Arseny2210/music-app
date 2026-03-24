import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.songs import router as songs_router
from app.api.auth import router as auth_router
from app.core.config import settings
from app.db.database import Base, engine

# Configure structured logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log') if not settings.DEBUG else logging.NullHandler()
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up the application...")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")

    yield

    # Shutdown
    logger.info("Shutting down the application...")


app = FastAPI(
    title="Music App API",
    description="Backend API for Music Application",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

app.include_router(auth_router)
app.include_router(songs_router)