import os
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.db.models import Song
from app.core.config import MUSIC_DIR, COVER_DIR


def list_songs(db: Session):
    songs = db.query(Song).all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "filename": s.filename,
            "cover": s.cover,
            "genre": s.genre,
        }
        for s in songs
    ]


async def save_song(db: Session, name: str, genre: str, file: UploadFile, cover: UploadFile):
    file_ext = (file.filename or "").split(".")[-1]
    cover_ext = (cover.filename or "").split(".")[-1]

    file_name = f"{uuid.uuid4()}.{file_ext}"
    cover_name = f"{uuid.uuid4()}.{cover_ext}"

    music_path = os.path.join(MUSIC_DIR, file_name)
    cover_path = os.path.join(COVER_DIR, cover_name)

    with open(music_path, "wb") as f:
        f.write(await file.read())

    with open(cover_path, "wb") as f:
        f.write(await cover.read())

    song = Song(
        name=name,
        filename=file_name,
        cover=cover_name,
        genre=genre,
    )

    db.add(song)
    db.commit()