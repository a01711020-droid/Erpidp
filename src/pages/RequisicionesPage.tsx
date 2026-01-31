import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import ErrorState from "@/ui/common/ErrorState";
import LoadingState from "@/ui/common/LoadingState";
import EmptyState from "@/ui/common/EmptyState";
import { useRequisiciones } from "@/core/hooks/useRequisiciones";

export default function RequisicionesPage() {
  const { requisiciones, isLoading, error, refetch } = useRequisiciones();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ErrorState
          title="No se pudieron cargar las requisiciones"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <LoadingState title="Cargando requisiciones" />
      </div>
    );
  }

  if (requisiciones.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <EmptyState
          title="Sin requisiciones"
          description="Crea una requisición para iniciar el flujo de compras."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Requisiciones</h1>
        <p className="text-slate-500">{requisiciones.length} requisiciones registradas</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requisiciones.map((req) => (
          <Card key={req.requisicion_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{req.numero_requisicion}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {req.estatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Obra</span>
                <span className="font-medium text-slate-700">{req.obra_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Residente</span>
                <span className="font-medium text-slate-700">{req.residente_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha</span>
                <span className="font-medium text-slate-700">{req.fecha_creacion}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
