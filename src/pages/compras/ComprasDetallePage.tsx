import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../ui/primitives/button";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useDeleteOrdenCompra,
  useObrasList,
  useOrdenCompra,
  useProveedoresList,
  useUpdateOrdenCompra,
} from "../../core/hooks";
import type { Obra, OrdenCompra, OrdenCompraCreate, Proveedor } from "../../core/types/entities";
import { PurchaseOrderForm, PurchaseOrderFormValues } from "../../ui/compras/PurchaseOrderForm";
import { PurchaseOrderPDF, PurchaseOrderPrintData } from "../../ui/compras/PurchaseOrderPDF";

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

const toUpdatePayload = (values: PurchaseOrderFormValues): OrdenCompraCreate => ({
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

export default function ComprasDetallePage() {
  const { ocId } = useParams();
  const navigate = useNavigate();
  const { data: orden, loading, error } = useOrdenCompra(ocId);
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const updateOrden = useUpdateOrdenCompra();
  const deleteOrden = useDeleteOrdenCompra();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  const obra = orden ? obras.find((item) => item.id === orden.obraId) : undefined;
  const proveedor = orden ? proveedores.find((item) => item.id === orden.proveedorId) : undefined;

  const workOptions = obras.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    nombre: item.nombre,
    cliente: item.cliente,
    numeroContrato: item.numeroContrato,
    residente: item.residente,
    direccion: item.direccion,
  }));

  const supplierOptions = proveedores.map((item) => ({
    id: item.id,
    razonSocial: item.razonSocial,
    aliasProveedor: item.aliasProveedor,
    contactoPrincipal: item.contactoPrincipal,
    rfc: item.rfc,
    direccion: item.direccion,
    telefono: item.telefono,
    banco: item.banco,
    numeroCuenta: item.numeroCuenta,
    clabe: item.clabe,
  }));

  const handleSave = async (values: PurchaseOrderFormValues) => {
    if (!ocId) return;
    const payload = toUpdatePayload(values);
    await updateOrden.mutate({ id: ocId, data: payload });
  };

  const handleDelete = async () => {
    if (!ocId) return;
    if (confirm("¿Eliminar esta orden de compra?")) {
      await deleteOrden.mutate({ id: ocId, obraId: orden?.obraId });
      navigate("/compras");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando orden...</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
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
          <h2 className="text-2xl font-bold text-slate-900">Orden {orden.numeroOrden}</h2>
          <p className="text-sm text-muted-foreground">
            {obra?.nombre || "Obra"} • {proveedor?.razonSocial || "Proveedor"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPdf(true)}>
            Ver PDF
          </Button>
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            Editar
          </Button>
          <Button variant="outline" onClick={() => navigate(`/pagos/oc/${orden.id}`)}>
            Ver Pagos
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-2">Datos de la Obra</h3>
          <p className="text-sm">Código: {obra?.codigo}</p>
          <p className="text-sm">Cliente: {obra?.cliente}</p>
          <p className="text-sm">Contrato: {obra?.numeroContrato}</p>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-2">Datos del Proveedor</h3>
          <p className="text-sm">Proveedor: {proveedor?.razonSocial}</p>
          <p className="text-sm">Contacto: {proveedor?.contactoPrincipal || "—"}</p>
          <p className="text-sm">RFC: {proveedor?.rfc}</p>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <h3 className="font-semibold mb-4">Resumen</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Subtotal</p>
            <p className="text-lg font-semibold">${orden.subtotal.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">IVA</p>
            <p className="text-lg font-semibold">${orden.iva.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">${orden.total.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <p className="text-lg font-semibold capitalize">{orden.estado}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <h3 className="font-semibold mb-2">Conceptos</h3>
        <ul className="space-y-2">
          {orden.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.descripcion}</span>
              <span>${item.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </li>
          ))}
          {orden.items.length === 0 && (
            <li className="text-sm text-muted-foreground">No hay conceptos registrados.</li>
          )}
        </ul>
      </div>

      <FieldErrorsAlert title="Errores de validación" fieldErrors={updateOrden.fieldErrors} />

      {updateOrden.error && !updateOrden.fieldErrors && (
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

      {isEditOpen && (
        <PurchaseOrderForm
          onClose={() => setIsEditOpen(false)}
          onSave={handleSave}
          editOrder={toFormValues(orden)}
          works={workOptions}
          suppliers={supplierOptions}
        />
      )}

      {showPdf && (
        <PurchaseOrderPDF
          onClose={() => setShowPdf(false)}
          order={buildPrintData(orden, obra, proveedor)}
        />
      )}
    </div>
  );
}
