import os
from fastapi import APIRouter, HTTPException
from ..schemas import AuthRequest, AuthResponse

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/verify", response_model=AuthResponse)
def verify_password(payload: AuthRequest):
    expected = os.getenv("ADMIN_PASSWORD", "idpjedi01")
    if payload.password != expected:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"status": "ok"}
