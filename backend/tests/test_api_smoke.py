import os
from datetime import date
from uuid import uuid4

import httpx
import pytest


API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


def request_or_skip(method: str, path: str, **kwargs):
    try:
        response = httpx.request(method, f"{API_BASE_URL}{path}", timeout=5, **kwargs)
    except httpx.RequestError as exc:
        pytest.skip(f"API no disponible en {API_BASE_URL}: {exc}")
    return response


def test_obras_create_and_list():
    payload = {
        "codigo": f"OB-{uuid4().hex[:6]}",
        "nombre": "Obra Test",
        "cliente": "Cliente Test",
        "numero_contrato": "CT-001",
        "monto_contrato": 100000,
        "anticipo_porcentaje": 10,
        "retencion_porcentaje": 5,
        "fecha_inicio": date.today().isoformat(),
        "fecha_fin_estimada": date.today().isoformat(),
        "residente_nombre": "Residente Test",
        "residente_iniciales": "RT",
        "estado": "Activa",
        "balance_actual": 0,
        "total_estimaciones": 0,
        "total_gastos": 0,
    }
    create = request_or_skip("POST", "/api/v1/obras", json=payload)
    assert create.status_code == 200
    obra = create.json()
    assert obra["codigo"] == payload["codigo"]

    listing = request_or_skip("GET", "/api/v1/obras")
    assert listing.status_code == 200
    assert any(item["id"] == obra["id"] for item in listing.json())


def test_proveedores_create_and_list():
    payload = {
        "nombre_comercial": "Proveedor Test",
        "razon_social": "Proveedor Test SA",
        "rfc": f"RFC{uuid4().hex[:6]}",
        "direccion": "Calle 1",
        "ciudad": "Ciudad",
        "codigo_postal": "12345",
        "telefono": "555-0000",
        "email": "proveedor@test.com",
        "contacto_principal": "Contacto",
        "banco": "Banco",
        "numero_cuenta": "1234567890",
        "clabe": "123456789012345678",
        "tipo_proveedor": "material",
        "dias_credito": 30,
        "limite_credito": 50000,
        "activo": True,
    }
    create = request_or_skip("POST", "/api/v1/proveedores", json=payload)
    assert create.status_code == 200
    proveedor = create.json()
    assert proveedor["nombre_comercial"] == payload["nombre_comercial"]

    listing = request_or_skip("GET", "/api/v1/proveedores")
    assert listing.status_code == 200
    assert any(item["id"] == proveedor["id"] for item in listing.json())
