import { PurchaseOrder } from "./PurchaseOrderForm";
import { worksDirectory } from "../utils/codeGenerators";
import { Button } from "./ui/button";
import { X, Download, Printer } from "lucide-react";

interface PurchaseOrderPDFProps {
  order: PurchaseOrder;
  onClose: () => void;
}

export function PurchaseOrderPDF({ order, onClose }: PurchaseOrderPDFProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("En producción, esto generaría un PDF descargable");
    // Aquí se implementaría la generación de PDF real con una librería como jsPDF o react-pdf
  };

  const workInfo = worksDirectory[order.workCode as keyof typeof worksDirectory];

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
            <div className="border-2 border-gray-800">
              {/* Header Section */}
              <div className="flex border-b-2 border-gray-800">
                {/* Logo Section */}
                <div className="w-32 border-r-2 border-gray-800 p-3 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-2xl">CC</span>
                    </div>
                    <p className="text-xs font-bold">CONSTRUCTORA</p>
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex-1 bg-blue-900 text-white p-3">
                  <h1 className="text-2xl font-bold text-center mb-2">ORDEN DE COMPRA</h1>
                  <div className="text-xs space-y-1">
                    <p className="font-bold">IDP CC SC DE RL DE CV</p>
                    <p>ICC110321LN0</p>
                    <p>A.V. PASEO DE LA CONSTITUCION No. 60</p>
                    <p>COMPRAS@IDPCC.COM.MX</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="w-64 border-l-2 border-gray-800 bg-gray-50">
                  <div className="p-2 border-b border-gray-800">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">No.</span>
                      <span>{order.orderNumber}</span>
                    </div>
                  </div>
                  <div className="p-2 border-b border-gray-800">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">Comprador</span>
                      <span>{order.buyer.split(" ")[0]}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">Fecha</span>
                      <span>{new Date(order.createdDate).toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Section */}
              <div className="border-b-2 border-gray-800 bg-gray-50">
                <div className="flex">
                  <div className="w-32 border-r-2 border-gray-800 p-2">
                    <p className="text-sm font-bold text-center">Obra</p>
                  </div>
                  <div className="flex-1 p-2">
                    <div className="text-sm space-y-1">
                      <p className="font-bold text-lg">{workInfo?.name}</p>
                      <p>{workInfo?.resident}</p>
                      <p className="text-xs text-gray-600">{workInfo?.contractNumber}</p>
                    </div>
                  </div>
                  <div className="w-40 border-l-2 border-gray-800 p-2 bg-white">
                    <p className="text-xs font-bold">No. Obra</p>
                    <p className="text-3xl font-bold text-center mt-1">{order.workCode}</p>
                  </div>
                </div>
              </div>

              {/* Supplier Section */}
              <div className="border-b-2 border-gray-800">
                <div className="flex">
                  <div className="w-32 border-r-2 border-gray-800 p-2 bg-gray-50">
                    <p className="text-sm font-bold text-center">Proveedor</p>
                  </div>
                  <div className="flex-1 p-2">
                    <div className="text-sm space-y-1">
                      <p className="font-bold">{order.supplierFullName}</p>
                      <p className="text-xs">{order.supplierContact}</p>
                    </div>
                  </div>
                  <div className="w-64 border-l-2 border-gray-800 p-2 bg-gray-50">
                    <p className="text-xs font-bold mb-1">Cotización</p>
                    <p className="text-xs mb-2">Tipo: {order.deliveryType}</p>
                    <p className="text-xs font-bold">Fecha Entrega</p>
                    <p className="text-sm">
                      {new Date(order.deliveryDate).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-b-2 border-gray-800">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-800">
                      <th className="border-r border-gray-800 p-2 text-xs font-bold text-left w-24">
                        Cantidad
                      </th>
                      <th className="border-r border-gray-800 p-2 text-xs font-bold text-left w-20">
                        Unidad
                      </th>
                      <th className="border-r border-gray-800 p-2 text-xs font-bold text-left">
                        Descripción
                      </th>
                      <th className="border-r border-gray-800 p-2 text-xs font-bold text-right w-24">
                        P.U.
                      </th>
                      <th className="p-2 text-xs font-bold text-right w-32">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="border-r border-gray-300 p-2 text-sm text-center">
                          {item.quantity.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-r border-gray-300 p-2 text-sm text-center">
                          Pza
                        </td>
                        <td className="border-r border-gray-300 p-2 text-sm">
                          {item.description}
                        </td>
                        <td className="border-r border-gray-300 p-2 text-sm text-right">
                          ${" "}
                          {item.unitPrice.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-2 text-sm text-right">
                          ${" "}
                          {item.total.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to fill space */}
                    {Array.from({ length: Math.max(0, 15 - order.items.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-gray-300">
                        <td className="border-r border-gray-300 p-2 h-8">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="p-2">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Terms and Totals */}
              <div className="flex border-b-2 border-gray-800">
                <div className="flex-1 p-3 border-r-2 border-gray-800">
                  <p className="text-xs italic text-justify">
                    "El proveedor se compromete a cumplir en tiempo, forma y en la ubicación
                    solicitada los productos/servicios descritos en la presente Orden de Compra."
                  </p>
                </div>
                <div className="w-80 bg-gray-50">
                  <div className="flex justify-between p-2 border-b border-gray-800">
                    <span className="text-sm font-bold">Subtotal</span>
                    <span className="text-sm">
                      ${" "}
                      {order.subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between p-2 border-b border-gray-800">
                      <span className="text-sm font-bold">Otro:</span>
                      <span className="text-sm">
                        ${" "}
                        {order.discountAmount.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {order.hasIVA && (
                    <div className="flex justify-between p-2 border-b border-gray-800">
                      <span className="text-sm font-bold">IVA</span>
                      <span className="text-sm">
                        ${" "}
                        {order.iva.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-white">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-base font-bold">
                      ${" "}
                      {order.total.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex">
                <div className="flex-1 p-4 border-r-2 border-gray-800 text-center">
                  <p className="text-xs font-bold mb-8">Elabora</p>
                  <div className="border-t border-gray-800 pt-2">
                    <p className="text-sm">{order.buyer}</p>
                  </div>
                </div>
                <div className="flex-1 p-4 border-r-2 border-gray-800 text-center">
                  <p className="text-xs font-bold mb-8">Autoriza</p>
                  <div className="border-t border-gray-800 pt-2">
                    <p className="text-sm">Giovanni Martínez</p>
                  </div>
                </div>
                <div className="flex-1 p-4 text-center">
                  <p className="text-xs font-bold mb-8">Proveedor</p>
                  <div className="border-t border-gray-800 pt-2">
                    <p className="text-sm">{order.supplier}</p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {order.observations && (
                <div className="border-t-2 border-gray-800 p-3">
                  <p className="text-xs font-bold mb-2">Comentarios</p>
                  <p className="text-xs">{order.observations}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content,
          #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
