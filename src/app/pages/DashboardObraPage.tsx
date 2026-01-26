import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dataProvider } from "../providers";
import type { Obra } from "../types/entities";
import { useMetricasObra } from "../../core/hooks";
import { ObraDetailView } from "../../ui/dashboard/ObraDetailView";

export default function DashboardObraPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const [obra, setObra] = useState<Obra | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: metricas, loading: metricasLoading, error: metricasError } = useMetricasObra(obraId);

  useEffect(() => {
    if (!obraId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const obraResponse = await dataProvider.getObra(obraId);
        setObra(obraResponse);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [obraId]);

  if (!obra) {
    return <p className="text-sm text-muted-foreground">Obra no encontrada.</p>;
  }

  return (
    <ObraDetailView
      obra={obra}
      metricas={metricas}
      loading={loading || metricasLoading}
      error={error || metricasError}
    />
  );
}
