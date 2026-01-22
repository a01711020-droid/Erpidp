import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { endOfISOWeek, format, parseISO, startOfISOWeek } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { dataProvider } from "../providers";
import type { Pago } from "../types/entities";

interface WeeklyPago {
  weekStart: string;
  weekEnd: string;
  total: number;
}

export default function DashboardObraDesglosePage() {
  const { obraId } = useParams<{ obraId: string }>();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;
    const fetchPagos = async () => {
      setError(null);
      try {
        const response = await dataProvider.listPagos({ pageSize: 500, filters: { obraId } });
        setPagos(response.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchPagos();
  }, [obraId]);

  const weekly = useMemo(() => {
    const map = new Map<string, WeeklyPago>();
    pagos.forEach((pago) => {
      const date = parseISO(pago.fechaProgramada);
      const weekStart = startOfISOWeek(date);
      const weekEnd = endOfISOWeek(date);
      const key = format(weekStart, "yyyy-MM-dd");
      const existing = map.get(key) || {
        weekStart: format(weekStart, "yyyy-MM-dd"),
        weekEnd: format(weekEnd, "yyyy-MM-dd"),
        total: 0,
      };
      existing.total += Number(pago.monto || 0);
      map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }, [pagos]);

  const acumulado = useMemo(() => {
    let running = 0;
    return weekly.map((week) => {
      running += week.total;
      return { ...week, acumulado: running };
    });
  }, [weekly]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Desglose semanal de pagos</h2>
        <Button asChild variant="outline" size="sm">
          <Link to={`/dashboard/obras/${obraId}`}>Volver a obra</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Pagos por semana ISO</CardTitle>
        </CardHeader>
        <CardContent>
          {weekly.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay pagos registrados aún para esta obra.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Semana</th>
                    <th className="py-2">Total pagado</th>
                    <th className="py-2">Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {acumulado.map((week) => (
                    <tr key={week.weekStart} className="border-t">
                      <td className="py-2">
                        {week.weekStart} → {week.weekEnd}
                      </td>
                      <td className="py-2">${week.total.toFixed(2)}</td>
                      <td className="py-2">${week.acumulado.toFixed(2)}</td>
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
