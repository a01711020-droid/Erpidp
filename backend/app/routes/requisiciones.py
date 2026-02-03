from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/v1/requisiciones", tags=["requisiciones"])


@router.get("", response_model=list[schemas.Requisicion])
def list_requisiciones(db: Session = Depends(get_db)):
    return db.query(models.Requisicion).order_by(models.Requisicion.fecha_creacion.desc()).all()


@router.post("", response_model=schemas.Requisicion)
def create_requisicion(payload: schemas.RequisicionCreate, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == payload.obra_id).first()
    if not obra:
        raise HTTPException(status_code=400, detail="Obra inválida")

    requisicion = models.Requisicion(**payload.model_dump(exclude={"items", "comentarios"}))
    db.add(requisicion)
    db.flush()

    for item in payload.items:
        db.add(
            models.RequisicionItem(
                requisicion_id=requisicion.id,
                descripcion=item.descripcion,
                cantidad=item.cantidad,
                unidad=item.unidad,
            )
        )

    for comment in payload.comentarios:
        db.add(
            models.RequisicionComentario(
                requisicion_id=requisicion.id,
                autor=comment.autor,
                rol=comment.rol,
                mensaje=comment.mensaje,
                fecha=comment.fecha,
            )
        )

    db.commit()
    db.refresh(requisicion)
    return requisicion


@router.put("/{requisicion_id}", response_model=schemas.Requisicion)
def update_requisicion(
    requisicion_id: UUID, payload: schemas.RequisicionUpdate, db: Session = Depends(get_db)
):
    requisicion = (
        db.query(models.Requisicion)
        .filter(models.Requisicion.id == requisicion_id)
        .first()
    )
    if not requisicion:
        raise HTTPException(status_code=404, detail="Requisición no encontrada")

    data = payload.model_dump(exclude_unset=True, exclude={"items", "comentarios"})
    for key, value in data.items():
        setattr(requisicion, key, value)

    if payload.items is not None:
        requisicion.items.clear()
        for item in payload.items:
            requisicion.items.append(
                models.RequisicionItem(
                    descripcion=item.descripcion,
                    cantidad=item.cantidad,
                    unidad=item.unidad,
                )
            )

    if payload.comentarios is not None:
        requisicion.comentarios.clear()
        for comment in payload.comentarios:
            requisicion.comentarios.append(
                models.RequisicionComentario(
                    autor=comment.autor,
                    rol=comment.rol,
                    mensaje=comment.mensaje,
                    fecha=comment.fecha,
                )
            )

    db.commit()
    db.refresh(requisicion)
    return requisicion
