import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { Button } from "../../ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/primitives/card";
import { useMetricasObra, useObra } from "../../core/hooks";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);

export default function DashboardObraPage() {
  const { obraId } = useParams();
  const navigate = useNavigate();
  const { data: obra, loading: obraLoading, error: obraError } = useObra(obraId);
  const { data: metricas, loading, error } = useMetricasObra(obraId);

  if (obraLoading || loading) {
    return <p className="text-sm text-muted-foreground">Cargando métricas...</p>;
  }

  if (obraError || error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{obraError || error}</AlertDescription>
      </Alert>
    );
  }

  if (!obra || !metricas) {
    return (
      <Alert>
        <AlertTitle>Obra no encontrada</AlertTitle>
        <AlertDescription>No se encontró la obra solicitada.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{obra.nombre}</h2>
          <p className="text-sm text-muted-foreground">{obra.cliente}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Volver al Dashboard</Button>
          <Button onClick={() => navigate(`/dashboard/obras/${obra.id}/desglose`)}>
            Ver Desglose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Comprometido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(metricas.comprometido)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(metricas.pagado)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(metricas.saldo)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores adicionales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Monto contratado</p>
            <p className="text-lg font-semibold">{formatCurrency(obra.montoContratado)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Porcentaje ejecutado</p>
            <p className="text-lg font-semibold">{metricas.porcentajeEjecutado.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total gastos</p>
            <p className="text-lg font-semibold">{formatCurrency(metricas.totalGastos)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo actual</p>
            <p className="text-lg font-semibold">{formatCurrency(metricas.saldoActual)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
