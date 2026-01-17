# ⚡ INICIO RÁPIDO - Sistema IDP

## 3 pasos para tener el sistema funcionando

---

## 🗄️ PASO 1: Base de Datos (Supabase)

### 1.1 Crear cuenta y proyecto
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. Guarda la contraseña de la base de datos

### 1.2 Ejecutar esquema SQL
1. En Supabase, ve a **SQL Editor**
2. Copia TODO el contenido de `/database/schema.sql`
3. Pega y ejecuta (Run)
4. Verifica que se crearon 9 tablas

### 1.3 Obtener connection string
1. Ve a **Settings** → **Database**
2. Copia el **Connection string** (URI)
3. Algo como: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

---

## 🐍 PASO 2: Backend FastAPI

### 2.1 Instalar y configurar
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2.2 Crear `.env`
Crea `/backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 2.3 Ejecutar
```bash
uvicorn main:app --reload --port 8000
```

### 2.4 Probar
Abre: [http://localhost:8000/health](http://localhost:8000/health)

Deberías ver:
```json
{"status": "healthy", "database": "connected"}
```

---

## ⚛️ PASO 3: Frontend React

### 3.1 Activar ApiProvider
Edita `/src/app/providers/index.ts`:
```typescript
// Comentar MockProvider
// export const dataProvider = MockProvider;

// Descomentar ApiProvider
import { ApiProvider } from "./ApiProvider";
export const dataProvider = new ApiProvider();
```

### 3.2 Configurar variable de entorno
Crea `/.env` (en la raíz):
```env
VITE_API_URL=http://localhost:8000
```

### 3.3 Ejecutar
```bash
# En la raíz del proyecto
pnpm run dev
```

### 3.4 Probar
1. Abre [http://localhost:5173](http://localhost:5173)
2. Ve al módulo de **Compras**
3. Crea una OC
4. Refresca la página (F5)
5. **¿Sigue ahí?** ✅ **¡FUNCIONA!**

---

## 🎉 ¡LISTO!

Ahora tienes:
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Backend FastAPI corriendo en localhost:8000
- ✅ Frontend React corriendo en localhost:5173
- ✅ **Persistencia real de datos**

---

## 📚 Siguientes pasos

### Para desplegar en producción
Lee: `/GUIA_DESPLIEGUE_COMPLETO.md`

### Para entender el sistema
Lee: `/FUNCIONALIDADES.md`

### Para revisar el backend
Lee: `/backend/README.md`

### Para probar la API
```bash
cd backend
python test_api.py
```

---

## 🆘 ¿Problemas?

### Backend no conecta a la BD
1. Verifica que `DATABASE_URL` esté correcto en `/backend/.env`
2. Asegúrate de reemplazar `[PASSWORD]` con tu contraseña real
3. Prueba el health check: `http://localhost:8000/health`

### Frontend muestra datos de MOCK
1. Verifica que hayas activado `ApiProvider` en `/src/app/providers/index.ts`
2. Asegúrate de que `VITE_API_URL` esté configurado en `/.env`
3. Reinicia el servidor de desarrollo (`pnpm run dev`)

### Error de CORS
1. El backend FastAPI ya tiene CORS habilitado
2. Si persiste, verifica que el backend esté corriendo
3. Revisa la consola del navegador (F12 → Console)

---

**Tiempo estimado**: 15-20 minutos

**Dificultad**: ⭐⭐☆☆☆ (Fácil)
