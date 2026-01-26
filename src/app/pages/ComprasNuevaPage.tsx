import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataProvider } from "../providers";
import type { OrdenCompraCreate } from "../types/entities";
import { useObras, useProveedores } from "../../core/hooks";
import { ComprasFormView } from "../../ui/compras/ComprasFormView";

interface ItemDraft {
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
}

const emptyItem: ItemDraft = {
  descripcion: "",
  unidad: "",
  cantidad: 0,
  precioUnitario: 0,
};

export default function ComprasNuevaPage() {
  const navigate = useNavigate();
  const [obraId, setObraId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [compradorNombre, setCompradorNombre] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<OrdenCompraCreate["tipoEntrega"]>("en_obra");
  const [hasIva, setHasIva] = useState(true);
  const [descuento, setDescuento] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ ...emptyItem }]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: obras, error: obrasError } = useObras({ pageSize: 200 });
  const { data: proveedores, error: proveedoresError } = useProveedores({ pageSize: 200 });

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.cantidad * item.precioUnitario,
      0
    );
    const descuentoMonto = subtotal * (descuento / 100);
    const subtotalConDescuento = subtotal - descuentoMonto;
    const iva = hasIva ? subtotalConDescuento * 0.16 : 0;
    return { subtotal, iva, total: subtotalConDescuento + iva };
  }, [items, descuento, hasIva]);

  const updateItem = (index: number, field: keyof ItemDraft, value: string | number) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index));

  const isValid =
    obraId &&
    proveedorId &&
    compradorNombre &&
    fechaEntrega &&
    items.some((item) => item.descripcion && item.unidad && item.cantidad > 0 && item.precioUnitario > 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const payload: OrdenCompraCreate = {
        obraId,
        proveedorId,
        compradorNombre: compradorNombre || null,
        fechaEntrega,
        tipoEntrega,
        hasIva,
        descuento,
        observaciones: observaciones || null,
        items: items
          .filter((item) => item.descripcion && item.unidad)
          .map((item) => ({
            descripcion: item.descripcion,
            unidad: item.unidad,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            total: item.cantidad * item.precioUnitario,
          })),
      };
      const created = await dataProvider.createOrdenCompra(payload);
      navigate(`/compras/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ComprasFormView
      obras={obras}
      proveedores={proveedores}
      obraId={obraId}
      proveedorId={proveedorId}
      compradorNombre={compradorNombre}
      fechaEntrega={fechaEntrega}
      tipoEntrega={tipoEntrega}
      hasIva={hasIva}
      descuento={descuento}
      observaciones={observaciones}
      items={items}
      totals={totals}
      error={error || obrasError || proveedoresError}
      saving={saving}
      onChange={(field, value) => {
        if (field === "obraId") setObraId(value as string);
        if (field === "proveedorId") setProveedorId(value as string);
        if (field === "compradorNombre") setCompradorNombre(value as string);
        if (field === "fechaEntrega") setFechaEntrega(value as string);
        if (field === "tipoEntrega") setTipoEntrega(value as OrdenCompraCreate["tipoEntrega"]);
        if (field === "hasIva") setHasIva(Boolean(value));
        if (field === "descuento") setDescuento(Number(value));
        if (field === "observaciones") setObservaciones(value as string);
      }}
      onItemChange={updateItem}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onSubmit={handleSubmit}
    />
  );
}
