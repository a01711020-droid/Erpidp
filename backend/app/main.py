from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import obras, proveedores, ordenes_compra, pagos, requisiciones, auth

app = FastAPI(title="ERP IDP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(obras.router)
app.include_router(proveedores.router)
app.include_router(ordenes_compra.router)
app.include_router(pagos.router)
app.include_router(requisiciones.router)


@app.get("/")
def root():
    return {"status": "ok"}
