import { Button } from "../primitives/button";
import { X, Download, Printer } from "lucide-react";
import { generatePurchaseOrderPDF } from "../utils/generatePurchaseOrderPDF";
import { toast } from "sonner";

export interface PurchaseOrderPrintItem {
  cantidad: number;
  unidad: string;
  descripcion: string;
  precioUnitario: number;
  total: number;
}

export interface PurchaseOrderPrintData {
  numeroOrden: string;
  fechaEmision: string;
  obra: {
    codigo: string;
    nombre: string;
    cliente: string;
    residente?: string | null;
    direccion?: string | null;
  };
  proveedor: {
    nombre: string;
    contacto?: string | null;
    direccion?: string | null;
  };
  compradorNombre: string;
  tipoEntrega: string;
  fechaEntrega: string;
  items: PurchaseOrderPrintItem[];
  subtotal: number;
  iva: number;
  total: number;
  observaciones?: string | null;
}

interface PurchaseOrderPDFProps {
  order: PurchaseOrderPrintData;
  onClose: () => void;
}

export function PurchaseOrderPDF({ order, onClose }: PurchaseOrderPDFProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const doc = await generatePurchaseOrderPDF({
        orderNumber: order.numeroOrden,
        createdDate: order.fechaEmision,
        workCode: order.obra.codigo,
        workName: order.obra.nombre,
        client: order.obra.cliente,
        buyer: order.compradorNombre,
        supplier: order.proveedor.nombre,
        supplierFullName: order.proveedor.nombre,
        supplierContact: order.proveedor.contacto || undefined,
        supplierAddress: order.proveedor.direccion || undefined,
        workResident: order.obra.residente || undefined,
        workAddress: order.obra.direccion || undefined,
        deliveryType: order.tipoEntrega,
        deliveryDate: order.fechaEntrega,
        items: order.items.map((item) => ({
          quantity: item.cantidad,
          unit: item.unidad,
          description: item.descripcion,
          unitPrice: item.precioUnitario,
          total: item.total,
        })),
        subtotal: order.subtotal,
        iva: order.iva,
        total: order.total,
        observations: order.observaciones || undefined,
      });
      doc.save(`OC-${order.numeroOrden}.pdf`);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 print:hidden">
          <h2 className="text-xl font-bold">Vista Previa - Orden de Compra</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-[210mm] mx-auto bg-white" id="pdf-content">
            {/* Document */}
            <div className="border-[3px] border-black">
              {/* Header Section */}
              <div className="flex border-b-[3px] border-black">
                {/* Logo Section - IDP Logo Amarillo */}
                <div className="w-28 border-r-[3px] border-black flex items-center justify-center bg-white p-2">
                  <img
                    src="/logo-idp-alterno.svg"
                    alt="IDP Logo"
                    className="w-full h-24 object-contain"
                  />
                </div>

                {/* Company Info Section */}
                <div className="flex-1 bg-[#003B7A] text-white p-4 flex flex-col justify-center">
                  <h1 className="text-3xl font-black text-center mb-3 tracking-wide">ORDEN DE COMPRA</h1>
                  <div className="text-[11px] space-y-0.5 text-center">
                    <p className="font-bold">IDP CC SC DE RL DE CV</p>
                    <p>ICC110321LN0</p>
                    <p>AV. PASEO DE LA CONSTITUCION No. 60</p>
                    <p>COMPRAS@IDPCC.COM.MX</p>
                  </div>
                </div>

                {/* Order Number Section */}
                <div className="w-56 border-l-[3px] border-black">
                  <div className="p-2 border-b-2 border-black bg-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">No. O.C.</span>
                      <span className="font-semibold">{order.numeroOrden}</span>
                    </div>
                  </div>
                  <div className="p-2 border-b-2 border-black bg-white">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Comprador:</span>
                      <span>{order.compradorNombre.split(" ")[0]}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Fecha:</span>
                      <span>{order.fechaEmision}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work and Supplier Info */}
              <div className="grid grid-cols-2">
                <div className="border-r border-black p-4">
                  <h3 className="font-bold text-sm mb-2">OBRA</h3>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">Nombre:</span> {order.obra.nombre}</p>
                    <p><span className="font-semibold">No. Obra:</span> {order.obra.codigo}</p>
                    <p><span className="font-semibold">Cliente:</span> {order.obra.cliente}</p>
                    {order.obra.residente && (
                      <p><span className="font-semibold">Residente:</span> {order.obra.residente}</p>
                    )}
                    {order.obra.direccion && (
                      <p><span className="font-semibold">Dirección:</span> {order.obra.direccion}</p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2">PROVEEDOR</h3>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">Nombre:</span> {order.proveedor.nombre}</p>
                    {order.proveedor.contacto && (
                      <p><span className="font-semibold">Contacto:</span> {order.proveedor.contacto}</p>
                    )}
                    {order.proveedor.direccion && (
                      <p><span className="font-semibold">Dirección:</span> {order.proveedor.direccion}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-black">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-black">
                      <th className="text-left p-2 font-semibold">Cantidad</th>
                      <th className="text-left p-2 font-semibold">Unidad</th>
                      <th className="text-left p-2 font-semibold">Descripción</th>
                      <th className="text-right p-2 font-semibold">Precio Unitario</th>
                      <th className="text-right p-2 font-semibold">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2">{item.cantidad}</td>
                        <td className="p-2">{item.unidad}</td>
                        <td className="p-2">{item.descripcion}</td>
                        <td className="p-2 text-right">${item.precioUnitario.toFixed(2)}</td>
                        <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="p-4 border-t border-black">
                <div className="flex justify-end">
                  <div className="w-64 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA:</span>
                      <span>${order.iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              {order.observaciones && (
                <div className="p-4 border-t border-black text-xs">
                  <p className="font-semibold">Observaciones:</p>
                  <p>{order.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
