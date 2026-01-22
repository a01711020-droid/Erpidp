import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { dataProvider } from "../providers";
import type { Obra, OrdenCompraCreate, Proveedor } from "../types/entities";

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
  const [obras, setObras] = useState<Obra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [obraId, setObraId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<OrdenCompraCreate["tipoEntrega"]>("en_obra");
  const [observaciones, setObservaciones] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ ...emptyItem }]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [obrasResponse, proveedoresResponse] = await Promise.all([
        dataProvider.listObras({ pageSize: 200 }),
        dataProvider.listProveedores({ pageSize: 200 }),
      ]);
      setObras(obrasResponse.data);
      setProveedores(proveedoresResponse.data);
    };
    fetchData().catch((err) => setError((err as Error).message));
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.cantidad * item.precioUnitario,
      0
    );
    const iva = subtotal * 0.16;
    return { subtotal, iva, total: subtotal + iva };
  }, [items]);

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
        fechaEntrega,
        tipoEntrega,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Nueva orden de compra</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/compras">Volver al listado</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="obraId">Obra</Label>
                <select
                  id="obraId"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={obraId}
                  onChange={(e) => setObraId(e.target.value)}
                >
                  <option value="">Selecciona una obra</option>
                  {obras.map((obra) => (
                    <option key={obra.id} value={obra.id}>
                      {obra.codigo} - {obra.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proveedorId">Proveedor</Label>
                <select
                  id="proveedorId"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                >
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.razonSocial}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaEntrega">Fecha entrega</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoEntrega">Tipo entrega</Label>
                <select
                  id="tipoEntrega"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={tipoEntrega || ""}
                  onChange={(e) => setTipoEntrega(e.target.value as OrdenCompraCreate["tipoEntrega"])}
                >
                  <option value="en_obra">En obra</option>
                  <option value="bodega">Bodega</option>
                  <option value="recoger">Recoger</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Items</h3>
              {items.map((item, index) => (
                <div key={index} className="grid gap-2 md:grid-cols-5 items-end">
                  <Input
                    placeholder="Descripción"
                    value={item.descripcion}
                    onChange={(e) => updateItem(index, "descripcion", e.target.value)}
                  />
                  <Input
                    placeholder="Unidad"
                    value={item.unidad}
                    onChange={(e) => updateItem(index, "unidad", e.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => updateItem(index, "cantidad", Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Precio unitario"
                    value={item.precioUnitario}
                    onChange={(e) => updateItem(index, "precioUnitario", Number(e.target.value))}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      ${(item.cantidad * item.precioUnitario || 0).toFixed(2)}
                    </span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        Quitar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem}>
                Agregar item
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Subtotal: ${totals.subtotal.toFixed(2)} · IVA: ${totals.iva.toFixed(2)} · Total:
              ${totals.total.toFixed(2)}
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!isValid || saving}>
                {saving ? "Guardando..." : "Crear orden"}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
