import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrder } from "@/app/components/PurchaseOrderForm";

// Función helper para cargar imagen desde URL pública
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };
    
    img.src = url;
  });
};

export const generatePurchaseOrderPDF = async (order: PurchaseOrder) => {
  const doc = new jsPDF();
  
  // Colores corporativos
  const navyBlue = [25, 51, 110]; // Azul marino
  const goldenYellow = [234, 170, 0]; // Amarillo dorado
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const gray = [80, 80, 80];
  
  let yPos = 15;

  // ========================================
  // HEADER CON LOGO Y TÍTULO
  // ========================================
  
  // Rectángulo azul marino superior (header)
  doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.rect(0, 0, 210, 35, "F");
  
  // Logo - Cargar imagen real
  const logoX = 12;
  const logoY = 5;
  const logoWidth = 25;
  const logoHeight = 25;
  
  try {
    // Intentar cargar el logo desde la ruta pública
    // Nota: Usamos el logo alternativo (amarillo) para PDFs de Órdenes de Compra
    // El logo SVG debe ser convertido a PNG para jsPDF
    const logoBase64 = await loadImageAsBase64("/logo-idp-alt.svg");
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('Error al cargar logo:', error);
    // Fallback: dibujar placeholder si falla (SVG no es compatible con jsPDF directamente)
    doc.setFillColor(goldenYellow[0], goldenYellow[1], goldenYellow[2]);
    doc.rect(logoX, logoY, logoWidth, logoHeight, "F");
    doc.setDrawColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.setLineWidth(1.5);
    doc.rect(logoX, logoY, logoWidth, logoHeight, "S");
    
    // Agregar texto "IDP" en el placeholder
    doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("IDP", logoX + logoWidth / 2, logoY + logoHeight / 2 + 2, { align: "center" });
  }
  
  // Información de la empresa (texto blanco)
  const infoX = 42;
  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("IDP CC SC DE RL DE CV", infoX, 10);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("RFC: ICC11032ZLN0", infoX, 15);
  doc.text("AV. PASEO DE LA CONSTITUCIÓN No. 60", infoX, 19);
  doc.text("Email: COMPRAS@IDPCC.COM.MX", infoX, 23);
  doc.text("Tel: (722) 123-4567", infoX, 27);
  
  // TÍTULO "ORDEN DE COMPRA" - Lado derecho
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ORDEN DE COMPRA", 195, 18, { align: "right" });
  
  // ========================================
  // INFORMACIÓN PRINCIPAL
  // ========================================
  
  yPos = 42;
  doc.setTextColor(black[0], black[1], black[2]);
  
  // OBRA (columna izquierda)
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Obra:", 15, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(order.workName, 28, yPos);
  
  doc.setFontSize(8);
  doc.text(`Código: ${order.workCode}`, 28, yPos + 4.5);
  
  // Cliente
  doc.setFontSize(7);
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const clientLines = doc.splitTextToSize(`Cliente: ${order.client || ""}`, 80);
  doc.text(clientLines, 28, yPos + 9);
  
  doc.setTextColor(black[0], black[1], black[2]);
  
  // DATOS DE LA OC (columna derecha) - Formato tabla
  const rightLabelX = 125;
  const rightValueX = 155;
  
  doc.setFontSize(8);
  
  // No. OC
  doc.setFont("helvetica", "bold");
  doc.text("No. OC:", rightLabelX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderNumber, rightValueX, yPos);
  
  // Comprador
  doc.setFont("helvetica", "bold");
  doc.text("Comprador:", rightLabelX, yPos + 5);
  doc.setFont("helvetica", "normal");
  doc.text(order.buyer, rightValueX, yPos + 5);
  
  // Fecha
  doc.setFont("helvetica", "bold");
  doc.text("Fecha:", rightLabelX, yPos + 10);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.createdDate).toLocaleDateString("es-MX"), rightValueX, yPos + 10);
  
  // No. Obra
  doc.setFont("helvetica", "bold");
  doc.text("No. Obra:", rightLabelX, yPos + 15);
  doc.setFont("helvetica", "normal");
  doc.text(order.workCode, rightValueX, yPos + 15);
  
  yPos += 26;
  
  // ========================================
  // INFORMACIÓN DEL PROVEEDOR
  // ========================================
  
  // Rectángulo del proveedor
  doc.setDrawColor(black[0], black[1], black[2]);
  doc.setLineWidth(0.3);
  doc.rect(15, yPos, 100, 22);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Proveedor:", 17, yPos + 5);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const proveedorLines = doc.splitTextToSize(order.supplierFullName || order.supplier, 95);
  doc.text(proveedorLines, 17, yPos + 10);
  
  // Contacto
  if (order.supplierContact) {
    doc.setFontSize(7);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    const contactLines = doc.splitTextToSize(`Contacto: ${order.supplierContact}`, 95);
    doc.text(contactLines, 17, yPos + 16);
    doc.setTextColor(black[0], black[1], black[2]);
  }
  
  // Datos adicionales (columna derecha)
  doc.setFontSize(8);
  
  // Cotización
  doc.setFont("helvetica", "bold");
  doc.text("Cotización:", rightLabelX, yPos + 5);
  doc.setFont("helvetica", "normal");
  doc.text("N/A", rightValueX, yPos + 5);
  
  // Tipo
  doc.setFont("helvetica", "bold");
  doc.text("Tipo:", rightLabelX, yPos + 10);
  doc.setFont("helvetica", "normal");
  doc.text(order.deliveryType, rightValueX, yPos + 10);
  
  // Fecha Entrega
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Entrega:", rightLabelX, yPos + 15);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.deliveryDate).toLocaleDateString("es-MX"), rightValueX, yPos + 15);
  
  yPos += 27;
  
  // ========================================
  // TABLA DE PRODUCTOS/SERVICIOS
  // ========================================
  
  const tableData = order.items.map((item) => [
    item.quantity.toString(),
    item.unit || "Pza",
    item.description,
    `$ ${item.unitPrice.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `$ ${item.total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  ]);
  
  // Agregar filas vacías hasta completar 15
  const minRows = 15;
  while (tableData.length < minRows) {
    tableData.push(["", "", "", "", ""]);
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [["Cantidad", "Unidad", "Descripción", "P.U.", "Importe"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: white,
      textColor: black,
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      lineWidth: 0.3,
      lineColor: black,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: black,
      lineWidth: 0.3,
      lineColor: black,
      cellPadding: 2,
      minCellHeight: 5,
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 95, halign: "left" },
      3: { cellWidth: 27, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });
  
  // ========================================
  // NOTA DE COMPROMISO
  // ========================================
  
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 100;
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(black[0], black[1], black[2]);
  
  const commitmentText = '"El proveedor se compromete a cumplir en tiempo, forma y en la ubicación solicitada los productos/servicios descritos en la presente Orden de Compra."';
  const commitmentLines = doc.splitTextToSize(commitmentText, 120);
  doc.text(commitmentLines, 15, finalY + 5);
  
  // ========================================
  // TOTALES (lado derecho)
  // ========================================
  
  const totalsLabelX = 148;
  const totalsValueX = 195;
  let totalsY = finalY + 3;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(black[0], black[1], black[2]);
  
  // Subtotal
  doc.text("Subtotal:", totalsLabelX, totalsY);
  doc.text(`$ ${order.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, totalsValueX, totalsY, { align: "right" });
  
  totalsY += 5;
  
  // Otro (descuento)
  if (order.discountAmount > 0) {
    doc.text("Otro:", totalsLabelX, totalsY);
    doc.text(`$ ${order.discountAmount.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, totalsValueX, totalsY, { align: "right" });
    totalsY += 5;
  }
  
  // IVA
  doc.text("IVA:", totalsLabelX, totalsY);
  doc.text(`$ ${order.iva.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, totalsValueX, totalsY, { align: "right" });
  
  totalsY += 6;
  
  // Total (en negrita)
  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsLabelX, totalsY);
  doc.text(`$ ${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, totalsValueX, totalsY, { align: "right" });
  
  // ========================================
  // FIRMAS
  // ========================================
  
  const firmasY = finalY + 31;
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(black[0], black[1], black[2]);
  
  // Espaciado mejorado para las firmas
  const firma1X = 35;
  const firma2X = 105;
  const firma3X = 172;
  
  // Elabora
  doc.text("Elabora", firma1X, firmasY, { align: "center" });
  doc.setLineWidth(0.3);
  doc.line(firma1X - 15, firmasY + 2, firma1X + 15, firmasY + 2);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(order.buyer, firma1X, firmasY + 6, { align: "center" });
  
  // Autoriza
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Autoriza", firma2X, firmasY, { align: "center" });
  doc.line(firma2X - 15, firmasY + 2, firma2X + 15, firmasY + 2);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Giovanni Martínez", firma2X, firmasY + 6, { align: "center" });
  
  // Proveedor
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Proveedor", firma3X, firmasY, { align: "center" });
  doc.line(firma3X - 15, firmasY + 2, firma3X + 15, firmasY + 2);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const proveedorNombre = order.supplierFullName || order.supplier;
  const proveedorCorto = proveedorNombre.length > 30 ? proveedorNombre.substring(0, 28) + "..." : proveedorNombre;
  doc.text(proveedorCorto, firma3X, firmasY + 6, { align: "center" });
  
  // ========================================
  // COMENTARIOS
  // ========================================
  
  const comentariosY = firmasY + 12;
  
  doc.setDrawColor(black[0], black[1], black[2]);
  doc.setLineWidth(0.3);
  doc.rect(15, comentariosY, 180, 16);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text("Comentarios:", 17, comentariosY + 4);
  
  // Observaciones
  if (order.observations) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const obsLines = doc.splitTextToSize(order.observations, 175);
    doc.text(obsLines, 17, comentariosY + 8);
  }
  
  // Pie de página
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(6);
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text(
    `Documento generado: ${new Date().toLocaleDateString("es-MX")} ${new Date().toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}`,
    105,
    pageHeight - 5,
    { align: "center" }
  );

  // Descargar el PDF
  doc.save(`OC-${order.orderNumber}.pdf`);
};