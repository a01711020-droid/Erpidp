from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from .. import schemas
from ..services.dashboard import get_dashboard_resumen

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/resumen", response_model=schemas.DashboardResumen)
def dashboard_resumen(db: Session = Depends(get_db)):
    return get_dashboard_resumen(db)
