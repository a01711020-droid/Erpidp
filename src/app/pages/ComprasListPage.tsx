import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { dataProvider } from "../providers";
import type { Obra, OrdenCompra, Proveedor } from "../types/entities";

export default function ComprasListPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obraFilter, setObraFilter] = useState("");
  const [proveedorFilter, setProveedorFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordenesResponse, obrasResponse, proveedoresResponse] = await Promise.all([
          dataProvider.listOrdenesCompra({ pageSize: 200 }),
          dataProvider.listObras({ pageSize: 200 }),
          dataProvider.listProveedores({ pageSize: 200 }),
        ]);
        setOrdenes(ordenesResponse.data);
        setObras(obrasResponse.data);
        setProveedores(proveedoresResponse.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const obraMap = useMemo(
    () => new Map(obras.map((obra) => [obra.id, obra])),
    [obras]
  );
  const proveedorMap = useMemo(
    () => new Map(proveedores.map((prov) => [prov.id, prov])),
    [proveedores]
  );

  const filtered = ordenes.filter((orden) => {
    if (obraFilter && orden.obraId !== obraFilter) return false;
    if (proveedorFilter && orden.proveedorId !== proveedorFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Órdenes de compra</h2>
        <Button asChild>
          <Link to="/compras/nueva">Crear OC</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="obraFilter">
              Obra
            </label>
            <select
              id="obraFilter"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={obraFilter}
              onChange={(e) => setObraFilter(e.target.value)}
            >
              <option value="">Todas</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.codigo} - {obra.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="proveedorFilter">
              Proveedor
            </label>
            <select
              id="proveedorFilter"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={proveedorFilter}
              onChange={(e) => setProveedorFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.razonSocial}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando órdenes...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay órdenes de compra registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Folio</th>
                    <th className="py-2">Obra</th>
                    <th className="py-2">Proveedor</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((orden) => (
                    <tr key={orden.id} className="border-t">
                      <td className="py-2">{orden.numeroOrden}</td>
                      <td className="py-2">
                        {obraMap.get(orden.obraId)?.nombre || orden.obraId}
                      </td>
                      <td className="py-2">
                        {proveedorMap.get(orden.proveedorId)?.razonSocial ||
                          orden.proveedorId}
                      </td>
                      <td className="py-2">${Number(orden.total).toFixed(2)}</td>
                      <td className="py-2 capitalize">{orden.estado}</td>
                      <td className="py-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/compras/${orden.id}`}>Ver</Link>
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
