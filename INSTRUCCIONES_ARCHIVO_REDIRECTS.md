# ⚠️ IMPORTANTE: Configuración del Archivo _redirects

## 🚨 PROBLEMA DETECTADO

Actualmente existe una **carpeta** `/public/_redirects/` con un archivo `main.tsx` dentro.  
Esto está **INCORRECTO** y causará que React Router no funcione en producción.

---

## ✅ SOLUCIÓN CORRECTA

### Paso 1: Eliminar la Carpeta Incorrecta

**Manualmente** (en tu explorador de archivos):
1. Ve a la carpeta `/public/`
2. **Elimina completamente** la carpeta `_redirects`

**O por terminal**:
```bash
rm -rf public/_redirects
```

---

### Paso 2: Crear el Archivo Correcto

**Opción A: Renombrar el archivo temporal**

He creado un archivo temporal `/public/_redirects.txt`.  
Renómbralo a `_redirects` (sin extensión):

```bash
mv public/_redirects.txt public/_redirects
```

**O manualmente**:
1. Ve a `/public/`
2. Renombra `_redirects.txt` → `_redirects` (quita el `.txt`)

---

**Opción B: Crear manualmente**

1. Elimina la carpeta `/public/_redirects/`
2. Crea un **archivo** (no carpeta) llamado `_redirects` dentro de `/public/`
3. Contenido del archivo:
   ```
   /*    /index.html   200
   ```

---

## ✅ VERIFICACIÓN FINAL

La estructura correcta debe ser:

```
/public/
├── _redirects              ← Archivo (NO carpeta)
├── logo-idp-alterno.svg
├── logo-idp-normal.svg
└── logo-idp.svg
```

**El archivo `_redirects`**:
- ✅ **NO** tiene extensión (no es `.txt`, `.js`, etc.)
- ✅ Es un **archivo de texto plano**
- ✅ Contiene una sola línea: `/*    /index.html   200`
- ✅ **NO** es una carpeta

---

## 🧪 CÓMO VERIFICAR

### En Terminal:
```bash
# Verificar que es un archivo (no carpeta)
file public/_redirects

# Debería mostrar:
# public/_redirects: ASCII text

# Ver el contenido
cat public/_redirects

# Debería mostrar:
# /*    /index.html   200
```

### En tu Editor de Código:
1. Abre VS Code / tu editor
2. Ve a la carpeta `/public/`
3. Debe aparecer `_redirects` como **archivo** (con ícono de documento 📄)
4. **NO** debe tener el ícono de carpeta 📁

---

## 🚀 PARA QUÉ SIRVE

Este archivo es **crítico para React Router en producción** (Render, Netlify, Vercel):

- Sin este archivo: URLs como `/compras` darán **404 Not Found**
- Con este archivo: Todas las rutas redirigen a `index.html` y React Router maneja la navegación

**Formato**:
```
<ruta>    <destino>   <código-http>
/*        /index.html   200
```

Significa: "Todas las rutas (`/*`) deben servir `index.html` con código 200 OK"

---

## ✅ PASOS FINALES

1. ✅ Eliminar la carpeta `/public/_redirects/`
2. ✅ Renombrar `/public/_redirects.txt` a `/public/_redirects`
3. ✅ Verificar que sea un archivo (no carpeta)
4. ✅ Verificar el contenido: `/*    /index.html   200`
5. ✅ Hacer commit del cambio

---

## 📝 NOTA IMPORTANTE

**NO confundir**:
- ❌ `/public/_redirects/main.tsx` (carpeta con archivo dentro) - **INCORRECTO**
- ✅ `/public/_redirects` (archivo de texto plano) - **CORRECTO**

En sistemas Unix/Linux, los archivos **NO necesitan extensión**.  
El archivo `_redirects` es un archivo de configuración estándar usado por:
- Netlify
- Render
- Vercel (aunque también soporta `vercel.json`)

---

**Fecha**: Enero 19, 2025  
**Estado**: ⚠️ **REQUIERE CORRECCIÓN MANUAL**
