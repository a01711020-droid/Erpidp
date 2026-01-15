# 📚 Índice de Documentación - Sistema IDP Construcción v2.0

## 🎯 Guía de Navegación

Este documento te ayuda a encontrar la información que necesitas según tu caso de uso.

---

## 📖 Documentos Disponibles

### 1. **README.md** - Inicio Rápido
**¿Cuándo leerlo?** Siempre primero  
**Contenido:**
- ✅ Qué es el sistema
- ✅ Quick Start (instalación en 3 pasos)
- ✅ Arquitectura del modelo unificado
- ✅ Endpoints de la API
- ✅ Características principales

👉 [Leer README.md](./README.md)

---

### 2. **UNIFICACION-COMPLETADA.md** - Resumen Ejecutivo
**¿Cuándo leerlo?** Para entender el modelo unificado  
**Contenido:**
- ✅ Decisiones de diseño (UUIDs, tablas normalizadas, etc.)
- ✅ Archivos entregados
- ✅ Características del modelo
- ✅ Flujo de datos unificado
- ✅ Comparación antes/después
- ✅ Estado final del proyecto

👉 [Leer UNIFICACION-COMPLETADA.md](./UNIFICACION-COMPLETADA.md)

---

### 3. **MIGRACION-MODELO-UNIFICADO.md** - Guía de Migración
**¿Cuándo leerlo?** Si tienes datos en el modelo anterior  
**Contenido:**
- ✅ Pasos de migración (completa y gradual)
- ✅ Scripts SQL de ejemplo
- ✅ Checklist de verificación
- ✅ Pruebas de integración
- ✅ Troubleshooting completo

👉 [Leer MIGRACION-MODELO-UNIFICADO.md](./MIGRACION-MODELO-UNIFICADO.md)

---

### 4. **DOCUMENTACION_SISTEMA.md** - Arquitectura Completa
**¿Cuándo leerlo?** Para entender cómo funciona el sistema  
**Contenido:**
- ✅ Stack tecnológico
- ✅ Módulos del sistema (Dashboard, Compras, Requisiciones, etc.)
- ✅ Entidades y tipos de datos
- ✅ Flujos de trabajo
- ✅ Sistema de PDFs
- ✅ Extensión del sistema

👉 [Leer DOCUMENTACION_SISTEMA.md](./DOCUMENTACION_SISTEMA.md)

---

### 5. **README-PRODUCCION.md** - Deploy en Render
**¿Cuándo leerlo?** Para desplegar en producción  
**Contenido:**
- ✅ Instalación local paso a paso
- ✅ Deploy en Render (frontend + backend + DB)
- ✅ Variables de entorno
- ✅ Troubleshooting
- ✅ Checklist pre-deploy

👉 [Leer README-PRODUCCION.md](./README-PRODUCCION.md)

---

## 🗂️ Archivos Técnicos

### Backend

- **`/backend/schema_unificado.sql`**  
  Esquema PostgreSQL completo (800+ líneas)  
  - UUIDs como IDs
  - Tablas normalizadas
  - Triggers automáticos
  - Vistas útiles

- **`/backend/models.py`**  
  Modelos Pydantic (700+ líneas)  
  - Enums para estados
  - DTOs (Create, Update)
  - Validaciones completas

- **`/backend/main_unificado.py`**  
  API FastAPI completa (800+ líneas)  
  - CRUD para todas las entidades
  - Manejo de relaciones UUID
  - Items normalizados

- **`/backend/migration_script.sql`**  
  Script de migración de datos  
  - Ejemplos de migración SERIAL → UUID
  - Ejemplos de migración JSONB → normalizado
  - Verificación post-migración

### Frontend

- **`/src/types/index.ts`**  
  Tipos TypeScript unificados (650+ líneas)  
  - Alineados 100% con backend
  - Enums idénticos
  - Helpers de conversión

- **`/src/services/api.ts`**  
  Endpoints CRUD  
  - Funciones para consumir API
  - Manejo de errores

- **`/src/services/apiClient.ts`**  
  Cliente HTTP  
  - Axios configurado
  - Interceptors
  - Variables de entorno

---

## 🚀 Casos de Uso

### Caso 1: "Soy nuevo en el proyecto"

1. Lee **README.md** (10 min)
2. Lee **UNIFICACION-COMPLETADA.md** (15 min)
3. Ejecuta Quick Start del README (30 min)
4. Explora **DOCUMENTACION_SISTEMA.md** (opcional)

