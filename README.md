# 🏗️ Sistema de Gestión IDP Construcción

Sistema integral de gestión empresarial para IDP Construcción, Consultoría y Diseño. Control completo de obras, compras, pagos, requisiciones y destajos.

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Node.js** versión 18 o superior
- **npm** o **pnpm** (recomendado)

### 1️⃣ Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-carpeta-proyecto>
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

O si usas pnpm:

```bash
pnpm install
```

**Dependencias principales que se instalarán:**
- React 18.3.1
- React Router DOM 7.12.0
- TypeScript
- Tailwind CSS 4.1.12
- Vite 6.3.5
- jsPDF 4.0.0 (generación de PDFs)
- xlsx 0.18.5 (manejo de Excel)
- Lucide React (iconos)
- Motion (animaciones)
- Recharts (gráficas)
- Y más... (ver `package.json` completo)

### 3️⃣ Ejecutar en Desarrollo

```bash
npm run dev
```

El proyecto se abrirá automáticamente en: **http://localhost:5173/**

### 4️⃣ Build para Producción

```bash
npm run build
```

Esto generará los archivos optimizados en la carpeta `/dist`

### 5️⃣ Preview del Build

```bash
npm run preview
```

---

## 🌐 Deploy en Render

### Opción A: Deploy Automático desde GitHub

