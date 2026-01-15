#!/bin/bash

# ==========================================
# SCRIPT DE VERIFICACIÓN PRE-DEPLOY
# ==========================================

echo "🔍 Verificando proyecto IDP Construcción..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# ==========================================
# VERIFICAR FRONTEND
# ==========================================
echo "📦 Verificando Frontend..."

if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json existe"
else
    echo -e "${RED}✗${NC} package.json NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✓${NC} vite.config.ts existe"
else
    echo -e "${RED}✗${NC} vite.config.ts NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "public/_redirects" ]; then
    echo -e "${GREEN}✓${NC} public/_redirects existe"
else
    echo -e "${RED}✗${NC} public/_redirects NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example existe"
else
    echo -e "${YELLOW}⚠${NC}  .env.example NO existe"
fi

if grep -q "VITE_API_URL" .env 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env tiene VITE_API_URL"
else
    echo -e "${YELLOW}⚠${NC}  .env no tiene VITE_API_URL (crear desde .env.example)"
fi

# Verificar que react y react-dom estén en dependencies
if grep -q '"react":' package.json && grep -q '"react-dom":' package.json; then
    echo -e "${GREEN}✓${NC} React está en dependencies"
else
    echo -e "${RED}✗${NC} React NO está en dependencies"
    ERRORS=$((ERRORS+1))
fi

# Verificar que axios esté instalado
if grep -q '"axios":' package.json; then
    echo -e "${GREEN}✓${NC} Axios está instalado"
else
    echo -e "${RED}✗${NC} Axios NO está instalado"
    ERRORS=$((ERRORS+1))
fi

# ==========================================
# VERIFICAR BACKEND
# ==========================================
echo ""
echo "🐍 Verificando Backend..."

if [ -f "backend/main.py" ]; then
    echo -e "${GREEN}✓${NC} backend/main.py existe"
else
    echo -e "${RED}✗${NC} backend/main.py NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} backend/requirements.txt existe"
else
    echo -e "${RED}✗${NC} backend/requirements.txt NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "backend/schema.sql" ]; then
    echo -e "${GREEN}✓${NC} backend/schema.sql existe"
else
    echo -e "${RED}✗${NC} backend/schema.sql NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "backend/.env.example" ]; then
    echo -e "${GREEN}✓${NC} backend/.env.example existe"
else
    echo -e "${YELLOW}⚠${NC}  backend/.env.example NO existe"
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env existe"
    
    if grep -q "DATABASE_HOST" backend/.env; then
        echo -e "${GREEN}✓${NC} backend/.env tiene DATABASE_HOST"
    else
        echo -e "${YELLOW}⚠${NC}  backend/.env no tiene DATABASE_HOST"
    fi
else
    echo -e "${YELLOW}⚠${NC}  backend/.env NO existe (crear desde .env.example)"
fi

# ==========================================
# VERIFICAR SERVICIOS
# ==========================================
echo ""
echo "🔌 Verificando Servicios..."

if [ -f "src/services/apiClient.ts" ]; then
    echo -e "${GREEN}✓${NC} apiClient.ts existe"
else
    echo -e "${RED}✗${NC} apiClient.ts NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "src/services/api.ts" ]; then
    echo -e "${GREEN}✓${NC} api.ts existe"
else
    echo -e "${RED}✗${NC} api.ts NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f "src/services/database.ts" ]; then
    echo -e "${GREEN}✓${NC} database.ts existe"
else
    echo -e "${RED}✗${NC} database.ts NO existe"
    ERRORS=$((ERRORS+1))
fi

# Verificar que database.ts usa la API
if grep -q "obrasAPI" src/services/database.ts; then
    echo -e "${GREEN}✓${NC} database.ts usa la API"
else
    echo -e "${RED}✗${NC} database.ts NO usa la API"
    ERRORS=$((ERRORS+1))
fi

# ==========================================
# VERIFICAR DOCUMENTACIÓN
# ==========================================
echo ""
echo "📚 Verificando Documentación..."

if [ -f "README-PRODUCCION.md" ]; then
    echo -e "${GREEN}✓${NC} README-PRODUCCION.md existe"
else
    echo -e "${RED}✗${NC} README-PRODUCCION.md NO existe"
    ERRORS=$((ERRORS+1))
fi

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore existe"
else
    echo -e "${YELLOW}⚠${NC}  .gitignore NO existe"
fi

# ==========================================
# RESUMEN
# ==========================================
echo ""
echo "========================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODO CORRECTO - Listo para deploy${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Frontend: npm install && npm run build"
    echo "2. Backend: cd backend && pip install -r requirements.txt"
    echo "3. Base de datos: Ejecutar backend/schema.sql"
    echo "4. Ver README-PRODUCCION.md para deploy en Render"
else
    echo -e "${RED}❌ Se encontraron $ERRORS errores${NC}"
    echo "Por favor corrige los errores antes de continuar"
fi
echo "========================================"
