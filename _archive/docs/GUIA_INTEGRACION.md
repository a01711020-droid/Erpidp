# 🔗 GUÍA DE INTEGRACIÓN Y TRANSPORTABILIDAD
## Sistema IDP - Frontend Transportable

---

## 🎯 OBJETIVO

Este documento explica cómo **transportar, fusionar o integrar** el sistema IDP con otros proyectos o backends.

---

## 📦 CARACTERÍSTICAS DE TRANSPORTABILIDAD

### **1. Frontend 100% Independiente**
```
✅ Sin dependencias de backend
✅ Sin llamadas API externas
✅ Sin configuración de servidor
✅ Sin variables de entorno requeridas
✅ Funciona completamente offline
```

### **2. Sistema Modular**
```
✅ Cada módulo es independiente
✅ Componentes reutilizables
✅ Fácil separación en micro-frontends
✅ Posibilidad de usar módulos individuales
```

### **3. Data Provider Intercambiable**
```
✅ Interfaz común (IDataProvider)
✅ Fácil swap Mock → API
✅ Preparado para backend real
✅ Sin lógica de negocio en UI
```

---

## 🚀 ESCENARIOS DE USO

### **Escenario 1: Usar Como Está (Demo/Prototipo)**

#### **Instalación:**
```bash
# Clonar o copiar proyecto
git clone <repo>
cd proyecto-idp

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

#### **Deploy en Netlify/Vercel:**
```bash
# Build command
npm run build

# Publish directory
dist

# No requiere variables de entorno
```

---

### **Escenario 2: Integrar en Proyecto Existente**

#### **Opción A: Copiar Módulos Completos**

1. **Copiar archivos necesarios:**
```bash
# Estructura mínima
src/app/
  ├── PurchaseOrderManagement.tsx    # Módulo de compras
  ├── components/
  │   ├── SupplierManagement.tsx
  │   ├── PasswordDialog.tsx
  │   ├── PurchaseOrderForm.tsx
  │   └── ui/                         # Componentes base
  ├── providers/
  │   ├── MockProvider.ts
  │   ├── mockData.ts
  │   └── DataProvider.interface.ts
  ├── types/
  │   └── entities.ts
  └── utils/
      └── codeGenerators.ts
```

2. **Configurar TailwindCSS:**
```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FFFBF0',
          100: '#FFF3D6',
          200: '#FFE8AD',
          300: '#FFD88A',
          400: '#F5C571',
          500: '#E8B45C',
          600: '#C99A47',
          700: '#A87C32',
          800: '#8B6524',
          900: '#6B4E1A',
        }
      }
    }
  }
}
```

3. **Importar en tu aplicación:**
```tsx
import PurchaseOrderManagement from './app/PurchaseOrderManagement';

function App() {
  return <PurchaseOrderManagement />;
}
```

#### **Opción B: Extraer Componentes Específicos**

```tsx
// Solo usar gestión de proveedores
import { SupplierManagement } from './app/components/SupplierManagement';
import { PasswordDialog } from './app/components/PasswordDialog';

function MyApp() {
  const [showSuppliers, setShowSuppliers] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowSuppliers(true)}>
        Gestión de Proveedores
      </button>
      
      <SupplierManagement 
        isOpen={showSuppliers}
        onClose={() => setShowSuppliers(false)}
      />
    </>
  );
}
```

---

### **Escenario 3: Conectar con Backend Propio**

#### **Paso 1: Crear ApiProvider Personalizado**

```typescript
// src/app/providers/CustomApiProvider.ts
import type { IDataProvider } from './DataProvider.interface';

class CustomApiProvider implements IDataProvider {
  private baseUrl = 'https://tu-backend.com/api';
  
  // Obras
  async getObras() {
    const response = await fetch(`${this.baseUrl}/obras`);
    return response.json();
  }
  
  async getObraById(id: string) {
    const response = await fetch(`${this.baseUrl}/obras/${id}`);
    return response.json();
  }
  
