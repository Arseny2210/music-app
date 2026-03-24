from pydantic import BaseModel


class SongResponse(BaseModel):

    id: int
    name: str
    url: str