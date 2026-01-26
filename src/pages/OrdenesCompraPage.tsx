import { useMemo, useState } from "react";
import { Button } from "../ui/primitives/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/primitives/alert";
import { Plus } from "lucide-react";
import {
  useCreateOrdenCompra,
  useDeleteOrdenCompra,
  useOrdenesCompraList,
  useProveedoresList,
  useObrasList,
  useUpdateOrdenCompra,
} from "../core/hooks";
import type {
  Obra,
  OrdenCompra,
  OrdenCompraCreate,
  Proveedor,
} from "../core/types/entities";
import {
  PurchaseOrderForm,
  PurchaseOrderFormValues,
} from "../ui/compras/PurchaseOrderForm";
import { OrdenesCompraTable } from "../ui/compras/OrdenesCompraTable";
import { PurchaseOrderPDF, PurchaseOrderPrintData } from "../ui/compras/PurchaseOrderPDF";

const toFormValues = (orden: OrdenCompra): PurchaseOrderFormValues => ({
  numeroOrden: orden.numeroOrden,
  obraId: orden.obraId,
  proveedorId: orden.proveedorId,
  compradorNombre: orden.compradorNombre || "",
  fechaEntrega: orden.fechaEntrega,
  tipoEntrega: orden.tipoEntrega || "en_obra",
  hasIva: orden.hasIva,
  descuento: orden.descuento,
  observaciones: orden.observaciones || "",
  items: orden.items.map((item) => ({
    id: item.id,
    descripcion: item.descripcion,
    unidad: item.unidad,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    total: item.total,
  })),
});

const toCreatePayload = (values: PurchaseOrderFormValues): OrdenCompraCreate => ({
  obraId: values.obraId,
  proveedorId: values.proveedorId,
  compradorNombre: values.compradorNombre || null,
  fechaEntrega: values.fechaEntrega,
  tipoEntrega: values.tipoEntrega || null,
  hasIva: values.hasIva,
  descuento: values.descuento,
  observaciones: values.observaciones || null,
  items: values.items.map((item) => ({
    cantidad: item.cantidad,
    unidad: item.unidad,
    descripcion: item.descripcion,
    precioUnitario: item.precioUnitario,
    total: item.total,
  })),
});

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

export default function OrdenesCompraPage() {
  const { data: ordenes, loading, error } = useOrdenesCompraList();
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const createOrden = useCreateOrdenCompra();
  const updateOrden = useUpdateOrdenCompra();
  const deleteOrden = useDeleteOrdenCompra();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);

  const editingOrden = useMemo(
    () => (editingId ? ordenes.find((orden) => orden.id === editingId) || null : null),
    [editingId, ordenes]
  );

  const pdfOrden = useMemo(
    () => (pdfId ? ordenes.find((orden) => orden.id === pdfId) || null : null),
    [pdfId, ordenes]
  );

  const handleCreateClick = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ordenId: string) => {
    setEditingId(ordenId);
    setIsFormOpen(true);
  };

  const handleDelete = async (ordenId: string) => {
    if (confirm("¿Eliminar esta orden de compra?")) {
      await deleteOrden.mutate(ordenId);
    }
  };

  const handleSave = async (values: PurchaseOrderFormValues) => {
    const payload = toCreatePayload(values);
    if (editingId) {
      await updateOrden.mutate({ id: editingId, data: payload });
    } else {
      await createOrden.mutate(payload);
    }
  };

  const workOptions = obras.map((obra) => ({
    id: obra.id,
    codigo: obra.codigo,
    nombre: obra.nombre,
    cliente: obra.cliente,
    numeroContrato: obra.numeroContrato,
    residente: obra.residente,
    direccion: obra.direccion,
  }));

  const supplierOptions = proveedores.map((proveedor) => ({
    id: proveedor.id,
    razonSocial: proveedor.razonSocial,
    aliasProveedor: proveedor.aliasProveedor,
    contactoPrincipal: proveedor.contactoPrincipal,
    rfc: proveedor.rfc,
    direccion: proveedor.direccion,
    telefono: proveedor.telefono,
    banco: proveedor.banco,
    numeroCuenta: proveedor.numeroCuenta,
    clabe: proveedor.clabe,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Órdenes de Compra</h2>
          <p className="text-sm text-muted-foreground">
            Administra las órdenes de compra y descarga PDFs oficiales.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {createOrden.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{createOrden.error}</AlertDescription>
        </Alert>
      )}

      {updateOrden.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al actualizar</AlertTitle>
          <AlertDescription>{updateOrden.error}</AlertDescription>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={(ordenId) => setPdfId(ordenId)}
      />

      {loading && <p className="text-sm text-muted-foreground">Cargando órdenes...</p>}

      {isFormOpen && (
        <PurchaseOrderForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editOrder={editingOrden ? toFormValues(editingOrden) : null}
          works={workOptions}
          suppliers={supplierOptions}
        />
      )}

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
