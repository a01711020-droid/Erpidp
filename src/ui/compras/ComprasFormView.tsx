import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import type { Obra, OrdenCompraCreate, Proveedor } from "../../core/types/entities";

interface ItemDraft {
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
}

interface ComprasFormViewProps {
  obras: Obra[];
  proveedores: Proveedor[];
  obraId: string;
  proveedorId: string;
  compradorNombre: string;
  fechaEntrega: string;
  tipoEntrega: OrdenCompraCreate["tipoEntrega"];
  hasIva: boolean;
  descuento: number;
  observaciones: string;
  items: ItemDraft[];
  totals: { subtotal: number; iva: number; total: number };
  error: string | null;
  saving: boolean;
  onChange: (field: string, value: string | number | boolean) => void;
  onItemChange: (index: number, field: keyof ItemDraft, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (event: FormEvent) => void;
}

export function ComprasFormView({
  obras,
  proveedores,
  obraId,
  proveedorId,
  compradorNombre,
  fechaEntrega,
  tipoEntrega,
  hasIva,
  descuento,
  observaciones,
  items,
  totals,
  error,
  saving,
  onChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
}: ComprasFormViewProps) {
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
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="obraId">Obra</Label>
                <select
                  id="obraId"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={obraId}
                  onChange={(e) => onChange("obraId", e.target.value)}
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
                  onChange={(e) => onChange("proveedorId", e.target.value)}
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
                <Label htmlFor="compradorNombre">Comprador</Label>
                <Input
                  id="compradorNombre"
                  value={compradorNombre}
                  onChange={(e) => onChange("compradorNombre", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaEntrega">Fecha entrega</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => onChange("fechaEntrega", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoEntrega">Tipo entrega</Label>
                <select
                  id="tipoEntrega"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={tipoEntrega || ""}
                  onChange={(e) => onChange("tipoEntrega", e.target.value)}
                >
                  <option value="en_obra">En obra</option>
                  <option value="bodega">Bodega</option>
                  <option value="recoger">Recoger</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hasIva">IVA</Label>
                <select
                  id="hasIva"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={hasIva ? "si" : "no"}
                  onChange={(e) => onChange("hasIva", e.target.value === "si")}
                >
                  <option value="si">Aplica IVA</option>
                  <option value="no">Sin IVA</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descuento">Descuento (%)</Label>
                <Input
                  id="descuento"
                  type="number"
                  min="0"
                  step="0.01"
                  value={descuento}
                  onChange={(e) => onChange("descuento", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                value={observaciones}
                onChange={(e) => onChange("observaciones", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Items</h3>
              {items.map((item, index) => (
                <div key={index} className="grid gap-2 md:grid-cols-6 items-end">
                  <Input
                    placeholder="Descripción"
                    value={item.descripcion}
                    onChange={(e) => onItemChange(index, "descripcion", e.target.value)}
                  />
                  <Input
                    placeholder="Unidad"
                    value={item.unidad}
                    onChange={(e) => onItemChange(index, "unidad", e.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => onItemChange(index, "cantidad", Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Precio unitario"
                    value={item.precioUnitario}
                    onChange={(e) => onItemChange(index, "precioUnitario", Number(e.target.value))}
                  />
                  <span className="text-sm">
                    ${(item.cantidad * item.precioUnitario || 0).toFixed(2)}
                  </span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                    >
                      Quitar
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={onAddItem}>
                Agregar item
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Subtotal: ${totals.subtotal.toFixed(2)} · IVA: ${totals.iva.toFixed(2)} · Total:
              ${totals.total.toFixed(2)}
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
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
