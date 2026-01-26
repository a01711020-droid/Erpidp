import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { Button } from "../../ui/primitives/button";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useCreatePago,
  useDeletePago,
  useObrasList,
  useOrdenCompra,
  usePagosList,
  useProveedoresList,
  useUpdatePago,
} from "../../core/hooks";
import type { ListParams, Pago, PagoCreate } from "../../core/types/entities";
import { PagosTable } from "../../ui/pagos/PagosTable";
import { PagoForm, PagoFormValues } from "../../ui/pagos/PagoForm";

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

export default function PagosOcPage() {
  const { ocId } = useParams();
  const navigate = useNavigate();
  const filters: ListParams | undefined = ocId
    ? { filters: { ordenCompraId: ocId } }
    : undefined;

  const { data: pagos, loading, error } = usePagosList(filters);
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const { data: orden, error: ordenError, loading: ordenLoading } = useOrdenCompra(ocId);
  const createPago = useCreatePago();
  const updatePago = useUpdatePago();
  const deletePago = useDeletePago();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingPago = useMemo(
    () => (editingId ? pagos.find((pago) => pago.id === editingId) || null : null),
    [editingId, pagos]
  );

  const initialValues = orden
    ? {
        obraId: orden.obraId,
        proveedorId: orden.proveedorId,
        ordenCompraId: orden.id,
        monto: orden.total,
      }
    : undefined;

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

  const ordenOptions = orden
    ? [
        {
          id: orden.id,
          numeroOrden: orden.numeroOrden,
          obraId: orden.obraId,
          proveedorId: orden.proveedorId,
          total: orden.total,
        },
      ]
    : [];

  if (ordenLoading) {
    return <p className="text-sm text-muted-foreground">Cargando orden...</p>;
  }

  if (ordenError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{ordenError}</AlertDescription>
      </Alert>
    );
  }

  if (!orden) {
    return (
      <Alert>
        <AlertTitle>Orden no encontrada</AlertTitle>
        <AlertDescription>No se encontró la orden solicitada.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pagos de la OC {orden.numeroOrden}</h2>
          <p className="text-sm text-muted-foreground">
            Obra: {obras.find((obra) => obra.id === orden.obraId)?.nombre || "—"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/pagos")}>Volver a Pagos</Button>
          <Button className="gap-2" onClick={handleCreateClick}>Registrar Pago</Button>
        </div>
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
          ordenCompra: orden.numeroOrden,
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
          initialValues={editingPago ? undefined : initialValues}
          obras={obraOptions}
          proveedores={proveedorOptions}
          ordenes={ordenOptions}
        />
      )}
    </div>
  );
}