  async createObra(data: any) {
    const response = await fetch(`${this.baseUrl}/obras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  // ... implementar todos los métodos de IDataProvider
}

export const customApiProvider = new CustomApiProvider();
```

#### **Paso 2: Actualizar index.ts**

```typescript
// src/app/providers/index.ts
import { customApiProvider } from './CustomApiProvider';

export const dataProvider = customApiProvider;
```

#### **Paso 3: Ajustar Tipos si es Necesario**

```typescript
// src/app/types/custom-entities.ts
import type { Obra } from './entities';

// Extender tipos si tu backend tiene campos adicionales
export interface ObraExtended extends Obra {
  departamento?: string;
  presupuestoAnual?: number;
  // ... campos personalizados
}
```

---

### **Escenario 4: Separar en Micro-Frontends**

#### **Estructura para 5 URLs Diferentes:**

```
idp-home/
├── src/app/Home.tsx              # Deploy: idp-home.onrender.com
└── package.json

idp-dashboard/
├── src/app/GlobalDashboard.tsx   # Deploy: idp-dashboard.onrender.com
└── package.json

idp-compras/
├── src/app/PurchaseOrderManagement.tsx  # Deploy: idp-compras.onrender.com
└── package.json

idp-requisiciones/
├── src/app/MaterialRequisitions.tsx  # Deploy: idp-requisiciones.onrender.com
└── package.json

idp-pagos/
├── src/app/PaymentManagement.tsx  # Deploy: idp-pagos.onrender.com
└── package.json

idp-seguimiento/
├── src/app/ContractTracking.tsx   # Deploy: idp-seguimiento.onrender.com
└── package.json
```

#### **Compartir Base de Datos:**

```typescript
// Cada micro-frontend usa el mismo ApiProvider
// providers/ApiProvider.ts en TODOS los proyectos

class ApiProvider implements IDataProvider {
  // Todos apuntan a la misma DB
  private baseUrl = 'https://idp-api.onrender.com';
  
  // Headers con autenticación compartida
  private headers = {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.VITE_API_KEY
  };
  
  // ... métodos implementados
}
```

#### **Configuración de CORS en Backend:**

```python
# FastAPI backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Permitir todos los micro-frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://idp-home.onrender.com",
        "https://idp-dashboard.onrender.com",
        "https://idp-compras.onrender.com",
        "https://idp-requisiciones.onrender.com",
        "https://idp-pagos.onrender.com",
        "https://idp-seguimiento.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🔌 INTERFACES Y CONTRATOS

### **IDataProvider - Contrato Completo**

Cualquier backend debe implementar estos métodos:

```typescript
interface IDataProvider {
  // ============= OBRAS =============
  getObras(params?: ListParams): Promise<PaginatedResponse<Obra>>;
  getObraById(id: string): Promise<Obra>;
  createObra(obra: ObraCreate): Promise<Obra>;
  updateObra(id: string, updates: ObraUpdate): Promise<Obra>;
  deleteObra(id: string): Promise<void>;
  
  // ============= PROVEEDORES =============
  getProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>>;
  getProveedorById(id: string): Promise<Proveedor>;
  createProveedor(proveedor: ProveedorCreate): Promise<Proveedor>;
  updateProveedor(id: string, updates: ProveedorUpdate): Promise<Proveedor>;
  deleteProveedor(id: string): Promise<void>;
  
  // ============= REQUISICIONES =============
  getRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>>;
  getRequisicionById(id: string): Promise<Requisicion>;
  createRequisicion(requisicion: RequisicionCreate): Promise<Requisicion>;
  updateRequisicion(id: string, updates: RequisicionUpdate): Promise<Requisicion>;
  deleteRequisicion(id: string): Promise<void>;
  
  // ============= ÓRDENES DE COMPRA =============
  getOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>>;
  getOrdenCompraById(id: string): Promise<OrdenCompra>;
  createOrdenCompra(orden: OrdenCompraCreate): Promise<OrdenCompra>;
  updateOrdenCompra(id: string, updates: OrdenCompraUpdate): Promise<OrdenCompra>;
  deleteOrdenCompra(id: string): Promise<void>;
  
  // ============= PAGOS =============
  getPagos(params?: ListParams): Promise<PaginatedResponse<Pago>>;
  getPagoById(id: string): Promise<Pago>;
  createPago(pago: PagoCreate): Promise<Pago>;
  updatePago(id: string, updates: PagoUpdate): Promise<Pago>;
  deletePago(id: string): Promise<void>;
}
```

### **Formato de Respuestas**

#### **Listado Paginado:**
```typescript
{
  data: T[],              // Array de elementos
  total: number,          // Total de elementos en DB
  page: number,           // Página actual (1-indexed)
  pageSize: number,       // Elementos por página
  totalPages: number      // Total de páginas
}
```

#### **Elemento Individual:**
```typescript
{
  id: "uuid-string",
  // ... resto de campos según entidad
  createdAt: "2025-01-23T10:30:00Z",
  updatedAt: "2025-01-23T10:30:00Z"
}
```

#### **Error:**
```typescript
{
  error: string,          // Mensaje de error
  code: string,           // Código de error (opcional)
  details?: any           // Detalles adicionales
}
```

---

## 🗄️ MIGRACIÓN DE DATOS

### **Exportar Datos del MockProvider**

```typescript
// Script de exportación
import { mockProvider } from './providers/MockProvider';

async function exportData() {
  const obras = await mockProvider.getObras();
  const proveedores = await mockProvider.getProveedores();
  const requisiciones = await mockProvider.getRequisiciones();
  const ordenes = await mockProvider.getOrdenesCompra();
  const pagos = await mockProvider.getPagos();
  
  const exportData = {
    obras: obras.data,
    proveedores: proveedores.data,
    requisiciones: requisiciones.data,
    ordenes: ordenes.data,
    pagos: pagos.data,
    exportedAt: new Date().toISOString()
  };
  
  // Guardar en JSON
  const json = JSON.stringify(exportData, null, 2);
  console.log(json);
  
  // O descargar como archivo
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'idp-data-export.json';
  a.click();
}
```

### **Importar Datos a Backend**

```python
# Script Python para FastAPI/PostgreSQL
import json
import psycopg2
from datetime import datetime

def import_data(json_file_path):
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    conn = psycopg2.connect("postgresql://...")
    cur = conn.cursor()
    
    # Importar obras
    for obra in data['obras']:
        cur.execute("""
            INSERT INTO obras (id, codigo, nombre, numero_contrato, ...)
            VALUES (%s, %s, %s, %s, ...)
        """, (obra['id'], obra['codigo'], ...))
    
    # Importar proveedores
    for proveedor in data['proveedores']:
        cur.execute("""
            INSERT INTO proveedores (id, razon_social, rfc, ...)
            VALUES (%s, %s, %s, ...)
        """, (proveedor['id'], proveedor['razonSocial'], ...))
    
    # ... continuar con otras entidades
    
    conn.commit()
    cur.close()
    conn.close()
```

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### **Implementar Autenticación**

```typescript
// providers/AuthenticatedApiProvider.ts
class AuthenticatedApiProvider implements IDataProvider {
  private token: string | null = null;
  
  async login(username: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const { token } = await response.json();
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }
  
  async getObras() {
    const response = await fetch('/api/obras', {
      headers: this.getHeaders()
    });
    return response.json();
  }
  
  // ... todos los métodos usan getHeaders()
}
```

### **Proteger Rutas en el Frontend**

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('auth_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Uso
<Route path="/compras" element={
  <ProtectedRoute>
    <PurchaseOrderManagement />
  </ProtectedRoute>
} />
```

---

## 🎨 PERSONALIZACIÓN DE ESTILOS

### **Cambiar Tema de Colores**

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Reemplazar colores cálidos por tus propios colores
        primary: {
          50: '#...',
          100: '#...',
          // ...
          900: '#...'
        }
      }
    }
  }
}
```

```css
/* src/styles/theme.css */
/* Actualizar variables CSS */
:root {
  --background: #FFFFFF;
  --foreground: #000000;
  --primary: #YOUR_COLOR;
  --primary-foreground: #FFFFFF;
  /* ... */
}
```

### **Cambiar Logos**

```tsx
// Reemplazar archivos en /public/
/public/
├── logo-idp-normal.svg      → tu-logo-normal.svg
├── logo-idp-alterno.svg     → tu-logo-alterno.svg
└── logo-idp.svg             → tu-logo.svg

