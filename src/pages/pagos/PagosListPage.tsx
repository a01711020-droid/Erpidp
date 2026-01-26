import { useMemo, useState } from "react";
import { Button } from "../../ui/primitives/button";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { Plus } from "lucide-react";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useCreatePago,
  useDeletePago,
  useOrdenesCompraList,
  usePagosList,
  useProveedoresList,
  useObrasList,
  useUpdatePago,
} from "../../core/hooks";
import type { OrdenCompra, Pago, PagoCreate } from "../../core/types/entities";
import { PagoForm, PagoFormValues } from "../../ui/pagos/PagoForm";
import { PagosTable } from "../../ui/pagos/PagosTable";

const toFormValues = (pago: Pago): PagoFormValues => ({
  obraId: pago.obraId,
  proveedorId: pago.proveedorId,
  ordenCompraId: pago.ordenCompraId,
  monto: pago.monto,
  metodoPago: pago.metodoPago,
  fechaProgramada: pago.fechaProgramada,
  referencia: pago.referencia || "",
  folioFactura: pago.folioFactura || "",
  montoFactura: pago.montoFactura || 0,
  fechaFactura: pago.fechaFactura || "",
  diasCredito: pago.diasCredito || 0,
  fechaVencimiento: pago.fechaVencimiento || "",
  observaciones: pago.observaciones || "",
  estado: pago.estado,
});

const toCreatePayload = (values: PagoFormValues): PagoCreate => ({
  obraId: values.obraId,
  proveedorId: values.proveedorId,
  ordenCompraId: values.ordenCompraId,
  monto: values.monto,
  metodoPago: values.metodoPago,
  fechaProgramada: values.fechaProgramada,
  referencia: values.referencia || null,
  folioFactura: values.folioFactura || null,
  montoFactura: values.montoFactura || null,
  fechaFactura: values.fechaFactura || null,
  diasCredito: values.diasCredito || null,
  fechaVencimiento: values.fechaVencimiento || null,
  observaciones: values.observaciones || null,
});

export default function PagosListPage() {
  const { data: pagos, loading, error } = usePagosList();
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const { data: ordenes } = useOrdenesCompraList();
  const createPago = useCreatePago();
  const updatePago = useUpdatePago();
  const deletePago = useDeletePago();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingPago = useMemo(
    () => (editingId ? pagos.find((pago) => pago.id === editingId) || null : null),
    [editingId, pagos]
  );

  const handleCreateClick = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pagoId: string) => {
    setEditingId(pagoId);
    setIsFormOpen(true);
  };

  const handleDelete = async (pagoId: string) => {
    if (confirm("¿Eliminar este pago?")) {
      const pago = pagos.find((item) => item.id === pagoId);
      await deletePago.mutate({ id: pagoId, obraId: pago?.obraId });
    }
  };

  const handleSave = async (values: PagoFormValues) => {
    const payload = toCreatePayload(values);
    if (editingId) {
      await updatePago.mutate({ id: editingId, data: { ...payload, estado: values.estado } });
    } else {
      await createPago.mutate(payload);
    }
  };

  const obraOptions = obras.map((obra) => ({
    id: obra.id,
    codigo: obra.codigo,
    nombre: obra.nombre,
  }));

  const proveedorOptions = proveedores.map((proveedor) => ({
    id: proveedor.id,
    razonSocial: proveedor.razonSocial,
    aliasProveedor: proveedor.aliasProveedor,
  }));

  const ordenOptions = ordenes.map((orden: OrdenCompra) => ({
    id: orden.id,
    numeroOrden: orden.numeroOrden,
    obraId: orden.obraId,
    proveedorId: orden.proveedorId,
    total: orden.total,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Pagos</h2>
          <p className="text-sm text-muted-foreground">
            Administra los pagos asociados a órdenes de compra.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nuevo Pago
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldErrorsAlert title="Errores de validación" fieldErrors={createPago.fieldErrors} />
      <FieldErrorsAlert title="Errores de validación" fieldErrors={updatePago.fieldErrors} />

      {createPago.error && !createPago.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{createPago.error}</AlertDescription>
        </Alert>
      )}

      {updatePago.error && !updatePago.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al actualizar</AlertTitle>
          <AlertDescription>{updatePago.error}</AlertDescription>
        </Alert>
      )}

      {deletePago.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al eliminar</AlertTitle>
          <AlertDescription>{deletePago.error}</AlertDescription>
        </Alert>
      )}

      <PagosTable
        pagos={pagos.map((pago) => ({
          id: pago.id,
          numeroPago: pago.numeroPago,
          obraNombre: obras.find((obra) => obra.id === pago.obraId)?.nombre || "",
          proveedorNombre:
            proveedores.find((proveedor) => proveedor.id === pago.proveedorId)?.razonSocial || "",
          ordenCompra: ordenes.find((orden) => orden.id === pago.ordenCompraId)?.numeroOrden || "",
          monto: pago.monto,
          estado: pago.estado,
          fechaProgramada: pago.fechaProgramada,
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {loading && <p className="text-sm text-muted-foreground">Cargando pagos...</p>}

      {isFormOpen && (
        <PagoForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editPago={editingPago ? toFormValues(editingPago) : null}
          obras={obraOptions}
          proveedores={proveedorOptions}
          ordenes={ordenOptions}
        />
      )}
    </div>
  );
}
