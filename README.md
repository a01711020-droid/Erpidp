# 🏗️ Sistema IDP - Gestión Financiera y Seguimiento de Proyectos Constructivos

## 📋 Descripción

Sistema integral de gestión para la empresa **IDP (Ingeniería y Desarrollo de Proyectos)** que unifica la administración financiera y operativa de proyectos de construcción.

**Estado Actual:** Frontend preparado para integración con backend real (FastAPI + Supabase)

---

## ⚡ INICIO RÁPIDO

```bash
npm install
npm run dev
```

**¿Primera vez?** → Lee la [Arquitectura de Datos](docs/FRONTEND_ARCHITECTURE.md) 📚

---

## 🏗️ Arquitectura de Datos

Este frontend implementa una **arquitectura en capas** preparada para integración profesional:

### Estructura

```
Frontend (React/TypeScript)
    ↓
dataAdapter (Interfaz unificada)
    ↓
mockAdapter ──→ seed.ts (Mock data SQL)
    ↓
apiAdapter ──→ FastAPI Backend (Futuro)
```

### Características

✅ **Interfaz unificada**: `IDataAdapter` define el contrato  
✅ **Mock data estructurado**: Organizado como tablas SQL en `/spec/mock-db/`  
✅ **Estados UI estándar**: Loading, Empty, Error, Success en todos los componentes  
✅ **Zero hardcode**: Componentes nunca acceden directamente a mock data  
✅ **Listo para API real**: Solo reemplazar `mockAdapter` por `apiAdapter`

### Modo Mock vs Producción

```typescript
// /src/core/config.ts
export const MOCK_MODE = true; // Cambiar a false cuando backend esté listo
```

---

## 📁 Estructura del Proyecto

```
/src/
├── app/                      # Componentes React
│   ├── components/          # Componentes UI
│   ├── utils/               # Utilidades (PDF, formato, etc.)
│   ├── App.tsx              # Entry point
│   └── MainApp.tsx          # Shell principal
│
├── core/                     # Capa de datos
│   ├── config.ts            # Configuración global
│   ├── data/
│   │   ├── types.ts        # Types del dominio
│   │   ├── dataAdapter.ts  # Interfaz IDataAdapter
│   │   ├── mockAdapter.ts  # Implementación mock
│   │   └── index.ts        # Export del adapter activo
│   ├── hooks/
│   │   └── useData.ts      # Hook para consumir datos
│   └── ui/
│       └── StatePanel.tsx  # Componente de estados UI
│
/spec/mock-db/               # Datos mock estructurados
├── schema.sql               # Schema SQL completo
├── schema.md                # Documentación del schema
└── seed.ts                  # Datos mock con relaciones

/docs/                       # Documentación
└── FRONTEND_ARCHITECTURE.md # Arquitectura de datos
```

---