// Actualizar referencias en componentes
<img src="/tu-logo-normal.svg" alt="Tu Empresa" />
```

---

## 📋 CHECKLIST DE INTEGRACIÓN

### **Para Usar Frontend Standalone:**
- [ ] Ejecutar `npm install`
- [ ] Verificar que corre con `npm run dev`
- [ ] Personalizar logos y colores (opcional)
- [ ] Construir con `npm run build`
- [ ] Deploy en hosting estático

### **Para Conectar con Backend:**
- [ ] Crear ApiProvider personalizado
- [ ] Implementar todos los métodos de IDataProvider
- [ ] Configurar URLs de endpoints
- [ ] Configurar CORS en backend
- [ ] Implementar autenticación (si aplica)
- [ ] Probar conexión y flujo de datos
- [ ] Migrar datos de MockProvider (si aplica)

### **Para Micro-Frontends:**
- [ ] Separar módulos en proyectos independientes
- [ ] Configurar routing en cada proyecto
- [ ] Configurar ApiProvider compartido
- [ ] Configurar variables de entorno por proyecto
- [ ] Deploy cada módulo en URL separada
- [ ] Configurar CORS para todas las URLs
- [ ] Probar comunicación entre módulos vía DB

---

## 🐛 DEBUGGING Y TROUBLESHOOTING

### **Problema: Tipos TypeScript no coinciden**

```typescript
// Opción 1: Extender tipos
interface MiOrdenCompra extends OrdenCompra {
  campoAdicional: string;
}

