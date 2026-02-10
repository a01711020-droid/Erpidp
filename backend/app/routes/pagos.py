from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/v1/pagos", tags=["pagos"])


@router.get("", response_model=list[schemas.Pago])
def list_pagos(db: Session = Depends(get_db)):
    return db.query(models.Pago).order_by(models.Pago.fecha_pago.desc()).all()


@router.post("", response_model=schemas.Pago)
def create_pago(payload: schemas.PagoCreate, db: Session = Depends(get_db)):
    orden = (
        db.query(models.OrdenCompra)
        .filter(models.OrdenCompra.id == payload.orden_compra_id)
        .first()
    )
    if not orden:
        raise HTTPException(status_code=400, detail="Orden de compra inválida")

    pago = models.Pago(**payload.model_dump())
    db.add(pago)
    db.commit()
    db.refresh(pago)
    return pago
