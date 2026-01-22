import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { dataProvider } from "../providers";
import type { OrdenCompra, Pago } from "../types/entities";

export default function PagosListPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [selectedOrdenId, setSelectedOrdenId] = useState("");
  const [monto, setMonto] = useState(0);
  const [fecha, setFecha] = useState("");
  const [referencia, setReferencia] = useState("");
  const [metodoPago, setMetodoPago] = useState<Pago["metodoPago"]>("transferencia");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setError(null);
    const [ordenesResponse, pagosResponse] = await Promise.all([
      dataProvider.listOrdenesCompra({ pageSize: 200 }),
      dataProvider.listPagos({ pageSize: 500 }),
    ]);
    setOrdenes(ordenesResponse.data);
    setPagos(pagosResponse.data);
  };

  useEffect(() => {
    fetchData().catch((err) => setError((err as Error).message));
  }, []);

  const pagosPorOrden = useMemo(() => {
    const map = new Map<string, number>();
    pagos.forEach((pago) => {
      map.set(pago.ordenCompraId, (map.get(pago.ordenCompraId) || 0) + Number(pago.monto || 0));
    });
    return map;
  }, [pagos]);

  const resumen = useMemo(
    () =>
      ordenes.map((orden) => {
        const pagado = pagosPorOrden.get(orden.id) || 0;
        const saldo = Number(orden.total || 0) - pagado;
        return { orden, pagado, saldo };
      }),
    [ordenes, pagosPorOrden]
  );

  const selectedOrden = ordenes.find((orden) => orden.id === selectedOrdenId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrden || !fecha || monto <= 0) return;
    setSaving(true);
    setError(null);
    try {
      await dataProvider.createPago({
        obraId: selectedOrden.obraId,
        proveedorId: selectedOrden.proveedorId,
        ordenCompraId: selectedOrden.id,
        monto,
        metodoPago: metodoPago || "transferencia",
        fechaProgramada: fecha,
        referencia: referencia || null,
        observaciones: "Pago registrado desde módulo de pagos",
      });
      setSelectedOrdenId("");
      setMonto(0);
      setFecha("");
      setReferencia("");
      await fetchData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

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
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ordenCompraId">Orden de compra</Label>
              <select
                id="ordenCompraId"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={selectedOrdenId}
                onChange={(e) => setSelectedOrdenId(e.target.value)}
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
                onChange={(e) => setMonto(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha pago</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metodo">Método de pago</Label>
              <select
                id="metodo"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={metodoPago || "transferencia"}
                onChange={(e) => setMetodoPago(e.target.value as Pago["metodoPago"])}
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
                onChange={(e) => setReferencia(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={!selectedOrden || !fecha || monto <= 0 || saving}>
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
          {resumen.length === 0 ? (
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
