from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models


def get_dashboard_resumen(db: Session) -> dict:
    obras_activas = (
        db.query(func.count(models.Obra.id))
        .filter(models.Obra.estado == "Activa")
        .scalar()
    )
    total_contratado = (
        db.query(func.coalesce(func.sum(models.Obra.monto_contrato), 0))
        .filter(models.Obra.estado == "Activa")
        .scalar()
    )
    total_estimaciones = (
        db.query(func.coalesce(func.sum(models.Obra.total_estimaciones), 0))
        .scalar()
    )
    total_gastos = (
        db.query(func.coalesce(func.sum(models.Obra.total_gastos), 0)).scalar()
    )
    total_oc = (
        db.query(func.coalesce(func.sum(models.OrdenCompra.total), 0)).scalar()
    )
    total_pagado = (
        db.query(func.coalesce(func.sum(models.Pago.monto), 0)).scalar()
    )
    total_oc_val = float(total_oc or 0)
    total_pagado_val = float(total_pagado or 0)
    return {
        "obras_activas": int(obras_activas or 0),
        "total_contratado": float(total_contratado or 0),
        "total_estimaciones": float(total_estimaciones or 0),
        "total_gastos": float(total_gastos or 0),
        "total_oc": total_oc_val,
        "total_pagado": total_pagado_val,
        "total_pendiente": total_oc_val - total_pagado_val,
    }
