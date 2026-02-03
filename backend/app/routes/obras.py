from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/v1/obras", tags=["obras"])


@router.get("", response_model=list[schemas.Obra])
def list_obras(db: Session = Depends(get_db)):
    return db.query(models.Obra).order_by(models.Obra.codigo).all()


@router.post("", response_model=schemas.Obra)
def create_obra(payload: schemas.ObraCreate, db: Session = Depends(get_db)):
    obra = models.Obra(**payload.dict())
    db.add(obra)
    db.commit()
    db.refresh(obra)
    return obra


@router.put("/{obra_id}", response_model=schemas.Obra)
def update_obra(obra_id: str, payload: schemas.ObraUpdate, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(obra, key, value)
    db.commit()
    db.refresh(obra)
    return obra


@router.delete("/{obra_id}", status_code=204)
def delete_obra(obra_id: str, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    db.delete(obra)
    db.commit()
