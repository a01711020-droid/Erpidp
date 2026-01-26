import { useState } from "react";
import { useObras, useOrdenesCompra, useProveedores } from "../../core/hooks";
import { ComprasListView } from "../../ui/compras/ComprasListView";

export default function ComprasListPage() {
  const [obraFilter, setObraFilter] = useState("");
  const [proveedorFilter, setProveedorFilter] = useState("");

  const {
    data: ordenes,
    loading: ordenesLoading,
    error: ordenesError,
  } = useOrdenesCompra({ pageSize: 200 });
  const { data: obras, loading: obrasLoading, error: obrasError } = useObras({ pageSize: 200 });
  const {
    data: proveedores,
    loading: proveedoresLoading,
    error: proveedoresError,
  } = useProveedores({ pageSize: 200 });

  return (
    <ComprasListView
      ordenes={ordenes}
      obras={obras}
      proveedores={proveedores}
      loading={ordenesLoading || obrasLoading || proveedoresLoading}
      error={ordenesError || obrasError || proveedoresError}
      obraFilter={obraFilter}
      proveedorFilter={proveedorFilter}
      onChangeObra={setObraFilter}
      onChangeProveedor={setProveedorFilter}
    />
  );
}
