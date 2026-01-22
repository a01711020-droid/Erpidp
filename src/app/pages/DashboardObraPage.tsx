import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { dataProvider } from "../providers";
import type { Obra, OrdenCompra, Pago } from "../types/entities";

export default function DashboardObraPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const [obra, setObra] = useState<Obra | null>(null);
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!obraId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [obraResponse, ordenesResponse, pagosResponse] = await Promise.all([
          dataProvider.getObra(obraId),
          dataProvider.listOrdenesCompra({ pageSize: 200, filters: { obraId } }),
          dataProvider.listPagos({ pageSize: 200, filters: { obraId } }),
        ]);
        setObra(obraResponse);
        setOrdenes(ordenesResponse.data);
        setPagos(pagosResponse.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [obraId]);

  const comprometido = useMemo(
    () => ordenes.reduce((acc, orden) => acc + Number(orden.total || 0), 0),
    [ordenes]
  );
  const pagado = useMemo(
    () => pagos.reduce((acc, pago) => acc + Number(pago.monto || 0), 0),
    [pagos]
  );
  const saldo = comprometido - pagado;

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando obra...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!obra) {
    return <p className="text-sm text-muted-foreground">Obra no encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalle de obra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Código:</strong> {obra.codigo}
          </p>
          <p>
            <strong>Nombre:</strong> {obra.nombre}
          </p>
          <p>
            <strong>Cliente:</strong> {obra.cliente}
          </p>
          <p>
            <strong>Estado:</strong> {obra.estado}
          </p>
          <p>
            <strong>Residente:</strong> {obra.residente}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to={`/dashboard/obras/${obra.id}/desglose`}>
              Ver desglose semanal
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Comprometido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${comprometido.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${pagado.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${saldo.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KPIs pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Estimaciones, aditivas y deductivas: pendiente de implementación.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
