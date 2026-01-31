import DashboardEmpresarialView from "@/ui/dashboard/DashboardEmpresarialView";
import ErrorState from "@/ui/common/ErrorState";
import LoadingState from "@/ui/common/LoadingState";
import { useObras } from "@/core/hooks/useObras";

export default function ObrasPage() {
  const { obras, isLoading, error, refetch } = useObras();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ErrorState
          title="No se pudieron cargar las obras"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <LoadingState title="Cargando obras" />
      </div>
    );
  }

  const metricas = obras.map((obra) => {
    const estado = obra.estatus === "pausada" ? "suspendida" : obra.estatus;
    return {
      obra_id: obra.obra_id,
      codigo_obra: obra.codigo_obra,
      nombre_obra: obra.nombre_obra,
      cliente: obra.cliente,
      residente: obra.residente ?? "",
      estado,
      monto_contratado: obra.presupuesto_total,
      monto_comprometido: 0,
      monto_pagado: 0,
      saldo_disponible: obra.presupuesto_total,
      porcentaje_ejercido: 0,
      avance_fisico_porcentaje: 0,
      estado_financiero: "saludable" as const,
      total_estimaciones: 0,
      dias_transcurridos: 0,
      dias_restantes: 0,
      porcentaje_tiempo_transcurrido: 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <DashboardEmpresarialView obras={metricas} />
    </div>
  );
}
