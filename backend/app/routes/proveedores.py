from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/v1/proveedores", tags=["proveedores"])


@router.get("", response_model=list[schemas.Proveedor])
def list_proveedores(db: Session = Depends(get_db)):
    return db.query(models.Proveedor).order_by(models.Proveedor.nombre_comercial).all()


@router.post("", response_model=schemas.Proveedor)
def create_proveedor(payload: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    proveedor = models.Proveedor(**payload.model_dump())
    db.add(proveedor)
    db.commit()
    db.refresh(proveedor)
    return proveedor


@router.put("/{proveedor_id}", response_model=schemas.Proveedor)
def update_proveedor(
    proveedor_id: UUID, payload: schemas.ProveedorUpdate, db: Session = Depends(get_db)
):
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(proveedor, key, value)
    db.commit()
    db.refresh(proveedor)
    return proveedor


@router.delete("/{proveedor_id}", status_code=204)
def delete_proveedor(proveedor_id: UUID, db: Session = Depends(get_db)):
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor)
    db.commit()
