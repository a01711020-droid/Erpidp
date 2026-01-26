import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import {
  useOrdenesCompraList,
  useProveedoresList,
  useObrasList,
  useDeleteOrdenCompra,
} from "../../core/hooks";
import type { Obra, OrdenCompra, Proveedor } from "../../core/types/entities";
import { OrdenesCompraTable } from "../../ui/compras/OrdenesCompraTable";
import { PurchaseOrderPDF, PurchaseOrderPrintData } from "../../ui/compras/PurchaseOrderPDF";
import { useNavigate } from "react-router-dom";

const buildPrintData = (
  orden: OrdenCompra,
  obra: Obra | undefined,
  proveedor: Proveedor | undefined
): PurchaseOrderPrintData => ({
  numeroOrden: orden.numeroOrden,
  fechaEmision: orden.fechaEmision,
  obra: {
    codigo: obra?.codigo || "",
    nombre: obra?.nombre || "",
    cliente: obra?.cliente || "",
    residente: obra?.residente,
    direccion: obra?.direccion,
  },
  proveedor: {
    nombre: proveedor?.razonSocial || "",
    contacto: proveedor?.contactoPrincipal,
    direccion: proveedor?.direccion,
  },
  compradorNombre: orden.compradorNombre || "",
  tipoEntrega: orden.tipoEntrega || "",
  fechaEntrega: orden.fechaEntrega,
  items: orden.items.map((item) => ({
    cantidad: item.cantidad,
    unidad: item.unidad,
    descripcion: item.descripcion,
    precioUnitario: item.precioUnitario,
    total: item.total,
  })),
  subtotal: orden.subtotal,
  iva: orden.iva,
  total: orden.total,
  observaciones: orden.observaciones,
});

export default function ComprasListPage() {
  const { data: ordenes, loading, error } = useOrdenesCompraList();
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const deleteOrden = useDeleteOrdenCompra();
  const navigate = useNavigate();

  const [pdfId, setPdfId] = useState<string | null>(null);

  const pdfOrden = useMemo(
    () => (pdfId ? ordenes.find((orden) => orden.id === pdfId) || null : null),
    [pdfId, ordenes]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Órdenes de Compra</h2>
        <p className="text-sm text-muted-foreground">
          Lista de órdenes registradas. Usa "Nueva OC" para crear una nueva.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {deleteOrden.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al eliminar</AlertTitle>
          <AlertDescription>{deleteOrden.error}</AlertDescription>
        </Alert>
      )}

      <OrdenesCompraTable
        ordenes={ordenes.map((orden) => ({
          id: orden.id,
          numeroOrden: orden.numeroOrden,
          obraNombre: obras.find((obra) => obra.id === orden.obraId)?.nombre || "",
          proveedorNombre:
            proveedores.find((proveedor) => proveedor.id === orden.proveedorId)?.razonSocial || "",
          estado: orden.estado,
          total: orden.total,
          fechaEntrega: orden.fechaEntrega,
        }))}
        onEdit={(ordenId) => navigate(`/compras/${ordenId}`)}
        onDelete={async (ordenId) => {
          if (confirm("¿Eliminar esta orden de compra?")) {
            const orden = ordenes.find((item) => item.id === ordenId);
            await deleteOrden.mutate({ id: ordenId, obraId: orden?.obraId });
          }
        }}
        onPreview={(ordenId) => setPdfId(ordenId)}
      />

      {loading && <p className="text-sm text-muted-foreground">Cargando órdenes...</p>}

      {pdfOrden && (
        <PurchaseOrderPDF
          onClose={() => setPdfId(null)}
          order={buildPrintData(
            pdfOrden,
            obras.find((obra) => obra.id === pdfOrden.obraId),
            proveedores.find((proveedor) => proveedor.id === pdfOrden.proveedorId)
          )}
        />
      )}
    </div>
  );
}
