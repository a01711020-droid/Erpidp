import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import type { OrdenCompra, Pago } from "../../core/types/entities";

interface PagosListViewProps {
  ordenes: OrdenCompra[];
  resumen: { orden: OrdenCompra; pagado: number; saldo: number }[];
  loading: boolean;
  selectedOrdenId: string;
  monto: number;
  fecha: string;
  referencia: string;
  metodoPago: Pago["metodoPago"];
  folioFactura: string;
  montoFactura: number;
  fechaFactura: string;
  diasCredito: number;
  error: string | null;
  saving: boolean;
  onChange: (field: string, value: string | number) => void;
  onSubmit: (event: FormEvent) => void;
}

export function PagosListView({
  ordenes,
  resumen,
  loading,
  selectedOrdenId,
  monto,
  fecha,
  referencia,
  metodoPago,
  folioFactura,
  montoFactura,
  fechaFactura,
  diasCredito,
  error,
  saving,
  onChange,
  onSubmit,
}: PagosListViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Pagos por OC</h2>
        <Button asChild variant="outline">
          <Link to="/pagos/conciliacion">Conciliación CSV</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar pago manual</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ordenCompraId">Orden de compra</Label>
              <select
                id="ordenCompraId"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={selectedOrdenId}
                onChange={(e) => onChange("selectedOrdenId", e.target.value)}
              >
                <option value="">Selecciona OC</option>
                {ordenes.map((orden) => (
                  <option key={orden.id} value={orden.id}>
                    {orden.numeroOrden} · Total ${Number(orden.total).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                min="0"
                step="0.01"
                value={monto}
                onChange={(e) => onChange("monto", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha pago</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => onChange("fecha", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metodo">Método de pago</Label>
              <select
                id="metodo"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={metodoPago || "transferencia"}
                onChange={(e) => onChange("metodoPago", e.target.value)}
              >
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referencia">Referencia bancaria</Label>
              <Input
                id="referencia"
                value={referencia}
                onChange={(e) => onChange("referencia", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folioFactura">Folio factura</Label>
              <Input
                id="folioFactura"
                value={folioFactura}
                onChange={(e) => onChange("folioFactura", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montoFactura">Monto factura</Label>
              <Input
                id="montoFactura"
                type="number"
                min="0"
                step="0.01"
                value={montoFactura}
                onChange={(e) => onChange("montoFactura", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFactura">Fecha factura</Label>
              <Input
                id="fechaFactura"
                type="date"
                value={fechaFactura}
                onChange={(e) => onChange("fechaFactura", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diasCredito">Días crédito</Label>
              <Input
                id="diasCredito"
                type="number"
                min="0"
                value={diasCredito}
                onChange={(e) => onChange("diasCredito", Number(e.target.value))}
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={!selectedOrdenId || !fecha || monto <= 0 || saving}>
                {saving ? "Registrando..." : "Registrar pago"}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saldo pendiente por OC</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando pagos...</p>
          ) : resumen.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay órdenes registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">OC</th>
                    <th className="py-2">Pagado</th>
                    <th className="py-2">Saldo</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map(({ orden, pagado, saldo }) => (
                    <tr key={orden.id} className="border-t">
                      <td className="py-2">{orden.numeroOrden}</td>
                      <td className="py-2">${pagado.toFixed(2)}</td>
                      <td className="py-2">${saldo.toFixed(2)}</td>
                      <td className="py-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/pagos/obra/${orden.obraId}`}>Ver obra</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
