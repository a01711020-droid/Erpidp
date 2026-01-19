# ⚠️ CONFIGURACIÓN MANUAL REQUERIDA: _redirects

## Problema

El sistema de archivos de Figma Make tiene limitaciones con archivos que comienzan con `_` (guion bajo).

## Solución Manual (IMPORTANTE)

Después de descargar el proyecto, debes crear manualmente el archivo `_redirects` en la carpeta `public/`.

### Pasos:

1. **Navega a la carpeta `public/`** de tu proyecto descargado

2. **Crea un archivo nuevo** llamado exactamente: `_redirects` (sin extensión)

3. **Agrega el siguiente contenido** (una sola línea):
   ```
   /*    /index.html   200
   ```

4. **Guarda el archivo**

### Verificación

- **Nombre del archivo**: `_redirects` (sin `.txt`, sin `.md`, sin ninguna extensión)
- **Ubicación**: Debe estar en `/public/_redirects`
- **Contenido**: Exactamente la línea mostrada arriba (con los espacios)
- **Tipo**: Archivo de texto plano

### Estructura correcta

```
proyecto/
├── public/
│   ├── _redirects          ← Este archivo (SIN extensión)
│   ├── logo-idp.svg
│   └── ...
├── src/
└── ...
```

## ¿Por qué es necesario?

Este archivo le indica a Render (y otros servicios de hosting) que todas las rutas (`/*`) deben servir el archivo `index.html` con código 200. Esto es esencial para que React Router funcione correctamente cuando un usuario refresca la página en una ruta diferente a `/`.

### Sin este archivo:
- ✅ `https://tu-app.com/` → Funciona
- ❌ `https://tu-app.com/ordenes-compra` → Error 404 al refrescar

### Con este archivo:
- ✅ `https://tu-app.com/` → Funciona
- ✅ `https://tu-app.com/ordenes-compra` → Funciona al refrescar

## Alternativa Temporal

Mientras configuras el archivo `_redirects`, puedes usar el archivo de referencia:
- **Archivo**: `/public/redirects-config.txt`
- **Acción**: Renombrar a `_redirects` (eliminar extensión `.txt`)

## Verificación en Render

Una vez desplegado en Render, verifica:

1. Abre tu app: `https://tu-app.onrender.com`
2. Navega a una ruta interna: `https://tu-app.onrender.com/ordenes-compra`
3. **Refresca la página (F5)**
4. ✅ Debe cargar correctamente (no debe mostrar error 404)

Si muestra error 404, significa que el archivo `_redirects` no está correctamente configurado.

---

**Estado**: ⚠️ CONFIGURACIÓN MANUAL REQUERIDA  
**Prioridad**: 🔴 ALTA (necesario para producción)
