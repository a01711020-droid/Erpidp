# Guia de Deployment - ERP IDP Frontend

## Stack
- Frontend: React + Vite -> Azure Static Web Apps (gratis)
- Backend: FastAPI -> Azure App Service B1 (~$13-15/mes)
- Base de datos: PostgreSQL Flexible Server B1ms (~$12/mes)
- Total estimado: ~$25-30 USD/mes

---

## Pasos para el primer deploy

### 1. Crear el recurso en Azure

```bash
az login
az group create --name rg-erp-idp --location eastus
az staticwebapp create \
  --name erp-idp-frontend \
  --resource-group rg-erp-idp \
  --location eastus \
  --source https://github.com/a01711020-droid/Erpidp \
  --branch main \
  --output-location dist \
  --login-with-github
```

### 2. Obtener el deployment token

En Azure Portal:
1. Ir al recurso erp-idp-frontend
2. Settings -> Deployment token
3. Copiar el token

### 3. Configurar secrets en GitHub

Repo -> Settings -> Secrets and variables -> Actions:

| Secret | Valor |
|--------|-------|
| AZURE_STATIC_WEB_APPS_API_TOKEN | Token del paso 2 |
| VITE_API_BASE_URL | URL del backend FastAPI en Azure |

### 4. Activar el workflow

Renombra el archivo `deploy-azure.yml.txt` a `.github/workflows/deploy-azure.yml`
Luego cada push a main dispara el deploy automaticamente (~2-3 min).

---

## Variables de entorno por ambiente

Desarrollo local (.env.local):
  VITE_MOCK_MODE=true
  VITE_SIMULATE_DELAY=true

Produccion (GitHub Secrets):
  VITE_MOCK_MODE=false
  VITE_API_BASE_URL=https://erp-idp-api.azurewebsites.net/api/v1

---

## Proximos pasos (Backend)

1. Crear Azure App Service para FastAPI
2. Crear Azure Database for PostgreSQL
3. Configurar CORS en FastAPI para el dominio de Static Web Apps
4. Configurar VITE_API_BASE_URL en GitHub Secrets
5. Implementar endpoint POST /api/v1/auth/login que retorne JWT
