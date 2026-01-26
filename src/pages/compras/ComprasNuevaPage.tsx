import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { PurchaseOrderForm, PurchaseOrderFormValues } from "../../ui/compras/PurchaseOrderForm";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useCreateOrdenCompra,
  useObrasList,
  useProveedoresList,
} from "../../core/hooks";
import type { OrdenCompraCreate } from "../../core/types/entities";
import { useNavigate } from "react-router-dom";

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

export default function ComprasNuevaPage() {
  const { data: obras } = useObrasList();
  const { data: proveedores } = useProveedoresList();
  const createOrden = useCreateOrdenCompra();
  const navigate = useNavigate();

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

  const handleSave = async (values: PurchaseOrderFormValues) => {
    const payload = toCreatePayload(values);
    const result = await createOrden.mutate(payload);
    if (result?.id) {
      navigate(`/compras/${result.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Nueva Orden de Compra</h2>
        <p className="text-sm text-muted-foreground">
          Completa la información para registrar una nueva orden de compra.
        </p>
      </div>

      <FieldErrorsAlert title="Errores de validación" fieldErrors={createOrden.fieldErrors} />

      {createOrden.error && !createOrden.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{createOrden.error}</AlertDescription>
        </Alert>
      )}

      <PurchaseOrderForm
        onClose={() => navigate("/compras")}
        onSave={handleSave}
        works={workOptions}
        suppliers={supplierOptions}
      />
    </div>
  );
}
