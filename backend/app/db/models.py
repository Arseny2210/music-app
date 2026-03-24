from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)


class Song(Base):
    __tablename__ = "songs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    filename: Mapped[str] = mapped_column(String)
    cover: Mapped[str] = mapped_column(String)
    genre: Mapped[str] = mapped_column(String)

