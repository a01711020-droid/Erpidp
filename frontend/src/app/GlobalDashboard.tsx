/**
 * GLOBAL DASHBOARD - Con estados (loading, empty, error, data)
 * Sistema consolidado con estado real
 */

import { useState } from "react";
import { ViewState } from "@/app/components/states";
import {
  DashboardStateLoading,
  DashboardStateError,
  DashboardStateEmpty,
  DashboardStateData,
} from "@/app/components/global-dashboard";

interface GlobalDashboardProps {
  onSelectProject?: (projectId: string) => void;
  initialState?: ViewState;
}

export default function GlobalDashboard({
  onSelectProject,
  initialState = "data",
}: GlobalDashboardProps) {
  const [viewState, setViewState] = useState<ViewState>(initialState);

  // Handlers (placeholders sin lógica real)
  const handleCreateWork = () => {
    console.log("Crear nueva obra");
    // En producción: abrir modal/formulario
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    // Simular carga
    setViewState("data");
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
  return (
    <DashboardStateData
      onSelectProject={onSelectProject}
      onCreateWork={handleCreateWork}
    />
  );
}