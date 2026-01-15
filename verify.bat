@echo off
REM ==========================================
REM SCRIPT DE VERIFICACIÓN PRE-DEPLOY (Windows)
REM ==========================================

echo.
echo Verificando proyecto IDP Construcción...
echo.

set ERRORS=0

REM ==========================================
REM VERIFICAR FRONTEND
REM ==========================================
echo Verificando Frontend...

if exist "package.json" (
    echo [OK] package.json existe
) else (
    echo [ERROR] package.json NO existe
    set /a ERRORS+=1
)

if exist "vite.config.ts" (
    echo [OK] vite.config.ts existe
) else (
    echo [ERROR] vite.config.ts NO existe
    set /a ERRORS+=1
)

if exist "public\_redirects" (
    echo [OK] public/_redirects existe
) else (
    echo [ERROR] public/_redirects NO existe
    set /a ERRORS+=1
)

if exist ".env.example" (
    echo [OK] .env.example existe
) else (
    echo [WARN] .env.example NO existe
)

if exist ".env" (
    echo [OK] .env existe
) else (
    echo [WARN] .env NO existe ^(crear desde .env.example^)
)

REM ==========================================
REM VERIFICAR BACKEND
REM ==========================================
echo.
echo Verificando Backend...

if exist "backend\main.py" (
    echo [OK] backend/main.py existe
) else (
    echo [ERROR] backend/main.py NO existe
    set /a ERRORS+=1
)

if exist "backend\requirements.txt" (
    echo [OK] backend/requirements.txt existe
) else (
    echo [ERROR] backend/requirements.txt NO existe
    set /a ERRORS+=1
)

if exist "backend\schema.sql" (
    echo [OK] backend/schema.sql existe
) else (
    echo [ERROR] backend/schema.sql NO existe
    set /a ERRORS+=1
)

if exist "backend\.env.example" (
    echo [OK] backend/.env.example existe
) else (
    echo [WARN] backend/.env.example NO existe
)

if exist "backend\.env" (
    echo [OK] backend/.env existe
) else (
    echo [WARN] backend/.env NO existe ^(crear desde .env.example^)
)

REM ==========================================
REM VERIFICAR SERVICIOS
REM ==========================================
echo.
echo Verificando Servicios...

if exist "src\services\apiClient.ts" (
    echo [OK] apiClient.ts existe
) else (
    echo [ERROR] apiClient.ts NO existe
    set /a ERRORS+=1
)

if exist "src\services\api.ts" (
    echo [OK] api.ts existe
) else (
    echo [ERROR] api.ts NO existe
    set /a ERRORS+=1
)

if exist "src\services\database.ts" (
    echo [OK] database.ts existe
) else (
    echo [ERROR] database.ts NO existe
    set /a ERRORS+=1
)

REM ==========================================
REM VERIFICAR DOCUMENTACIÓN
REM ==========================================
echo.
echo Verificando Documentación...

if exist "README-PRODUCCION.md" (
    echo [OK] README-PRODUCCION.md existe
) else (
    echo [ERROR] README-PRODUCCION.md NO existe
    set /a ERRORS+=1
)

if exist ".gitignore" (
    echo [OK] .gitignore existe
) else (
    echo [WARN] .gitignore NO existe
)

REM ==========================================
REM RESUMEN
REM ==========================================
echo.
echo ========================================
if %ERRORS% EQU 0 (
    echo [OK] TODO CORRECTO - Listo para deploy
    echo.
    echo Próximos pasos:
    echo 1. Frontend: npm install ^&^& npm run build
    echo 2. Backend: cd backend ^&^& pip install -r requirements.txt
    echo 3. Base de datos: Ejecutar backend/schema.sql
    echo 4. Ver README-PRODUCCION.md para deploy en Render
) else (
    echo [ERROR] Se encontraron %ERRORS% errores
    echo Por favor corrige los errores antes de continuar
)
echo ========================================
echo.

pause
