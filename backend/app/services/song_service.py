import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.db.models import Song
from app.core.supabase import supabase


from sqlalchemy.orm import Session

from app.db.models import Song


def list_songs(db: Session):
    try:
        songs = db.query(Song).all()
        return [
            {
                "id": s.id,
                "name": s.name,
                "genre": s.genre,
                "audio_url": s.audio_url,
                "cover_url": s.cover_url,
            }
            for s in songs
        ]
    except Exception as e:
        print("DB ERROR:", e)
        raise e


def create_song(
    db: Session,
    name: str,
    genre: str,
    audio_url: str,
    cover_url: str,
):
    song = Song(
        name=name,
        genre=genre,
        audio_url=audio_url,
        cover_url=cover_url,
    )

    db.add(song)
    db.commit()
    db.refresh(song)

    return song

async def save_song(
    db: Session,
    name: str,
    genre: str,
    file: UploadFile,
    cover: UploadFile,
):
    # --- AUDIO ---
    file_ext = (file.filename or "").split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"

    file_content = await file.read()

    supabase.storage.from_("music").upload(
        file_name,
        file_content,
        {
            "content-type": file.content_type,
            "upsert": "true"
        },
    )

    audio_url = supabase.storage.from_("music").get_public_url(file_name)["data"]["publicUrl"]

    # --- COVER ---
    cover_ext = (cover.filename or "").split(".")[-1]
    cover_name = f"{uuid.uuid4()}.{cover_ext}"

    cover_content = await cover.read()

    supabase.storage.from_("music").upload(
        cover_name,
        cover_content,
        {"content-type": cover.content_type},
    )

    cover_url = supabase.storage.from_("music").get_public_url(cover_name)["data"]["publicUrl"]

    # --- SAVE DB ---
    song = Song(
        name=name,
        genre=genre,
        audio_url=audio_url,
        cover_url=cover_url,
    )

    db.add(song)
    db.commit()
    db.refresh(song)

    return song