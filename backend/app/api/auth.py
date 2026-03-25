from fastapi import APIRouter, HTTPException, Depends, Form, Header
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

    return {"access_token": token}


@router.get("/me")
def me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401)

    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401)

    return payload


@router.post("/logout")
def logout():
    return {"status": "ok"}