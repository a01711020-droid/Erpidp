// Página: Dashboards por Obra (vacío por defecto en Fase 1)
import { Building2 } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/app/components/states";
import { useObras } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";

export default function DashboardObras() {
  const { data, isLoading, error, refetch } = useObras();
  const viewState = resolveViewState(isLoading, error, data.length);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboards por Obra</h2>
        <p className="text-slate-600">Selecciona una obra para ver su dashboard individual</p>
      </div>

      {viewState === "loading" && <LoadingState type="cards" rows={6} />}

      {viewState === "error" && (
        <ErrorState
          title="No fue posible cargar obras"
          message={error ?? "Intenta nuevamente"}
          onRetry={refetch}
        />
      )}

      {(viewState === "empty" || viewState === "data") && (
        <EmptyState
          icon={Building2}
          title="Sin obras disponibles"
          description="Cuando existan obras en el sistema podrás consultar sus dashboards aquí."
        />
      )}
    </div>
  );
}
