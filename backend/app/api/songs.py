from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Header, Form
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Song
from app.services.song_service import list_songs, save_song
from app.core.security import verify_token

router = APIRouter()


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


@router.post("/upload")
async def upload_song(
    name: str = Form(...),
    genre: str = Form(...),
    file: UploadFile = File(...),
    cover: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    if not file.content_type or not file.content_type.startswith("audio"):
        raise HTTPException(400, "Invalid audio file")

    if not cover.content_type or not cover.content_type.startswith("image"):
        raise HTTPException(400, "Invalid cover file")

    song = await save_song(db, name, genre, file, cover)

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