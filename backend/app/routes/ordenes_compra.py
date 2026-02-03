from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/v1/ordenes-compra", tags=["ordenes-compra"])


@router.get("", response_model=list[schemas.OrdenCompra])
def list_ordenes_compra(db: Session = Depends(get_db)):
    return (
        db.query(models.OrdenCompra)
        .options(selectinload(models.OrdenCompra.items))
        .order_by(models.OrdenCompra.fecha_creacion.desc())
        .all()
    )


@router.post("", response_model=schemas.OrdenCompra)
def create_orden_compra(payload: schemas.OrdenCompraCreate, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == payload.obra_id).first()
    if not obra:
        raise HTTPException(status_code=400, detail="Obra inválida")
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == payload.proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=400, detail="Proveedor inválido")

    orden = models.OrdenCompra(**payload.model_dump(exclude={"items"}))
    db.add(orden)
    db.flush()

    for item in payload.items:
        db.add(
            models.OrdenCompraItem(
                orden_compra_id=orden.id,
                descripcion=item.descripcion,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                total=item.total,
            )
        )

    db.commit()
    return (
        db.query(models.OrdenCompra)
        .options(selectinload(models.OrdenCompra.items))
        .filter(models.OrdenCompra.id == orden.id)
        .first()
    )


@router.put("/{orden_id}", response_model=schemas.OrdenCompra)
def update_orden_compra(
    orden_id: UUID, payload: schemas.OrdenCompraUpdate, db: Session = Depends(get_db)
):
    orden = (
        db.query(models.OrdenCompra).filter(models.OrdenCompra.id == orden_id).first()
    )
    if not orden:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")

    data = payload.model_dump(exclude_unset=True, exclude={"items"})
    for key, value in data.items():
        setattr(orden, key, value)

    if payload.items is not None:
        orden.items.clear()
        for item in payload.items:
            orden.items.append(
                models.OrdenCompraItem(
                    descripcion=item.descripcion,
                    cantidad=item.cantidad,
                    precio_unitario=item.precio_unitario,
                    total=item.total,
                )
            )

    db.commit()
    return (
        db.query(models.OrdenCompra)
        .options(selectinload(models.OrdenCompra.items))
        .filter(models.OrdenCompra.id == orden.id)
        .first()
    )


@router.delete("/{orden_id}", status_code=204)
def delete_orden_compra(orden_id: UUID, db: Session = Depends(get_db)):
    orden = (
        db.query(models.OrdenCompra).filter(models.OrdenCompra.id == orden_id).first()
    )
    if not orden:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    db.delete(orden)
    db.commit()
