import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import ErrorState from "@/ui/common/ErrorState";
import LoadingState from "@/ui/common/LoadingState";
import EmptyState from "@/ui/common/EmptyState";
import { useOrdenesCompra } from "@/core/hooks/useOrdenesCompra";

export default function OrdenesCompraPage() {
  const { ordenes, isLoading, error, refetch } = useOrdenesCompra();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ErrorState
          title="No se pudieron cargar las órdenes"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <LoadingState title="Cargando órdenes de compra" />
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <EmptyState
          title="Sin órdenes de compra"
          description="Crea tu primera orden de compra para comenzar el seguimiento de materiales."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Órdenes de compra</h1>
        <p className="text-slate-500">{ordenes.length} órdenes registradas</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ordenes.map((orden) => (
          <Card key={orden.oc_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{orden.numero_oc}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {orden.estatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Obra</span>
                <span className="font-medium text-slate-700">{orden.obra_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Proveedor</span>
                <span className="font-medium text-slate-700">{orden.proveedor_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha creación</span>
                <span className="font-medium text-slate-700">{orden.fecha_creacion}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold text-slate-800">${orden.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
