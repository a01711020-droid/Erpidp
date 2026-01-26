import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useObra, useOrdenesCompra } from "../../core/hooks";

export default function ComprasObraPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const { data: obra, error: obraError } = useObra(obraId);
  const {
    data: ordenes,
    error: ordenesError,
    loading,
  } = useOrdenesCompra(obraId ? { pageSize: 200, filters: { obraId } } : undefined);

  const error = useMemo(
    () => obraError || ordenesError,
    [obraError, ordenesError]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compras por obra</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/compras">Volver al listado</Link>
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando órdenes...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{obra?.nombre || "Obra"}</CardTitle>
        </CardHeader>
        <CardContent>
          {ordenes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay órdenes de compra para esta obra.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Folio</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.id} className="border-t">
                      <td className="py-2">{orden.numeroOrden}</td>
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
