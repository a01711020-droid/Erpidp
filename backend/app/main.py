from math import ceil
from typing import Any
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from . import models, schemas
from .db import get_db

app = FastAPI(title="ERP IDP API", version="1.0.0")

frontend_url = (
    __import__("os").getenv("FRONTEND_URL") or "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def paginate(query, page: int, page_size: int) -> dict[str, Any]:
    total = query.count()
    total_pages = ceil(total / page_size) if page_size else 1
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return {
        "data": items,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages,
    }


@app.get("/api/v1/obras")
def list_obras(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    result = paginate(db.query(models.Obra), page, page_size)
    result["data"] = [schemas.Obra.model_validate(item) for item in result["data"]]
    return result


@app.post("/api/v1/obras", response_model=schemas.Obra)
def create_obra(payload: schemas.ObraCreate, db: Session = Depends(get_db)):
    obra = models.Obra(**payload.model_dump(by_alias=True))
    db.add(obra)
    db.commit()
    db.refresh(obra)
    return schemas.Obra.model_validate(obra)


@app.get("/api/v1/obras/{obra_id}", response_model=schemas.Obra)
def get_obra(obra_id: UUID, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    return schemas.Obra.model_validate(obra)


@app.put("/api/v1/obras/{obra_id}", response_model=schemas.Obra)
def update_obra(obra_id: UUID, payload: schemas.ObraUpdate, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    for key, value in payload.model_dump(by_alias=True, exclude_unset=True).items():
        setattr(obra, key, value)
    db.commit()
    db.refresh(obra)
    return schemas.Obra.model_validate(obra)


@app.delete("/api/v1/obras/{obra_id}", status_code=204)
def delete_obra(obra_id: UUID, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == obra_id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    db.delete(obra)
    db.commit()


@app.get("/api/v1/proveedores")
def list_proveedores(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    result = paginate(db.query(models.Proveedor), page, page_size)
    result["data"] = [schemas.Proveedor.model_validate(item) for item in result["data"]]
    return result


@app.post("/api/v1/proveedores", response_model=schemas.Proveedor)
def create_proveedor(payload: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    proveedor = models.Proveedor(**payload.model_dump(by_alias=True))
    db.add(proveedor)
    db.commit()
    db.refresh(proveedor)
    return schemas.Proveedor.model_validate(proveedor)


@app.get("/api/v1/proveedores/{proveedor_id}", response_model=schemas.Proveedor)
def get_proveedor(proveedor_id: UUID, db: Session = Depends(get_db)):
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return schemas.Proveedor.model_validate(proveedor)


@app.put("/api/v1/proveedores/{proveedor_id}", response_model=schemas.Proveedor)
def update_proveedor(
    proveedor_id: UUID, payload: schemas.ProveedorUpdate, db: Session = Depends(get_db)
):
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    for key, value in payload.model_dump(by_alias=True, exclude_unset=True).items():
        setattr(proveedor, key, value)
    db.commit()
    db.refresh(proveedor)
    return schemas.Proveedor.model_validate(proveedor)


@app.delete("/api/v1/proveedores/{proveedor_id}", status_code=204)
def delete_proveedor(proveedor_id: UUID, db: Session = Depends(get_db)):
    proveedor = (
        db.query(models.Proveedor).filter(models.Proveedor.id == proveedor_id).first()
    )
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor)
    db.commit()


@app.get("/api/v1/requisiciones")
def list_requisiciones(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(models.Requisicion).options(joinedload(models.Requisicion.items))
    result = paginate(query, page, page_size)
    result["data"] = [schemas.Requisicion.model_validate(item) for item in result["data"]]
    return result


@app.post("/api/v1/requisiciones", response_model=schemas.Requisicion)
def create_requisicion(payload: schemas.RequisicionCreate, db: Session = Depends(get_db)):
    requisicion_data = payload.model_dump(by_alias=True)
    items_data = requisicion_data.pop("items", [])
    requisicion = models.Requisicion(**requisicion_data)
    requisicion.items = [models.RequisicionItem(**item) for item in items_data]
    db.add(requisicion)
    db.commit()
    db.refresh(requisicion)
    return schemas.Requisicion.model_validate(requisicion)


@app.get("/api/v1/requisiciones/{requisicion_id}", response_model=schemas.Requisicion)
def get_requisicion(requisicion_id: UUID, db: Session = Depends(get_db)):
    requisicion = (
        db.query(models.Requisicion)
        .options(joinedload(models.Requisicion.items))
        .filter(models.Requisicion.id == requisicion_id)
        .first()
    )
    if not requisicion:
        raise HTTPException(status_code=404, detail="Requisición no encontrada")
    return schemas.Requisicion.model_validate(requisicion)


@app.put("/api/v1/requisiciones/{requisicion_id}", response_model=schemas.Requisicion)
def update_requisicion(
    requisicion_id: UUID, payload: schemas.RequisicionUpdate, db: Session = Depends(get_db)
):
    requisicion = (
        db.query(models.Requisicion)
        .options(joinedload(models.Requisicion.items))
        .filter(models.Requisicion.id == requisicion_id)
        .first()
    )
    if not requisicion:
        raise HTTPException(status_code=404, detail="Requisición no encontrada")
    for key, value in payload.model_dump(by_alias=True, exclude_unset=True).items():
        setattr(requisicion, key, value)
    db.commit()
    db.refresh(requisicion)
    return schemas.Requisicion.model_validate(requisicion)


@app.delete("/api/v1/requisiciones/{requisicion_id}", status_code=204)
def delete_requisicion(requisicion_id: UUID, db: Session = Depends(get_db)):
    requisicion = db.query(models.Requisicion).filter(models.Requisicion.id == requisicion_id).first()
    if not requisicion:
        raise HTTPException(status_code=404, detail="Requisición no encontrada")
    db.delete(requisicion)
    db.commit()


@app.get("/api/v1/ordenes-compra")
def list_ordenes_compra(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(models.OrdenCompra).options(joinedload(models.OrdenCompra.items))
    result = paginate(query, page, page_size)
    result["data"] = [schemas.OrdenCompra.model_validate(item) for item in result["data"]]
    return result


@app.post("/api/v1/ordenes-compra", response_model=schemas.OrdenCompra)
def create_orden_compra(payload: schemas.OrdenCompraCreate, db: Session = Depends(get_db)):
    data = payload.model_dump(by_alias=True)
    items_data = data.pop("items", [])
    orden = models.OrdenCompra(**data)
    orden.items = [models.OrdenCompraItem(**item) for item in items_data]
    db.add(orden)
    db.commit()
    db.refresh(orden)
    return schemas.OrdenCompra.model_validate(orden)


@app.get("/api/v1/ordenes-compra/{orden_id}", response_model=schemas.OrdenCompra)
def get_orden_compra(orden_id: UUID, db: Session = Depends(get_db)):
    orden = (
        db.query(models.OrdenCompra)
        .options(joinedload(models.OrdenCompra.items))
        .filter(models.OrdenCompra.id == orden_id)
        .first()
    )
    if not orden:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    return schemas.OrdenCompra.model_validate(orden)


@app.put("/api/v1/ordenes-compra/{orden_id}", response_model=schemas.OrdenCompra)
def update_orden_compra(
    orden_id: UUID, payload: schemas.OrdenCompraUpdate, db: Session = Depends(get_db)
):
    orden = (
        db.query(models.OrdenCompra)
        .options(joinedload(models.OrdenCompra.items))
        .filter(models.OrdenCompra.id == orden_id)
        .first()
    )
    if not orden:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    for key, value in payload.model_dump(by_alias=True, exclude_unset=True).items():
        setattr(orden, key, value)
    db.commit()
    db.refresh(orden)
    return schemas.OrdenCompra.model_validate(orden)


@app.delete("/api/v1/ordenes-compra/{orden_id}", status_code=204)
def delete_orden_compra(orden_id: UUID, db: Session = Depends(get_db)):
    orden = db.query(models.OrdenCompra).filter(models.OrdenCompra.id == orden_id).first()
    if not orden:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    db.delete(orden)
    db.commit()


@app.get("/api/v1/pagos")
def list_pagos(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    result = paginate(db.query(models.Pago), page, page_size)
    result["data"] = [schemas.Pago.model_validate(item) for item in result["data"]]
    return result


@app.post("/api/v1/pagos", response_model=schemas.Pago)
def create_pago(payload: schemas.PagoCreate, db: Session = Depends(get_db)):
    pago = models.Pago(**payload.model_dump(by_alias=True))
    db.add(pago)
    db.commit()
    db.refresh(pago)
    return schemas.Pago.model_validate(pago)


@app.get("/api/v1/pagos/{pago_id}", response_model=schemas.Pago)
def get_pago(pago_id: UUID, db: Session = Depends(get_db)):
    pago = db.query(models.Pago).filter(models.Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return schemas.Pago.model_validate(pago)


@app.put("/api/v1/pagos/{pago_id}", response_model=schemas.Pago)
def update_pago(pago_id: UUID, payload: schemas.PagoUpdate, db: Session = Depends(get_db)):
    pago = db.query(models.Pago).filter(models.Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    for key, value in payload.model_dump(by_alias=True, exclude_unset=True).items():
        setattr(pago, key, value)
    db.commit()
    db.refresh(pago)
    return schemas.Pago.model_validate(pago)


@app.delete("/api/v1/pagos/{pago_id}", status_code=204)
def delete_pago(pago_id: UUID, db: Session = Depends(get_db)):
    pago = db.query(models.Pago).filter(models.Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    db.delete(pago)
    db.commit()
