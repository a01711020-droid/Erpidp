# ⚡ QUICK START - Supabase + FastAPI

## 🚀 Setup en 10 minutos

### **1. Aplicar migración en Supabase (2 min)**

```bash
# En Supabase Dashboard:
# 1. Ve a SQL Editor
# 2. New Query
# 3. Copia /supabase/migrations/001_initial_schema.sql
# 4. Execute
# ✅ Tablas creadas
```

### **2. Deploy FastAPI en Railway (5 min)**

```bash
# Opción A: Desde GitHub
1. Sube backend/ a GitHub
2. Railway.app → New Project → Deploy from GitHub
3. Agrega variables de entorno:
   SUPABASE_DB_HOST=db.xxxxx.supabase.co
   SUPABASE_DB_PORT=5432
   SUPABASE_DB_NAME=postgres
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=tu_password
4. Deploy automático
5. URL: https://tu-proyecto.up.railway.app

# Opción B: Local (para testing)
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edita .env con tus credenciales
uvicorn main:app --reload
# http://localhost:8000/docs
```

### **3. Conectar Frontend (3 min)**

```bash
# En Figma Make o tu .env:
VITE_FASTAPI_URL=https://tu-proyecto.up.railway.app

# Probar en cualquier componente:
import { fastApiService } from "@/services/fastapi";

const health = await fastApiService.healthCheck();
console.log(health);  // ✅ { status: "healthy" }
```

---

## 🎯 Primer Caso de Uso: Distribución de Gastos

```typescript
// 1. Calcular distribución del mes actual
const resultado = await fastApiService.calcularDistribucionGastosIndirectos("2025-01");

// 2. Ver resultados
console.log(resultado);
/*
{
  mes: "2025-01",
  total_gastos_indirectos: 85000,
  total_gastos_directos: 396000,
  distribucion: [
    {
      obra_codigo: "227",
      obra_nombre: "CASTELLO E",
      gastos_directos: 50000,
      porcentaje_asignado: 0.126,
      gastos_indirectos_asignados: 10710,
      total_gastos_obra: 60710
    },
    // ... más obras
  ]
}
*/
```

---

## 📊 Obtener Credenciales de Supabase

```bash
# En Supabase Dashboard:
1. Settings → Database
2. Connection Info:
   Host: db.xxxxxxx.supabase.co
   Database: postgres
   Port: 5432
   User: postgres
3. Database Password → Click to reveal
4. Copia y pega en Railway/backend/.env
```

---

## ✅ Checklist Rápido

- [ ] Supabase conectado en Figma Make
- [ ] Migración aplicada (14 tablas creadas)
- [ ] Backend subido a GitHub
- [ ] Railway configurado con variables de entorno
- [ ] FastAPI deployado (URL funcionando)
- [ ] `/health` endpoint responde OK
- [ ] Frontend puede llamar a FastAPI
- [ ] Primer cálculo de distribución funciona

---

## 🔗 URLs Importantes

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

**Railway:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app

**FastAPI:**
- Docs interactivas: `https://tu-api.railway.app/docs`
- Health check: `https://tu-api.railway.app/health`

---

## 🆘 Errores Comunes

### Error: "Connection refused"
```bash
# Verifica credenciales en Railway:
Settings → Variables → SUPABASE_DB_PASSWORD
```

### Error: "CORS"
```python
# En backend/main.py línea 28:
allow_origins=["https://tu-dominio-frontend.com"]
```

### Error: "Module not found"
```bash
cd backend
pip install -r requirements.txt
```

---

## 📝 Siguientes Pasos

1. **Probar todos los endpoints** en `/docs`
2. **Crear componente** para mostrar alertas de vencimientos
3. **Migrar módulos** uno por uno de mock data a Supabase
4. **Agregar autenticación** con Supabase Auth

---

## 💡 Ejemplo Completo en Componente

```typescript
import { useEffect, useState } from "react";
import { fastApiService } from "@/services/fastapi";

export default function Dashboard() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    async function cargarAlertas() {
      const data = await fastApiService.obtenerAlertasVencimiento();
      setAlertas(data);
    }
    cargarAlertas();
  }, []);

  return (
    <div>
      <h1>Alertas de Vencimientos</h1>
      {alertas.map(alerta => (
        <div key={alerta.orden_compra_id}>
          <span>{alerta.numero_orden}</span>
          <span className={alerta.urgencia === "vencido" ? "text-red-500" : ""}>
            {alerta.dias_restantes} días
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

**¡Listo para empezar!** 🚀

Ver documentación completa en:
- `/backend/README.md` - Guía detallada FastAPI
- `/README_SISTEMA_COMPLETO.md` - Arquitectura completa
