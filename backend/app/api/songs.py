from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import SessionLocal
from app.db.models import Song
from app.services.song_service import list_songs, create_song
from app.core.security import verify_token

router = APIRouter()


class SongCreate(BaseModel):
    name: str
    genre: str
    audio_url: str
    cover_url: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def require_admin(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No auth header")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")

    return payload


@router.get("/songs")
def get_songs(db: Session = Depends(get_db)):
    return list_songs(db)


@router.post("/songs")
def create_song_endpoint(
    data: SongCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    song = create_song(
        db,
        data.name,
        data.genre,
        data.audio_url,
        data.cover_url,
    )

    return {
        "id": song.id,
        "name": song.name,
        "audio_url": song.audio_url,
        "cover_url": song.cover_url,
    }


@router.delete("/songs/{id}")
def delete_song(
    id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    song = db.query(Song).filter(Song.id == id).first()

    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")

    db.delete(song)
    db.commit()

    return {"status": "deleted"}