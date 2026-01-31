import ErrorState from "@/ui/common/ErrorState";
import LoadingState from "@/ui/common/LoadingState";
import GestionProveedoresView from "@/ui/proveedores/GestionProveedoresView";
import { useProveedores } from "@/core/hooks/useProveedores";
import type { Proveedor } from "@/core/data/types";

export default function ProveedoresPage() {
  const {
    proveedores,
    isLoading,
    error,
    refetch,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
  } = useProveedores();

  const handleCreate = async (payload: Partial<Proveedor>) => {
    await createProveedor({
      alias_proveedor: payload.alias_proveedor ?? "",
      razon_social: payload.razon_social ?? "",
      rfc: payload.rfc ?? "",
      direccion: payload.direccion ?? null,
      ciudad: payload.ciudad ?? null,
      codigo_postal: payload.codigo_postal ?? null,
      telefono: payload.telefono ?? null,
      email: payload.email ?? null,
      contacto_principal: payload.contacto_principal ?? null,
      banco: payload.banco ?? null,
      numero_cuenta: payload.numero_cuenta ?? null,
      clabe: payload.clabe ?? null,
      tipo_proveedor: payload.tipo_proveedor ?? null,
      dias_credito: payload.dias_credito ?? 0,
      limite_credito: payload.limite_credito ?? 0,
      activo: payload.activo ?? true,
    });
  };

  const handleUpdate = async (id: string, payload: Partial<Proveedor>) => {
    await updateProveedor(id, {
      alias_proveedor: payload.alias_proveedor,
      razon_social: payload.razon_social,
      rfc: payload.rfc,
      direccion: payload.direccion,
      ciudad: payload.ciudad,
      codigo_postal: payload.codigo_postal,
      telefono: payload.telefono,
      email: payload.email,
      contacto_principal: payload.contacto_principal,
      banco: payload.banco,
      numero_cuenta: payload.numero_cuenta,
      clabe: payload.clabe,
      tipo_proveedor: payload.tipo_proveedor ?? null,
      dias_credito: payload.dias_credito,
      limite_credito: payload.limite_credito,
      activo: payload.activo,
    });
  };

  const handleDelete = async (id: string) => {
    await deactivateProveedor(id);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ErrorState
          title="No se pudieron cargar los proveedores"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <LoadingState title="Cargando proveedores" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <GestionProveedoresView
        proveedores={proveedores}
        onCrearProveedor={handleCreate}
        onEditarProveedor={handleUpdate}
        onEliminarProveedor={handleDelete}
      />
    </div>
  );
}
