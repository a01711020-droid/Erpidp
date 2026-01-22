import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { dataProvider } from "../providers";
import type { Obra, Pago } from "../types/entities";

export default function PagosObraPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const [obra, setObra] = useState<Obra | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;
    const fetchData = async () => {
      setError(null);
      try {
        const [obraResponse, pagosResponse] = await Promise.all([
          dataProvider.getObra(obraId),
          dataProvider.listPagos({ pageSize: 500, filters: { obraId } }),
        ]);
        setObra(obraResponse);
        setPagos(pagosResponse.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchData();
  }, [obraId]);

  const totalPagado = useMemo(
    () => pagos.reduce((acc, pago) => acc + Number(pago.monto || 0), 0),
    [pagos]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pagos por obra</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/pagos">Volver a pagos</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{obra?.nombre || "Obra"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Total pagado: ${totalPagado.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {pagos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay pagos registrados para esta obra.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Método</th>
                    <th className="py-2">Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-t">
                      <td className="py-2">{pago.fechaProgramada}</td>
                      <td className="py-2">${Number(pago.monto).toFixed(2)}</td>
                      <td className="py-2 capitalize">{pago.metodoPago}</td>
                      <td className="py-2">{pago.referencia || "-"}</td>
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
