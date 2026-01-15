# Instrucciones para Logos

## Estado Actual

El proyecto ahora usa assets estándar y NO tiene ninguna dependencia de Figma.

## Logos Actuales

### 1. Logo Principal (Interfaz Web) ✅
- **Ubicación**: `/public/logo-idp.svg`
- **Formato**: SVG
- **Uso**: Header, Footer, Home
- **Estado**: ✅ Configurado y funcionando

### 2. Logo para PDF (Opcional)
- **Ubicación recomendada**: `/public/logo-idp.png`
- **Formato**: PNG (300x300px mínimo)
- **Uso**: Generación de PDFs de órdenes de compra
- **Estado**: ⚠️ Opcional - El sistema usa un placeholder si no está disponible

## Comportamiento Actual del PDF

El generador de PDF (`/src/app/utils/generatePurchaseOrderPDF.ts`):

1. **Intenta cargar** el logo desde `/logo-idp.svg`
2. **Si falla** (porque SVG no es compatible con jsPDF), usa un placeholder:
   - Rectángulo dorado con borde azul marino
   - Texto "IDP" centrado
   - Colores corporativos correctos

## ¿Necesitas usar un logo real en el PDF?

Si deseas que el logo aparezca en el PDF, necesitas:

### Opción A: Crear logo PNG (Recomendado)
1. Crea o convierte tu logo a formato PNG
2. Guárdalo en `/public/logo-idp-pdf.png`
3. Actualiza la línea 66 en `/src/app/utils/generatePurchaseOrderPDF.ts`:
   ```typescript
   const logoBase64 = await loadImageAsBase64("/logo-idp-pdf.png");
   ```

### Opción B: Usar el placeholder actual
- No hagas nada
- El sistema genera PDFs con un placeholder profesional
- Funciona perfectamente sin errores

## Logos Mencionados por el Usuario

El usuario mencionó "2 logotipos distintos". Para confirmar:

**¿Cuáles son los 2 logos que necesitas?**
1. ¿Logo normal (actual SVG)?
2. ¿Logo alterno (¿cuál es?)?

**Si tienes un segundo logo**, por favor:
1. Indica su propósito
2. Proporciona el archivo o especifica dónde debe ir
3. El sistema ya está preparado para usarlo

## Resumen

✅ **Sistema completamente funcional sin Figma**
✅ **Logo web funcionando con SVG**
⚠️ **Logo PDF usa placeholder (opcional mejorarlo)**
❓ **Segundo logo pendiente de confirmar**
