import { useMemo, useState } from "react";
import { Button } from "../../ui/primitives/button";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { Plus } from "lucide-react";
import { ProveedorForm, ProveedorFormValues } from "../../ui/proveedores/ProveedorForm";
import { ProveedoresTable } from "../../ui/proveedores/ProveedoresTable";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useCreateProveedor,
  useDeleteProveedor,
  useProveedoresList,
  useUpdateProveedor,
} from "../../core/hooks";
import type { Proveedor, ProveedorCreate } from "../../core/types/entities";

const toFormValues = (proveedor: Proveedor): ProveedorFormValues => ({
  razonSocial: proveedor.razonSocial,
  aliasProveedor: proveedor.aliasProveedor || "",
  nombreComercial: proveedor.nombreComercial || "",
  rfc: proveedor.rfc,
  direccion: proveedor.direccion || "",
  ciudad: proveedor.ciudad || "",
  codigoPostal: proveedor.codigoPostal || "",
  telefono: proveedor.telefono || "",
  email: proveedor.email || "",
  contactoPrincipal: proveedor.contactoPrincipal || "",
  banco: proveedor.banco || "",
  numeroCuenta: proveedor.numeroCuenta || "",
  clabe: proveedor.clabe || "",
  tipoProveedor: proveedor.tipoProveedor || "",
  creditoDias: proveedor.creditoDias,
  limiteCredito: proveedor.limiteCredito,
  activo: proveedor.activo,
});

const toCreatePayload = (values: ProveedorFormValues): ProveedorCreate => ({
  razonSocial: values.razonSocial,
  aliasProveedor: values.aliasProveedor || null,
  nombreComercial: values.nombreComercial || null,
  rfc: values.rfc,
  direccion: values.direccion || null,
  ciudad: values.ciudad || null,
  codigoPostal: values.codigoPostal || null,
  telefono: values.telefono || null,
  email: values.email || null,
  contactoPrincipal: values.contactoPrincipal || null,
  banco: values.banco || null,
  numeroCuenta: values.numeroCuenta || null,
  clabe: values.clabe || null,
  tipoProveedor: values.tipoProveedor || null,
  creditoDias: values.creditoDias || 0,
  limiteCredito: values.limiteCredito || 0,
  activo: values.activo,
});

export default function ProveedoresCatalogoPage() {
  const { data: proveedores, loading, error } = useProveedoresList();
  const createProveedor = useCreateProveedor();
  const updateProveedor = useUpdateProveedor();
  const deleteProveedor = useDeleteProveedor();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingProveedor = useMemo(
    () => (editingId ? proveedores.find((proveedor) => proveedor.id === editingId) || null : null),
    [editingId, proveedores]
  );

  const handleCreateClick = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (proveedorId: string) => {
    setEditingId(proveedorId);
    setIsFormOpen(true);
  };

  const handleDelete = async (proveedorId: string) => {
    if (confirm("¿Eliminar este proveedor?")) {
      await deleteProveedor.mutate(proveedorId);
    }
  };

  const handleSave = async (values: ProveedorFormValues) => {
    const payload = toCreatePayload(values);
    if (editingId) {
      await updateProveedor.mutate({ id: editingId, data: payload });
    } else {
      await createProveedor.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Proveedores</h2>
          <p className="text-sm text-muted-foreground">
            Administra los proveedores y sus datos fiscales.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldErrorsAlert title="Errores de validación" fieldErrors={createProveedor.fieldErrors} />
      <FieldErrorsAlert title="Errores de validación" fieldErrors={updateProveedor.fieldErrors} />

      {createProveedor.error && !createProveedor.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{createProveedor.error}</AlertDescription>
        </Alert>
      )}

      {updateProveedor.error && !updateProveedor.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al actualizar</AlertTitle>
          <AlertDescription>{updateProveedor.error}</AlertDescription>
        </Alert>
      )}

      {deleteProveedor.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al eliminar</AlertTitle>
          <AlertDescription>{deleteProveedor.error}</AlertDescription>
        </Alert>
      )}

      <ProveedoresTable
        proveedores={proveedores.map((proveedor) => ({
          id: proveedor.id,
          razonSocial: proveedor.razonSocial,
          rfc: proveedor.rfc,
          contactoPrincipal: proveedor.contactoPrincipal,
          telefono: proveedor.telefono,
          tipoProveedor: proveedor.tipoProveedor,
          activo: proveedor.activo,
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {loading && <p className="text-sm text-muted-foreground">Cargando proveedores...</p>}

      {isFormOpen && (
        <ProveedorForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editProveedor={editingProveedor ? toFormValues(editingProveedor) : null}
        />
      )}
    </div>
  );
}
