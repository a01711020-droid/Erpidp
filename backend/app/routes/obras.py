from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..services.obras import get_obra_summary

router = APIRouter(prefix="/api/v1/obras", tags=["obras"])


@router.get("", response_model=list[schemas.Obra])
def list_obras(db: Session = Depends(get_db)):
    return db.query(models.Obra).order_by(models.Obra.codigo).all()


@router.get("/{obra_id}/summary", response_model=schemas.ObraSummary)
def obra_summary(obra_id: UUID, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    return get_obra_summary(db, obra_id)


@router.post("", response_model=schemas.Obra)
def create_obra(payload: schemas.ObraCreate, db: Session = Depends(get_db)):
    obra = models.Obra(**payload.model_dump())
    db.add(obra)
    db.commit()
    db.refresh(obra)
    return obra


@router.put("/{obra_id}", response_model=schemas.Obra)
def update_obra(obra_id: UUID, payload: schemas.ObraUpdate, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(obra, key, value)
    db.commit()
    db.refresh(obra)
    return obra


@router.delete("/{obra_id}", status_code=204)
def delete_obra(obra_id: UUID, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    db.delete(obra)
    db.commit()
