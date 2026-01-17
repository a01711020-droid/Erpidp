import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Genera el PDF de una Orden de Compra
 * Usa jsPDF + jspdf-autotable
 */
export async function generatePurchaseOrderPDF(order: {
  orderNumber: string;
  createdDate: string;
  workCode: string;
  workName: string;
  client?: string;
  buyer: string;
  supplier: string;
  supplierFullName?: string;
  deliveryType: string;
  deliveryDate: string;
  items: {
    quantity: number;
    unit?: string;
    description: string;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
  observations?: string;
}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =====================================================
     HEADER (barra azul + logo + datos empresa)
     ===================================================== */
  doc.setFillColor(25, 51, 110); // azul marino
  doc.rect(0, 0, pageWidth, 35, "F");

  // Logo (usa PNG/SVG en public/)
  try {
    const logo = await loadImageAsBase64("/logo-idp-alterno.svg");
    doc.addImage(logo, "PNG", 12, 5, 25, 25);
  } catch {
    // si no carga el logo, no rompe el PDF
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IDP CC SC DE RL DE CV", 42, 10);
  doc.setFont("helvetica", "normal");
  doc.text("RFC: ICC110321LN0", 42, 15);
  doc.text("AV. PASEO DE LA CONSTITUCIÓN No. 60", 42, 19);
  doc.text("Email: COMPRAS@IDPCC.COM.MX", 42, 23);
  doc.text("Tel: (722) 123-4567", 42, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ORDEN DE COMPRA", pageWidth - 15, 18, { align: "right" });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  /* =====================================================
     DATOS GENERALES (obra / OC)
     ===================================================== */
  let y = 42;

  // Izquierda - Obra
  doc.setFont("helvetica", "bold");
  doc.text("Obra:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.workName, 28, y);
  doc.text(`Código: ${order.workCode}`, 28, y + 5);
  if (order.client) {
    doc.text(
      doc.splitTextToSize(`Cliente: ${order.client}`, 80),
      28,
      y + 10
    );
  }

  // Derecha - OC
  doc.setFont("helvetica", "bold");
  doc.text("No. OC:", 125, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderNumber, 155, y);

  doc.setFont("helvetica", "bold");
  doc.text("Comprador:", 125, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(order.buyer, 155, y + 5);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha:", 125, y + 10);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date(order.createdDate).toLocaleDateString("es-MX"),
    155,
    y + 10
  );

  y += 20;

  /* =====================================================
     PROVEEDOR
     ===================================================== */
  doc.rect(15, y, 100, 22);
  doc.setFont("helvetica", "bold");
  doc.text("Proveedor:", 17, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(
    doc.splitTextToSize(
      order.supplierFullName || order.supplier,
      95
    ),
    17,
    y + 10
  );

  // Derecha
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Entrega:", 125, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(order.deliveryType, 155, y + 8);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha Entrega:", 125, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date(order.deliveryDate).toLocaleDateString("es-MX"),
    155,
    y + 15
  );

  y += 30;

  /* =====================================================
     TABLA DE ITEMS
     ===================================================== */
  const tableData = order.items.map((item) => [
    item.quantity.toString(),
    item.unit || "Pza",
    item.description,
    `$ ${item.unitPrice.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    `$ ${item.total.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
  ]);

  // Rellenar hasta 15 renglones
  while (tableData.length < 15) {
    tableData.push(["", "", "", "", ""]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Cantidad", "Unidad", "Descripción", "P.U.", "Importe"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 95 },
      3: { cellWidth: 27, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  const afterTableY =
    (doc as any).lastAutoTable.finalY + 8;

  /* =====================================================
     TOTALES
     ===================================================== */
  let totalsY = afterTableY;

  doc.text("Subtotal:", 148, totalsY);
  doc.text(
    `$ ${order.subtotal.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    pageWidth - 15,
    totalsY,
    { align: "right" }
  );

  doc.text("IVA:", 148, totalsY + 5);
  doc.text(
    `$ ${order.iva.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    pageWidth - 15,
    totalsY + 5,
    { align: "right" }
  );

  doc.setFont("helvetica", "bold");
  doc.text("Total:", 148, totalsY + 11);
  doc.text(
    `$ ${order.total.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    pageWidth - 15,
    totalsY + 11,
    { align: "right" }
  );
  doc.setFont("helvetica", "normal");

  /* =====================================================
     FIRMAS
     ===================================================== */
  const firmasY = totalsY + 28;

  doc.text("Elabora", 35, firmasY, { align: "center" });
  doc.line(20, firmasY + 2, 50, firmasY + 2);
  doc.text(order.buyer, 35, firmasY + 6, { align: "center" });

  doc.text("Autoriza", 105, firmasY, { align: "center" });
  doc.line(90, firmasY + 2, 120, firmasY + 2);
  doc.text("Dirección", 105, firmasY + 6, { align: "center" });

  doc.text("Proveedor", 172, firmasY, { align: "center" });
  doc.line(157, firmasY + 2, 187, firmasY + 2);

  /* =====================================================
     COMENTARIOS
     ===================================================== */
  const comentariosY = firmasY + 15;
  doc.rect(15, comentariosY, pageWidth - 30, 16);
  doc.text("Comentarios:", 17, comentariosY + 4);
  if (order.observations) {
    doc.text(
      doc.splitTextToSize(order.observations, pageWidth - 34),
      17,
      comentariosY + 8
    );
  }

  /* =====================================================
     FOOTER
     ===================================================== */
  doc.setFontSize(8);
  doc.text(
    `Documento generado el ${new Date().toLocaleString("es-MX")}`,
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  return doc;
}

/* =====================================================
   UTILIDAD: cargar imagen como base64
   ===================================================== */
async function loadImageAsBase64(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}