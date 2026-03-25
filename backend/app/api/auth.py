from fastapi import APIRouter, Response, HTTPException, Depends, Cookie, Form
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import create_token, verify_token, verify_password

router = APIRouter(prefix="/auth")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.username == username).first()

    if user is None:
        raise HTTPException(status_code=401)

    if not verify_password(password, str(user.password_hash)):
        raise HTTPException(status_code=401)

    token = create_token({
        "user_id": user.id,
        "role": user.role
    })

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=True,          # 🔥 ОБЯЗАТЕЛЬНО
        samesite="none"       # 🔥 ОБЯЗАТЕЛЬНО
    )

    return {"status": "ok"}

@router.get("/me")
def me(token: str | None = Cookie(default=None)):

    if token is None:
        raise HTTPException(status_code=401)

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401)

    return payload


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"status": "ok"}