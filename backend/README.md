# 🐍 Backend FastAPI - Sistema de Gestión Empresarial IDP

Backend API REST completo con FastAPI + PostgreSQL (Supabase)

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en esta carpeta (`/backend/.env`):

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

Reemplaza `[PASSWORD]` con tu contraseña de Supabase.

### 3. Ejecutar el Servidor

```bash
uvicorn main:app --reload --port 8000
```

El servidor estará disponible en:
- API: `http://localhost:8000`
- Documentación interactiva (Swagger): `http://localhost:8000/docs`
- Documentación alternativa (ReDoc): `http://localhost:8000/redoc`

---

## 📚 Endpoints Disponibles

### Health Check
```
GET /
GET /health
```

### Obras
```
GET    /api/obras              # Listar obras (paginado)
GET    /api/obras/{id}         # Obtener obra por ID
POST   /api/obras              # Crear obra
PUT    /api/obras/{id}         # Actualizar obra
DELETE /api/obras/{id}         # Eliminar obra
```

### Proveedores
```
GET    /api/proveedores        # Listar proveedores (paginado)
GET    /api/proveedores/{id}   # Obtener proveedor por ID
POST   /api/proveedores        # Crear proveedor
PUT    /api/proveedores/{id}   # Actualizar proveedor
DELETE /api/proveedores/{id}   # Eliminar proveedor
```

### Requisiciones
```
GET    /api/requisiciones              # Listar requisiciones (paginado)
GET    /api/requisiciones/{id}         # Obtener requisición por ID
POST   /api/requisiciones              # Crear requisición (con items)
PUT    /api/requisiciones/{id}         # Actualizar requisición
DELETE /api/requisiciones/{id}         # Eliminar requisición
PUT    /api/requisiciones/{id}/aprobar # Aprobar requisición
```

### Órdenes de Compra
```
GET    /api/ordenes-compra        # Listar OCs (paginado)
GET    /api/ordenes-compra/{id}   # Obtener OC por ID
POST   /api/ordenes-compra        # Crear OC (con items)
PUT    /api/ordenes-compra/{id}   # Actualizar OC
DELETE /api/ordenes-compra/{id}   # Eliminar OC
```

### Pagos
```
GET    /api/pagos                # Listar pagos (paginado)
GET    /api/pagos/{id}           # Obtener pago por ID
POST   /api/pagos                # Crear pago
PUT    /api/pagos/{id}           # Actualizar pago
DELETE /api/pagos/{id}           # Eliminar pago
PUT    /api/pagos/{id}/procesar  # Procesar pago
```

---

## 🔧 Características Técnicas

### Stack
- **FastAPI** 0.115.0 - Framework web moderno y rápido
- **Pydantic** 2.10.3 - Validación de datos automática
- **asyncpg** 0.30.0 - Driver PostgreSQL asíncrono
- **uvicorn** 0.32.0 - Servidor ASGI

### Características
- ✅ API REST completa con CRUD
- ✅ Validación automática con Pydantic
- ✅ Documentación interactiva (Swagger/ReDoc)
- ✅ Paginación en todas las listas
- ✅ Filtros por parámetros
- ✅ Generación automática de números (REQ-XXX, OC-XXX, PAG-XXX)
- ✅ Manejo de relaciones (items de requisiciones y OCs)
- ✅ CORS habilitado
- ✅ Pool de conexiones asíncrono
- ✅ Manejo de errores HTTP

---

## 📖 Ejemplos de Uso

### Crear una Obra

```bash
curl -X POST http://localhost:8000/api/obras \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "228",
    "nombre": "PROYECTO NUEVO",
    "numero_contrato": "IDP-2025-228",
    "cliente": "Cliente Ejemplo",
    "residente": "Ing. Juan Pérez",
    "direccion": "Calle Ejemplo 123",
    "monto_contratado": 5000000,
    "fecha_inicio": "2025-02-01",
    "fecha_fin_programada": "2025-08-01",
    "plazo_ejecucion": 180,
    "estado": "activa"
  }'
```

### Crear una Requisición con Items

```bash
curl -X POST http://localhost:8000/api/requisiciones \
  -H "Content-Type: application/json" \
  -d '{
    "obra_id": "UUID_DE_LA_OBRA",
    "solicitado_por": "Ing. Carlos Mendoza",
    "urgencia": "normal",
    "observaciones": "Material para inicio de obra",
    "items": [
      {
        "cantidad": 50,
        "unidad": "TON",
        "descripcion": "Cemento gris Portland CPC 30R"
      },
      {
        "cantidad": 100,
        "unidad": "M3",
        "descripcion": "Arena de río"
      }
    ]
  }'
```

### Listar Obras con Paginación

```bash
curl "http://localhost:8000/api/obras?page=1&page_size=10&estado=activa"
```

---

## 🚢 Despliegue en Render

### Configuración

**Build Command**:
```
pip install -r requirements.txt
```

**Start Command**:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Variables de Entorno**:
- `DATABASE_URL`: Connection string de Supabase

---

## 📝 Notas Importantes

1. **Números Automáticos**: Los números de requisición, OC y pagos se generan automáticamente en formato:
   - Requisiciones: `REQ-2025-001`
   - Órdenes de Compra: `OC-2025-001`
   - Pagos: `PAG-2025-001`

2. **Transacciones**: Las operaciones que incluyen items (requisiciones y OCs) usan transacciones para garantizar consistencia.

3. **CORS**: Habilitado para todos los orígenes (`*`). En producción, reemplazar con dominios específicos.

4. **Pool de Conexiones**: Se usa asyncpg con pool (min: 2, max: 10 conexiones).

---

## 🐛 Debugging

### Ver Logs del Servidor
```bash
uvicorn main:app --reload --log-level debug
```

### Probar la Conexión a la BD
```bash
python -c "import asyncio; import asyncpg; asyncio.run(asyncpg.connect('postgresql://...'))"
```

---

## 📚 Documentación Adicional

- **FastAPI**: https://fastapi.tiangolo.com
- **Pydantic**: https://docs.pydantic.dev
- **asyncpg**: https://magicstack.github.io/asyncpg
- **Supabase**: https://supabase.com/docs

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025
