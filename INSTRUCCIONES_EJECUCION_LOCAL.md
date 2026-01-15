# 🚀 Instrucciones de Ejecución Local

## ✅ Estado del Proyecto

**El proyecto está 100% listo para ejecutarse localmente sin dependencias de Figma.**

---

## 📋 Requisitos Previos

- **Node.js**: v16 o superior
- **npm**: v7 o superior (viene con Node.js)
- **Git**: Para clonar el repositorio (opcional)

---

## 🛠️ Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

**Tiempo estimado**: 1-3 minutos (dependiendo de tu conexión)

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

**Resultado esperado**:
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3. Abrir en navegador

Abre tu navegador y visita:
```
http://localhost:5173/
```

---

## 🏗️ Build para Producción

### Compilar el proyecto

```bash
npm run build
```

**Resultado esperado**:
- Carpeta `/dist` creada con archivos optimizados
- Listo para deployment en cualquier servidor estático

### Vista previa del build

```bash
npx vite preview
```

---

## 📁 Estructura del Proyecto

```
/
├── public/                 # Assets estáticos
│   └── logo-idp.svg       # Logo principal ✅
│
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Componente raíz
│   │   ├── AppRouter.tsx              # Router con React Router
│   │   ├── MainApp.tsx                # Sistema de navegación alternativo
│   │   ├── Home.tsx                   # Pantalla de inicio
│   │   ├── GlobalDashboard.tsx        # Dashboard principal
│   │   ├── components/                # Componentes reutilizables
│   │   └── utils/
│   │       └── generatePurchaseOrderPDF.ts  # Generador de PDFs
│   │
│   ├── data/              # Datos JSON mock
│   ├── styles/            # Estilos CSS
│   └── types/             # Tipos TypeScript
│
├── package.json           # Dependencias y scripts
└── vite.config.ts        # Configuración de Vite
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npx vite preview` | Preview del build de producción |

---

## 🎨 Módulos Disponibles

El sistema incluye los siguientes módulos:

1. **Dashboard Global** - `/`
   - Vista empresarial completa
   - Protegido con contraseña: `idpjedi01`

2. **Requisiciones** - `/requisiciones`
   - Gestión de solicitudes de material
   - Control por obra y residente

3. **Órdenes de Compra** - `/ordenes-compra`
   - Creación y gestión de OCs
   - Generación de PDFs

4. **Pagos** - `/pagos`
   - Control de pagos a proveedores
   - Vinculación con OCs

5. **Destajos** - `/destajos`
   - Gestión de trabajos por destajo
   - Análisis por obra y destajista

6. **Contratos** - `/contratos`
   - Seguimiento físico de obras
   - Estimaciones y avances

7. **Gastos** - `/gastos`
   - Detalle de gastos por obra
   - Distribución de gastos indirectos

---

## 🔐 Acceso al Dashboard Global

**Contraseña actual**: `idpjedi01`

**Nota**: En producción, la contraseña debería estar en variables de entorno o en el backend.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Puerto 5173 en uso

```bash
# Vite automáticamente usará el siguiente puerto disponible
# O especifica un puerto manualmente:
npm run dev -- --port 3000
```

### Error: "Failed to load config"

```bash
# Verifica que vite.config.ts existe
# Si no, el archivo está en la raíz del proyecto
```

### PDFs no generan logo

**Esto es normal**. El logo SVG no es compatible con jsPDF directamente.

**Opciones**:
1. Usar el placeholder actual (ya configurado, se ve profesional)
2. Crear `/public/logo-idp-pdf.png` y actualizar la referencia

---

## 📱 Navegación

### Usando AppRouter (React Router)

El proyecto usa React Router. Las rutas son:
- `/` - Dashboard Global
- `/requisiciones` - Requisiciones
- `/ordenes-compra` - Órdenes de Compra
- `/pagos` - Pagos
- `/destajos` - Destajos
- `/contratos` - Contratos
- `/gastos` - Gastos

### Usando MainApp (Sistema Alternativo)

Si prefieres usar `MainApp.tsx` en lugar de `AppRouter.tsx`:

1. Edita `/src/app/App.tsx`:
```typescript
import MainApp from "./MainApp";

export default function App() {
  return <MainApp />;
}
```

2. Reinicia el servidor

---

## 🎯 Control de Acceso por Roles

El sistema tiene 4 roles configurados:

| Rol | Módulos Permitidos |
|-----|-------------------|
| **Admin** | Todos los módulos |
| **Residente** | Requisiciones, Contratos, Gastos |
| **Compras** | Requisiciones, Órdenes de Compra |
| **Pagos** | Pagos |

Para cambiar el rol actual, edita `/src/app/MainApp.tsx`:

```typescript
const currentUser: User = {
  name: "Sistema de Gestión",
  role: "admin", // Cambia a: "residente", "compras", "pagos"
  allowedModules: [...],
};
```

---

## 📊 Datos de Prueba

El sistema incluye datos mock en `/src/data/`:

- `obras.json` - Obras activas
- `ordenesCompra.json` - Órdenes de compra
- `requisiciones.json` - Requisiciones de material
- `pagos.json` - Pagos registrados
- `proveedores.json` - Catálogo de proveedores
- `destajos.json` - Trabajos por destajo

**Nota**: Estos datos son para desarrollo. El sistema también puede conectarse a Supabase + FastAPI.

---

## 🔄 Backend (Opcional)

El sistema puede funcionar con:

1. **Datos Mock** (actual)
   - Archivos JSON en `/src/data`
   - No requiere configuración adicional
   - ✅ Funcionando

2. **Supabase + FastAPI** (opcional)
   - Backend configurado en `/backend`
   - Requiere configuración adicional
   - Ver `/backend/README.md`

---

## ✅ Checklist de Verificación

Antes de iniciar desarrollo:

- [ ] `npm install` completado sin errores
- [ ] `npm run dev` inicia sin errores
- [ ] Navegador muestra la aplicación en `localhost:5173`
- [ ] Logos se ven correctamente
- [ ] Puedes navegar entre módulos
- [ ] Dashboard Global requiere contraseña
- [ ] PDFs se generan correctamente

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté instalado: `npm --version`
3. Revisa la consola del navegador (F12) para errores
4. Revisa la terminal donde corre `npm run dev` para errores

---

## 🎉 ¡Listo!

Tu proyecto está configurado y listo para desarrollo local.

**Siguiente paso**: 
- Confirma si necesitas agregar el segundo logo mencionado
- Decide si quieres usar logo PNG para PDFs
- ¡Empieza a desarrollar!