// Opción 2: Usar type assertion
const orden = response as OrdenCompra;

// Opción 3: Mapear respuesta
function mapToOrdenCompra(data: any): OrdenCompra {
  return {
    id: data.id,
    numeroOrden: data.numero_orden,
    // ... mapear todos los campos
  };
}
```

### **Problema: CORS al conectar backend**

```javascript
// Backend (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  // Dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

// Frontend (Vite)
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

### **Problema: Fechas no se muestran correctamente**

```typescript
// Asegurar formato ISO en backend
// Python FastAPI:
from datetime import datetime
fecha = datetime.now().isoformat()  # "2025-01-23T10:30:00"

// TypeScript:
const fecha = new Date().toISOString();  // "2025-01-23T10:30:00.000Z"

// Parsear en frontend:
const fechaObj = new Date(fechaString);
const fechaFormateada = fechaObj.toLocaleDateString('es-MX');
```

---

## 📚 RECURSOS ADICIONALES

### **Documentación de Referencia:**
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)

### **Arquitectura Recomendada para Backend:**
```
FastAPI (Python)
├── PostgreSQL (Supabase)
├── Redis (caché, opcional)
├── JWT Authentication
└── RESTful API con paginación
```

### **Estructura de Base de Datos:**
```sql
-- Referirse a los tipos en:
/src/app/types/entities.ts

-- Cada interface TypeScript corresponde a una tabla SQL
-- Los campos están documentados con sus tipos SQL
```

---

## 🎯 MEJORES PRÁCTICAS

### **1. Mantener Separación de Responsabilidades**
```
UI (Componentes) → Lógica de Presentación
Providers → Lógica de Datos
Types → Contratos/Modelos
Utils → Funciones Auxiliares
```

### **2. Validación en Frontend y Backend**
```typescript
// Frontend: UX mejorada
const validarRFC = (rfc: string) => {
  if (rfc.length !== 13) return false;
  // ... validación
};

// Backend: Seguridad
def validar_rfc(rfc: str):
    if len(rfc) != 13:
        raise ValueError("RFC inválido")
    # ... validación
```

### **3. Manejo de Errores Consistente**
```typescript
try {
  await dataProvider.createObra(data);
  toast.success("Obra creada exitosamente");
} catch (error) {
  console.error("Error al crear obra:", error);
  toast.error("Error al crear obra");
}
```

### **4. Testing**
```typescript
// Probar con MockProvider antes de conectar backend
import { mockProvider } from './providers/MockProvider';

test('crear obra', async () => {
  const obra = await mockProvider.createObra({
    codigo: "999",
    nombre: "Test"
    // ...
  });
  
  expect(obra.codigo).toBe("999");
});
```

---

## 🚀 DEPLOYMENT

### **Opción 1: Netlify**
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Opción 2: Vercel**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Opción 3: Render (Static Site)**
```yaml
# render.yaml
services:
  - type: web
    name: idp-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
```

### **Opción 4: Docker**
```dockerfile
# Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 💡 TIPS FINALES

### **Para Desarrollo Rápido:**
1. Usa MockProvider primero
2. Diseña UI/UX sin preocuparte por backend
3. Cuando esté listo, conecta ApiProvider
4. Migra datos de prueba

### **Para Producción:**
1. Implementa autenticación robusta
2. Valida TODOS los inputs en backend
3. Usa HTTPS siempre
4. Implementa rate limiting
5. Logs detallados para debugging
6. Backups automáticos de DB

### **Para Escalabilidad:**
1. Considera separar en micro-frontends
2. Implementa caché (Redis)
3. Paginación en listados grandes
4. Lazy loading de módulos
5. CDN para assets estáticos

---

**FIN DE LA GUÍA DE INTEGRACIÓN**