**Total**: ~1 hora para estar operativo

---

### Caso 2: "Quiero instalar localmente"

1. Lee sección "Quick Start" del **README.md**
2. Sigue los 3 pasos (Frontend, Backend, BD)
3. Verifica con Health Check
4. Si hay problemas: Consulta **README-PRODUCCION.md** sección "Solución de Problemas"

**Total**: ~30 minutos

---

### Caso 3: "Tengo datos en el modelo antiguo"

1. Lee **MIGRACION-MODELO-UNIFICADO.md** completo (20 min)
2. Haz backup de tu BD actual
3. Revisa `/backend/migration_script.sql`
4. Ajusta el script según tus datos
5. Ejecuta migración
6. Verifica con checklist del documento

**Total**: ~2-4 horas (según volumen de datos)

---

### Caso 4: "Quiero desplegar en Render"

1. Lee sección "Deploy en Render" del **README.md** (resumen)
2. Lee **README-PRODUCCION.md** completo (guía detallada)
3. Sigue pasos para PostgreSQL, Backend y Frontend
4. Configura variables de entorno
5. Verifica integración completa

**Total**: ~1-2 horas

---

### Caso 5: "Quiero entender la arquitectura"

1. Lee **UNIFICACION-COMPLETADA.md** sección "Arquitectura"
2. Lee **DOCUMENTACION_SISTEMA.md** completo
3. Explora archivos técnicos:
   - `/backend/schema_unificado.sql`
   - `/backend/models.py`
   - `/src/types/index.ts`

**Total**: ~1-2 horas

---

### Caso 6: "Quiero extender el sistema"

1. Lee **DOCUMENTACION_SISTEMA.md** sección "Extensión del Sistema"
2. Estudia estructura de modelos:
   - **Base de Datos**: `schema_unificado.sql` - Agregar tabla
   - **Backend**: `models.py` - Agregar modelo Pydantic
   - **Backend**: `main_unificado.py` - Agregar endpoints
   - **Frontend**: `types/index.ts` - Agregar tipos
   - **Frontend**: `services/api.ts` - Agregar funciones
3. Sigue el patrón de entidades existentes

**Total**: Variable según complejidad

---

### Caso 7: "Tengo un error"

1. **Error en frontend**:
   - Verifica consola del navegador
   - Verifica que API esté corriendo (`/health`)
   - Consulta **README-PRODUCCION.md** "Troubleshooting"

2. **Error en backend**:
   - Verifica logs del servidor
   - Verifica conexión a BD
   - Consulta **MIGRACION-MODELO-UNIFICADO.md** "Troubleshooting"

3. **Error en base de datos**:
   - Verifica que `schema_unificado.sql` se aplicó
   - Verifica credenciales en `.env`
   - Consulta **README-PRODUCCION.md** "Solución de Problemas"

---

## 📊 Mapa de Contenidos

```
INICIO
  │
  ├─ README.md ────────────────┐
  │                             │
  │  ¿Quieres entender         │  ¿Quieres
  │  el modelo?                │  instalar?
  │       │                    │      │
  │       ▼                    │      ▼
  │  UNIFICACION-COMPLETADA ───┤  Quick Start
  │                             │  (en README)
  │  ¿Tienes datos             │      │
  │  anteriores?               │      │
  │       │                    │  ¿Problemas?
  │       ▼                    │      │
  │  MIGRACION-MODELO ─────────┤      ▼
  │                             │  README-PRODUCCION
  │  ¿Quieres desplegar?       │  (Troubleshooting)
  │       │                    │
  │       ▼                    │
  │  README-PRODUCCION ────────┤
  │                             │
  │  ¿Quieres entender         │
  │  arquitectura?             │
  │       │                    │
  │       ▼                    │
  │  DOCUMENTACION_SISTEMA ────┘
  │
  └─ ARCHIVOS TÉCNICOS
       │
       ├─ backend/schema_unificado.sql
       ├─ backend/models.py
       ├─ backend/main_unificado.py
       ├─ backend/migration_script.sql
       ├─ src/types/index.ts
       ├─ src/services/api.ts
       └─ src/services/apiClient.ts
```

---

## ✅ Checklist por Rol

### Desarrollador Frontend

- [ ] Leer README.md
- [ ] Leer UNIFICACION-COMPLETADA.md (decisiones de diseño)
- [ ] Estudiar `/src/types/index.ts` (tipos unificados)
- [ ] Estudiar `/src/services/api.ts` (consumo de API)
- [ ] Ejecutar Quick Start (Frontend + verificar API)

