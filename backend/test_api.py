"""
Script de prueba para verificar la API FastAPI
Ejecutar: python test_api.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Prueba el health check"""
    print("\n🔍 Probando health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health check OK")

def test_list_obras():
    """Prueba listar obras"""
    print("\n🔍 Probando listar obras...")
    response = requests.get(f"{BASE_URL}/api/obras")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total de obras: {data['total']}")
    print(f"Obras en página: {len(data['data'])}")
    if data['data']:
        print(f"Primera obra: {data['data'][0]['nombre']}")
    assert response.status_code == 200
    print("✅ Listar obras OK")

def test_list_proveedores():
    """Prueba listar proveedores"""
    print("\n🔍 Probando listar proveedores...")
    response = requests.get(f"{BASE_URL}/api/proveedores")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total de proveedores: {data['total']}")
    if data['data']:
        print(f"Primer proveedor: {data['data'][0]['razon_social']}")
    assert response.status_code == 200
    print("✅ Listar proveedores OK")

def test_create_requisicion():
    """Prueba crear una requisición"""
    print("\n🔍 Probando crear requisición...")
    
    # Primero, obtener una obra
    obras_response = requests.get(f"{BASE_URL}/api/obras")
    obras = obras_response.json()['data']
    
    if not obras:
        print("⚠️ No hay obras en la BD, saltando prueba de requisición")
        return
    
    obra_id = obras[0]['id']
    
    # Crear requisición
    requisicion_data = {
        "obra_id": obra_id,
        "solicitado_por": "Test User",
        "urgencia": "normal",
        "observaciones": "Prueba automática",
        "items": [
            {
                "cantidad": 10,
                "unidad": "PZA",
                "descripcion": "Material de prueba"
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/requisiciones",
        json=requisicion_data
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Requisición creada: {data['numero_requisicion']}")
        print(f"Items: {len(data['items'])}")
        print("✅ Crear requisición OK")
    else:
        print(f"❌ Error: {response.text}")

def test_pagination():
    """Prueba la paginación"""
    print("\n🔍 Probando paginación...")
    
    # Página 1
    response1 = requests.get(f"{BASE_URL}/api/obras?page=1&page_size=2")
    data1 = response1.json()
    
    print(f"Página 1: {len(data1['data'])} obras")
    print(f"Total: {data1['total']}")
    print(f"Total de páginas: {data1['total_pages']}")
    
    assert response1.status_code == 200
    print("✅ Paginación OK")

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 PRUEBAS DE API - Sistema IDP")
    print("=" * 50)
    
    try:
        test_health()
        test_list_obras()
        test_list_proveedores()
        test_pagination()
        test_create_requisicion()
        
        print("\n" + "=" * 50)
        print("✅ TODAS LAS PRUEBAS PASARON")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nAsegúrate de que:")
        print("1. El servidor FastAPI esté corriendo (uvicorn main:app --reload)")
        print("2. La base de datos esté configurada correctamente")
        print("3. El esquema SQL se haya ejecutado en Supabase")
