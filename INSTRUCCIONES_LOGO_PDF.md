# 🎨 CÓMO AGREGAR EL LOGO REAL AL PDF

## ✅ Cambios Realizados

Se han corregido las alineaciones del PDF de Órdenes de Compra:

### **Mejoras aplicadas:**
- ✅ Alineación del texto de la empresa en el header
- ✅ Columnas de datos de la OC mejor organizadas (etiqueta - valor)
- ✅ Información del proveedor con mejor espaciado
- ✅ Tabla de productos con formato consistente
- ✅ Firmas centradas con espaciado uniforme
- ✅ Sección de comentarios con mejor layout
- ✅ Logo placeholder que simula el diseño real

---

## 📸 AGREGAR EL LOGO REAL

### **Opción 1: Convertir Logo a Base64 (Recomendado)**

1. **Convertir la imagen a Base64:**
   - Ve a: https://www.base64-image.de/
   - Sube tu logo (archivo PNG o JPEG)
   - Copia la cadena base64 generada

2. **Actualizar el archivo:**
   
   Abre `/src/app/utils/logo-base64.ts` y reemplaza:
   
   ```typescript
   export const LOGO_IDP_BASE64 = "AQUI_PEGA_TU_CADENA_BASE64_COMPLETA";
   ```

3. **Activar en el generador de PDF:**
   
   Abre `/src/app/utils/generatePurchaseOrderPDF.ts` y descomenta estas líneas (alrededor de la línea 30):
   
   ```typescript
   // Descomenta estas líneas:
   import { LOGO_IDP_BASE64 } from "./logo-base64";
   
   // Y luego descomenta este bloque (línea ~45):
   try {
     doc.addImage(LOGO_IDP_BASE64, 'PNG', logoX, logoY, logoWidth, logoHeight);
   } catch (error) {
     console.error('Error al cargar logo:', error);
   }
   
   // Comenta o elimina el bloque "Placeholder simulado" que viene después
   ```

---

### **Opción 2: Usar Archivo de Imagen**

1. **Guardar el logo:**
   - Coloca tu logo en: `/public/assets/logo-idp.png`

2. **Cargar en el PDF:**
   
   Necesitarás convertir la imagen a base64 en tiempo de ejecución:
   
   ```typescript
   // Función helper para cargar imagen
   const loadImage = (url: string): Promise<string> => {
     return new Promise((resolve, reject) => {
       const img = new Image();
       img.onload = () => {
         const canvas = document.createElement('canvas');
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         ctx?.drawImage(img, 0, 0);
         resolve(canvas.toDataURL('image/png'));
       };
       img.onerror = reject;
       img.src = url;
     });
   };
   
   // Usar en el PDF:
   const logoData = await loadImage('/assets/logo-idp.png');
   doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
   ```

---

## 📐 ESPECIFICACIONES DEL LOGO EN EL PDF

```typescript
const logoX = 12;        // Posición X (desde la izquierda)
const logoY = 5;         // Posición Y (desde arriba)
const logoWidth = 25;    // Ancho en mm
const logoHeight = 25;   // Alto en mm
```

### **Ajustar tamaño del logo:**
Si el logo se ve muy grande o pequeño, modifica `logoWidth` y `logoHeight`:

```typescript
// Para un logo más grande:
const logoWidth = 30;
const logoHeight = 30;

// Para un logo más pequeño:
const logoWidth = 20;
const logoHeight = 20;
```

---

## 🎨 PLACEHOLDER ACTUAL

Actualmente el PDF usa un placeholder que simula el logo:
- Cuadrado amarillo dorado (#EAA000)
- Borde azul marino
- Texto "CONSULTORÍA I CONSTRUCCIÓN"

Este placeholder se reemplazará automáticamente cuando agregues el logo real.

---

## ✅ VERIFICAR QUE FUNCIONA

1. Genera una Orden de Compra
2. Descarga el PDF
3. Verifica que el logo aparece en la esquina superior izquierda
4. Si el logo no aparece, revisa la consola del navegador para ver errores

---

## 🔧 TROUBLESHOOTING

### **El logo no aparece:**
- Verifica que la cadena base64 es completa (empieza con `data:image/png;base64,`)
- Verifica que no hay espacios o saltos de línea en la cadena
- Prueba con una imagen más pequeña (máximo 500KB)

### **El logo se ve distorsionado:**
- Ajusta `logoWidth` y `logoHeight` para mantener la proporción
- Usa una imagen PNG con fondo transparente
- Recomendado: 300x300 pixeles o similar

### **Error en la consola:**
- Verifica que la imagen es PNG o JPEG válido
- Revisa que la cadena base64 es correcta
- Intenta regenerar el base64 desde otra herramienta

---

## 📝 EJEMPLO COMPLETO

```typescript
// 1. Archivo: /src/app/utils/logo-base64.ts
export const LOGO_IDP_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSU..."; // Tu cadena completa

// 2. Archivo: /src/app/utils/generatePurchaseOrderPDF.ts
import { LOGO_IDP_BASE64 } from "./logo-base64";

// Dentro de la función:
try {
  doc.addImage(LOGO_IDP_BASE64, 'PNG', 12, 5, 25, 25);
} catch (error) {
  console.error('Error al cargar logo:', error);
  // Fallback al placeholder si falla
}
```

---

## 🎉 RESULTADO FINAL

Con el logo real, el PDF tendrá:
- ✅ Logo corporativo en alta calidad
- ✅ Header azul marino profesional
- ✅ Información perfectamente alineada
- ✅ Diseño consistente con la imagen de referencia

**¿Necesitas ayuda para convertir el logo o ajustar algo más?** 🚀
