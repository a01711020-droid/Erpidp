from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models


def get_obra_summary(db: Session, obra_id: UUID) -> dict:
    total_ordenes = (
        db.query(func.coalesce(func.sum(models.OrdenCompra.total), 0))
        .filter(models.OrdenCompra.obra_id == obra_id)
        .scalar()
    )
    total_pagos = (
        db.query(func.coalesce(func.sum(models.Pago.monto), 0))
        .join(models.OrdenCompra, models.OrdenCompra.id == models.Pago.orden_compra_id)
        .filter(models.OrdenCompra.obra_id == obra_id)
        .scalar()
    )
    total_ordenes_val = float(total_ordenes or 0)
    total_pagos_val = float(total_pagos or 0)
    total_pendiente = total_ordenes_val - total_pagos_val
    return {
        "obra_id": obra_id,
        "total_ordenes_compra": total_ordenes_val,
        "total_pagos": total_pagos_val,
        "total_pendiente": total_pendiente,
    }
