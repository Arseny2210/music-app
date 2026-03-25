import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException,Header, Form
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Song
from app.services.song_service import list_songs, save_song
from app.core.config import MUSIC_DIR, COVER_DIR
from app.core.security import verify_token

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


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

    await save_song(db, name, genre, file, cover)

    return {"status": "ok"}


@router.delete("/songs/{id}")
def delete_song(
    id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    song = db.query(Song).filter(Song.id == id).first()

    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")

    music_path = os.path.join(MUSIC_DIR, str(song.filename))
    cover_path = os.path.join(COVER_DIR, str(song.cover))

    if os.path.exists(music_path):
        os.remove(music_path)

    if os.path.exists(cover_path):
        os.remove(cover_path)

    db.delete(song)
    db.commit()

    return {"status": "deleted"}


@router.get("/stream/{filename}")
def stream_song(filename: str):
    path = os.path.join(MUSIC_DIR, filename)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")

    def iterfile():
        with open(path, "rb") as f:
            yield from f

    return StreamingResponse(iterfile(), media_type="audio/mpeg")


@router.get("/covers/{filename}")
def get_cover(filename: str):
    path = os.path.join(COVER_DIR, filename)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Cover not found")

    return FileResponse(path)