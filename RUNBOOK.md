# RUNBOOK - ERP IDP

## Ejecución local (Windows Git Bash)

La **fuente de verdad** para instalación y variables es `README.md`. Sigue ese documento para
configurar base de datos, backend y frontend.

### Verificación de schema (opcional)
```bash
python backend/scripts/check_db.py
```

## Render (SPA routing)
El archivo `public/_redirects` ya existe como archivo y contiene:
```
/* /index.html 200
```

## Validaciones rápidas
- `/health` responde `{"status":"healthy","database":"connected"}` (503 si la BD no está disponible).
- Crear obra → refrescar → persiste.
- Crear proveedor → refrescar → persiste.
- Crear OC → refrescar → persiste.
- Registrar pago parcial → saldo disminuye.
- Ver métricas en `/dashboard/obras/:obraId` (comprometido, pagado, saldo).
- Refresh mantiene rutas (`/dashboard`, `/obras`, `/proveedores`, `/compras/ordenes-compra`, `/pagos`).

## Troubleshooting
- **ERR_CONNECTION_REFUSED**: backend caído o `VITE_API_URL` incorrecto.
- **DATABASE_URL inválida**: backend no arranca; corrige `backend/.env`.
- **422**: revisar payload (camelCase ↔ snake_case) y detalle de error.
- **Refresh en Render vuelve al home**: falta `public/_redirects`.
- **Imágenes no cargan**: verificar rutas absolutas desde `/public`.
