import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import ErrorState from "@/ui/common/ErrorState";
import LoadingState from "@/ui/common/LoadingState";
import EmptyState from "@/ui/common/EmptyState";
import { usePagos } from "@/core/hooks/usePagos";

export default function PagosPage() {
  const { pagos, isLoading, error, refetch } = usePagos();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ErrorState
          title="No se pudieron cargar los pagos"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <LoadingState title="Cargando pagos" />
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <EmptyState
          title="Sin pagos registrados"
          description="Cuando registres pagos en el sistema, aparecerán aquí."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pagos</h1>
        <p className="text-slate-500">{pagos.length} pagos registrados</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pagos.map((pago) => (
          <Card key={pago.pago_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pago.numero_pago}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {pago.estatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Obra</span>
                <span className="font-medium text-slate-700">{pago.obra_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Proveedor</span>
                <span className="font-medium text-slate-700">{pago.proveedor_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha</span>
                <span className="font-medium text-slate-700">{pago.fecha_pago}</span>
              </div>
              <div className="flex justify-between">
                <span>Monto</span>
                <span className="font-semibold text-slate-800">${pago.monto_pagado.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
