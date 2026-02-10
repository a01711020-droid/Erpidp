/**
 * GLOBAL DASHBOARD - Con estados (loading, empty, error, data)
 * Sistema consolidado con estado real
 */

import { ViewState } from "@/ui/states";
import {
  DashboardStateLoading,
  DashboardStateError,
  DashboardStateEmpty,
  DashboardStateData,
} from "@/ui/global-dashboard";
import { useObras } from "@/core/hooks/useEntities";

interface GlobalDashboardProps {
  onSelectProject?: (projectId: string) => void;
}

export default function GlobalDashboard({
  onSelectProject,
}: GlobalDashboardProps) {
  const obrasQuery = useObras();
  const viewState: ViewState = obrasQuery.loading
    ? "loading"
    : obrasQuery.error
    ? "error"
    : obrasQuery.data.length === 0
    ? "empty"
    : "data";

  // Handlers (placeholders sin lógica real)
  const handleCreateWork = () => {
    console.log("Crear nueva obra");
    // En producción: abrir modal/formulario
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    obrasQuery.refetch();
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <DashboardStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <DashboardStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return <DashboardStateEmpty onCreateWork={handleCreateWork} />;
  }

  // ESTADO: DATA
  const worksData = obrasQuery.data.map((obra) => ({
    id: obra.id,
    code: obra.codigo,
    name: obra.nombre,
    client: obra.cliente,
    resident: obra.residente,
    contractAmount: obra.montoContratado,
    actualBalance: obra.montoContratado,
    totalEstimates: 0,
    totalExpenses: 0,
    status: obra.estado,
  }));

  return (
    <DashboardStateData
      works={worksData}
      onSelectProject={onSelectProject}
      onCreateWork={handleCreateWork}
    />
  );
}