### Desarrollador Backend

- [ ] Leer README.md
- [ ] Leer UNIFICACION-COMPLETADA.md (decisiones de diseño)
- [ ] Estudiar `/backend/models.py` (modelos Pydantic)
- [ ] Estudiar `/backend/main_unificado.py` (endpoints)
- [ ] Estudiar `/backend/schema_unificado.sql` (estructura BD)
- [ ] Ejecutar Quick Start (Backend + BD)

### DBA / DevOps

- [ ] Leer README.md
- [ ] Leer UNIFICACION-COMPLETADA.md (arquitectura)
- [ ] Estudiar `/backend/schema_unificado.sql` (tablas, índices, triggers)
- [ ] Leer MIGRACION-MODELO-UNIFICADO.md (migración de datos)
- [ ] Leer README-PRODUCCION.md (deploy)
- [ ] Configurar PostgreSQL en Render
- [ ] Aplicar schema
- [ ] Configurar backups

### Project Manager

- [ ] Leer README.md (resumen)
- [ ] Leer UNIFICACION-COMPLETADA.md (qué se hizo y por qué)
- [ ] Leer DOCUMENTACION_SISTEMA.md (módulos y funcionalidades)
- [ ] Verificar estado del proyecto (checklist en UNIFICACION-COMPLETADA)

---

## 🔍 Búsqueda Rápida

### "¿Cómo...?"

| Pregunta | Documento | Sección |
|----------|-----------|---------|
| ¿Cómo instalar localmente? | README.md | Quick Start |
| ¿Cómo migrar datos? | MIGRACION-MODELO-UNIFICADO.md | Pasos para Migrar |
| ¿Cómo desplegar en Render? | README-PRODUCCION.md | Deploy en Render |
| ¿Cómo crear una requisición? | README.md | Modelo Unificado en Acción |
| ¿Cómo funcionan los triggers? | schema_unificado.sql | Líneas 400+ |
| ¿Cómo agregar una entidad? | DOCUMENTACION_SISTEMA.md | Extensión del Sistema |

### "¿Qué es...?"

| Concepto | Documento | Sección |
|----------|-----------|---------|
| Modelo unificado | UNIFICACION-COMPLETADA.md | Resumen |
| UUID | UNIFICACION-COMPLETADA.md | Decisiones de Diseño |
| Triggers | schema_unificado.sql | Comentarios |
| Normalización | UNIFICACION-COMPLETADA.md | Items: Tablas Normalizadas |
| DTOs | models.py | Comentarios |

### "¿Por qué...?"

| Pregunta | Documento | Sección |
|----------|-----------|---------|
| ¿Por qué UUIDs? | UNIFICACION-COMPLETADA.md | IDs: UUID |
| ¿Por qué normalizar items? | UNIFICACION-COMPLETADA.md | Items: Tablas Normalizadas |
| ¿Por qué triggers? | UNIFICACION-COMPLETADA.md | Cálculos Automáticos |
| ¿Por qué snake_case en BD? | UNIFICACION-COMPLETADA.md | Nomenclatura |

---

## 📞 Soporte

Si después de revisar la documentación sigues teniendo dudas:

1. **Errores técnicos**: Consulta secciones de Troubleshooting
2. **Conceptos de diseño**: Re-lee UNIFICACION-COMPLETADA.md
3. **Implementación**: Estudia los archivos técnicos con ejemplos

---

## 🎓 Ruta de Aprendizaje Recomendada

### Nivel 1: Básico (1-2 horas)
1. README.md
2. Quick Start
3. Verificar que funciona localmente

### Nivel 2: Intermedio (3-4 horas)
1. UNIFICACION-COMPLETADA.md
2. Entender decisiones de diseño
3. Explorar estructura de archivos

### Nivel 3: Avanzado (8+ horas)
1. DOCUMENTACION_SISTEMA.md completo
2. Estudiar schema_unificado.sql en detalle
3. Estudiar models.py y main_unificado.py
4. Implementar un cambio/extensión

### Nivel 4: Experto (16+ horas)
1. Todo lo anterior
2. Realizar migración completa de datos
3. Desplegar en producción
4. Optimizar y extender el sistema

---

**Última actualización**: Enero 2025  
**Versión**: 2.0 Modelo Unificado
