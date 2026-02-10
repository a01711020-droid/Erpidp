import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import obras, proveedores, ordenes_compra, pagos, requisiciones, auth, dashboard

app = FastAPI(title="ERP IDP API", version="1.0.0")

origins_env = os.getenv("CORS_ORIGINS")
default_origins = ["http://localhost:5173"]
origins = origins_env.split(",") if origins_env else default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(obras.router)
app.include_router(proveedores.router)
app.include_router(ordenes_compra.router)
app.include_router(pagos.router)
app.include_router(requisiciones.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"status": "ok"}
