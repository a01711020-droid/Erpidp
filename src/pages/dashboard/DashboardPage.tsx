import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { ProjectCard } from "../../ui/dashboard/ProjectCard";
import { useObrasList } from "../../core/hooks";

const statusMap: Record<string, "En proceso" | "Retrasado" | "En tiempo" | "Finalizado"> = {
  activa: "En proceso",
  suspendida: "Retrasado",
  terminada: "Finalizado",
  cancelada: "Retrasado",
};

export default function DashboardPage() {
  const { data: obras, loading, error } = useObrasList();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Global</h2>
        <p className="text-sm text-muted-foreground">
          Resumen general de obras con datos reales desde Supabase.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-sm text-muted-foreground">Cargando obras...</p>}

      {!loading && obras.length === 0 && (
        <Alert>
          <AlertTitle>Sin obras registradas</AlertTitle>
          <AlertDescription>
            Aún no hay obras cargadas. Crea una obra en Catálogos para verla aquí.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {obras.map((obra) => {
          const amountPaid = obra.totalGastos || 0;
          const pendingAmount = obra.montoContratado - amountPaid;
          return (
            <ProjectCard
              key={obra.id}
              project={{
                id: obra.id,
                name: obra.nombre,
                contractNumber: obra.numeroContrato,
                client: obra.cliente,
                status: statusMap[obra.estado] || "En proceso",
                progress: obra.avanceFisicoPorcentaje || 0,
                contractAmount: obra.montoContratado,
                amountPaid,
                startDate: obra.fechaInicio,
                endDate: obra.fechaFinProgramada,
                currentEstimation: 0,
                totalEstimations: 0,
                pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
              }}
              onViewDetails={(projectId) => navigate(`/dashboard/obras/${projectId}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
