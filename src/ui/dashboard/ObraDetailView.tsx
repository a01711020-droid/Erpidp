import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Button } from "../../app/components/ui/button";
import type { MetricasObra, Obra } from "../../core/types/entities";

interface ObraDetailViewProps {
  obra: Obra;
  metricas: MetricasObra | null;
  loading: boolean;
  error: string | null;
}

export function ObraDetailView({ obra, metricas, loading, error }: ObraDetailViewProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando obra...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
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
            <strong>Residente:</strong> {obra.residente} ({obra.residenteIniciales || "N/A"})
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to={`/dashboard/obras/${obra.id}/desglose`}>Ver desglose semanal</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Comprometido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${Number(metricas?.comprometido || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${Number(metricas?.pagado || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${Number(metricas?.saldo || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {Number(metricas?.porcentajeEjecutado || 0).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KPIs adicionales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <p>
            <strong>Estimaciones:</strong> ${Number(metricas?.totalEstimaciones || 0).toFixed(2)}
          </p>
          <p>
            <strong>Gastos:</strong> ${Number(metricas?.totalGastos || 0).toFixed(2)}
          </p>
          <p>
            <strong>Saldo actual:</strong> ${Number(metricas?.saldoActual || 0).toFixed(2)}
          </p>
          <p>
            <strong>Avance físico:</strong>{" "}
            {Number(metricas?.avanceFisicoPorcentaje || 0).toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