1. **Conecta tu repositorio a Render:**
   - Ve a [Render.com](https://render.com)
   - Click en **"New +"** → **"Static Site"**
   - Conecta tu repositorio de GitHub

2. **Configura el proyecto:**
   ```
   Name: idp-gestion (o el nombre que quieras)
   Branch: main
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Agrega archivo de redirección:**
   
   Ya está creado en `/public/_redirects` con el contenido:
   ```
   /*    /index.html   200
   ```
   
   Esto es necesario para que React Router funcione en producción.

4. **Deploy:**
   - Click en **"Create Static Site"**
   - Render automáticamente construirá y desplegará tu app
   - Te dará una URL: `https://tu-app.onrender.com`

### Opción B: Deploy Manual

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `/dist` a Render** manualmente desde el dashboard.

### Verificación Post-Deploy

Verifica que estas rutas funcionen:

```
✅ https://tu-app.onrender.com/                                → Home
✅ https://tu-app.onrender.com/dashboard                       → Dashboard Global
✅ https://tu-app.onrender.com/compras                         → Compras
✅ https://tu-app.onrender.com/requisiciones                   → Requisiciones
✅ https://tu-app.onrender.com/pagos                           → Pagos
✅ https://tu-app.onrender.com/dashboard/castello-h/contratos  → Sub-módulos
```

---

## 📁 Estructura del Proyecto

```
/
├── public/                      # Archivos estáticos
│   ├── _redirects              # Configuración para Render
│   ├── logo-idp.svg            # Logo azul (UI web)
│   └── logo-idp-alt.svg        # Logo amarillo (PDFs)
│
├── src/
│   ├── app/                    # Componentes principales
│   │   ├── Home.tsx            # Pantalla de inicio (5 módulos)
│   │   ├── AppRouter.tsx       # Rutas de la aplicación
│   │   ├── GlobalDashboard.tsx # Dashboard empresarial
│   │   ├── PurchaseOrderManagement.tsx  # Módulo de Compras
│   │   ├── MaterialRequisitions.tsx     # Requisiciones
│   │   ├── PaymentManagement.tsx        # Pagos
│   │   ├── ContractTracking.tsx         # Seguimiento de Contratos
│   │   ├── ExpenseDetails.tsx           # Detalle de Gastos
│   │   └── DestajosModule.tsx           # Módulo de Destajos
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes UI base
│   │   ├── ModuleHeader.tsx    # Header con logo y navegación
│   │   ├── ModuleFooter.tsx    # Footer con logo IDP
│   │   └── ...                 # Otros componentes
│   │
│   ├── data/                   # Datos JSON de prueba
│   │   ├── obras.json
│   │   ├── proveedores.json
│   │   ├── requisiciones.json
│   │   ├── ordenesCompra.json
│   │   ├── pagos.json
│   │   └── destajos.json
│   │
│   ├── services/               # Lógica de negocio
│   │   └── database.ts         # Servicio centralizado de datos
│   │
│   ├── types/                  # Definiciones TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                  # Utilidades
│   │   └── generatePurchaseOrderPDF.ts  # Generador de PDFs
│   │
│   └── styles/                 # Estilos globales
│       ├── index.css
│       ├── theme.css           # Variables de diseño
│       └── fonts.css
│
├── package.json                # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

---

## 🎯 Rutas Disponibles

### Módulos Principales (Desde Home `/`)

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/` | **Home** | Pantalla de selección de módulos |
| `/dashboard` | **Dashboard Global** | Vista empresarial de todas las obras |
| `/compras` | **Compras** | Gestión de órdenes de compra |
| `/requisiciones` | **Requisiciones** | Solicitudes de material desde obra |
| `/pagos` | **Pagos** | Control de pagos a proveedores |

### Sub-Módulos (Por Obra)

| Ruta | Sub-Módulo | Ejemplo |
|------|------------|---------|
| `/dashboard/:obra/contratos` | Seguimiento de Contratos | `/dashboard/castello-h/contratos` |
| `/dashboard/:obra/gastos` | Detalle de Gastos | `/dashboard/doza-c/gastos` |
| `/dashboard/:obra/destajos` | Módulo de Destajos | `/dashboard/castello-h/destajos` |

**Nota:** `:obra` es el slug generado desde el nombre de la obra (ej: "227-CASTELLO E" → "castello-e")

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter (revisar código)
npm run lint
```

---

## 🎨 Paleta de Colores

Cada módulo tiene su identidad visual:

| Módulo | Color Principal | Uso |
|--------|----------------|-----|
| **Dashboard Global** | Gris Oscuro (`slate-800`) | Vista empresarial seria |
| **Compras** | Azul Serio (`blue-700`) | Gestión profesional |
| **Requisiciones** | Naranja Corporativo (`amber-700`) | Solicitudes urgentes |
| **Pagos** | Verde Esmeralda (`emerald-700`) | Control financiero |
| **Destajos** | Verde Oscuro (`green-800`) | Gestión de destajistas |

---

## 📊 Información Capturada

### Datos de IDP (Empresa)
```
Nombre: IDP CC SC DE RL DE CV
RFC: ICC110322LN0
Dirección: AV. PASEO DE LA CONSTITUCIÓN No. 60
Email: COMPRAS@IDPCC.COM.MX
```

### Datos de Obra
- Código (227, 228, 229, etc.)
- Nombre completo
- Cliente
- **Domicilio de la obra**
- Residente
- **Teléfono del residente**
- Monto del contrato
- Estimaciones y gastos

### Datos de Proveedor
- Nombre comercial
- **Razón Social**
- RFC
- **Dirección**
- Contacto
- **Vendedor asignado**
- Teléfono
- **Días de crédito**
- Línea de crédito y vencimiento

### Órdenes de Compra
- Código automático: `[obra]-[letra+num][comprador]-[proveedor]`
- Materiales con precios
- Subtotal, IVA, Total
- Fecha de creación y entrega
- Vinculación con requisiciones
- Estado de pago (Pendiente, Parcial, Pagada)

### Sistema de Pagos
- Vinculación con OCs
- Pagos parciales permitidos
- Actualización automática de saldos
- Control de líneas de crédito

---

## 🔐 Sistema de Roles (Futuro)

Actualmente el sistema muestra todos los módulos. En el futuro se implementará:

- **Admin**: Acceso total
- **Residente**: Solo Requisiciones de su obra
- **Compras**: Dashboard Global + Compras + Requisiciones
- **Pagos**: Dashboard Global + Pagos

---

## 📱 Responsive Design

El sistema es completamente responsive:

- **Desktop**: Grid de 2 columnas, navegación completa
- **Tablet**: Grid de 2 columnas, menús adaptados
- **Móvil**: 1 columna, navegación optimizada

---

## 🐛 Solución de Problemas

### El logo no se ve
1. Verifica que existe: `ls -la public/logo-idp.svg`
2. Reinicia el servidor: `Ctrl+C` → `npm run dev`
3. Limpia caché del navegador: `Ctrl+Shift+R`

### Error al instalar dependencias
```bash
# Limpia caché
npm cache clean --force

# Reinstala
rm -rf node_modules package-lock.json
npm install
```

### Las rutas no funcionan en producción
Verifica que existe `/public/_redirects` con:
```
/*    /index.html   200
```

### Error de TypeScript
```bash
# Regenera los tipos
npm run build
```

---

## 📝 Notas Importantes

1. **Datos en localStorage**: Los datos se guardan en el navegador (localStorage). Al limpiar el navegador se pierden.

2. **PDFs**: Se generan en el navegador con jsPDF. El logo amarillo se usa solo en PDFs.

3. **Códigos automáticos**: 
   - Obras: 3 dígitos (227-233)
   - OC: `[obra]-[letra+num][comprador]-[proveedor]`
   - Requisiciones: `REQ[obra]-[num][residente]`

4. **React Router**: Usa React Router v7 con rutas anidadas.

5. **Entregas**: Módulo futuro, actualmente muestra "Próximamente".

---

## 📞 Soporte

Para dudas o problemas:
1. Revisa esta documentación
2. Verifica `/DOCUMENTACION_SISTEMA.md` para detalles técnicos
3. Revisa los logs en consola del navegador

---

## ✅ Checklist de Verificación

Antes de hacer deploy, verifica:

- [ ] `npm run build` funciona sin errores
- [ ] Existe `/public/_redirects`
- [ ] Ambos logos existen en `/public/`
- [ ] Todas las rutas funcionan en `npm run preview`
- [ ] Los PDFs se generan correctamente
- [ ] Los datos de prueba están completos

---

**Sistema IDP Construcción v1.0**  
**Stack**: React + TypeScript + Vite + Tailwind CSS + React Router  
**Última actualización**: Enero 2025
