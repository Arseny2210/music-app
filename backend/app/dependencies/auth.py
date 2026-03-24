from fastapi import Cookie, HTTPException
from app.core.security import verify_token


def get_current_user(token: str | None = Cookie(default=None)):

    if token is None:
        raise HTTPException(status_code=401)

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401)

    return payload


def require_admin(token: str | None = Cookie(default=None)):

    if token is None:
        raise HTTPException(status_code=401)

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401)

    if payload["role"] != "admin":
        raise HTTPException(status_code=403)

    return payload