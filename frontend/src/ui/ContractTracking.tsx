import { useMemo, useState } from "react";
import { ContractHeader } from "./components/ContractHeader";
import { EstimationsTable } from "./components/EstimationsTable";
import { WeeklyExpenses } from "./components/WeeklyExpenses";
import { WeeklyExpensesDetail } from "./components/WeeklyExpensesDetail";
import { EstimationForm, EstimationFormData } from "./components/EstimationForm";
import { AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Obra, OrdenCompra, Pago } from "../core/api/types";

interface ContractTrackingProps {
  projectId: string | null;
  obras: Obra[];
  ordenesCompra: OrdenCompra[];
  pagos: Pago[];
  isLoading: boolean;
  error: string | null;
  onViewExpenseDetails?: () => void;
  onBackToDashboard?: () => void;
}

export default function ContractTracking({
  projectId,
  obras,
  ordenesCompra,
  pagos,
  isLoading,
  error,
  onViewExpenseDetails,
  onBackToDashboard,
}: ContractTrackingProps) {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);

  const obra = useMemo(
    () => obras.find((item) => item.codigo === projectId),
    [obras, projectId]
  );

  const contractInfo = obra
    ? {
        contractNumber: obra.numero_contrato,
        contractAmount: obra.monto_contrato,
        client: obra.cliente,
        projectName: obra.nombre,
        startDate: obra.fecha_inicio,
        endDate: obra.fecha_fin_estimada,
        advancePercentage: obra.anticipo_porcentaje,
        guaranteeFundPercentage: obra.retencion_porcentaje,
      }
    : null;

  const estimations: Array<any> = [];

  const expenses = useMemo(() => {
    const ordersByMonth: Record<string, number> = {};
    ordenesCompra
      .filter((order) => order.obra_codigo === projectId)
      .forEach((order) => {
        const period = order.fecha_creacion.slice(0, 7);
        ordersByMonth[period] = (ordersByMonth[period] || 0) + order.total;
      });

    return Object.entries(ordersByMonth).map(([period, total]) => ({
      week: period,
      purchaseOrders: total,
      payroll: 0,
      total,
      indirectCost: 0,
    }));
  }, [ordenesCompra, projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando contrato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!obra || !contractInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-gray-600">Selecciona una obra para ver detalles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Contratos</h1>
            <p className="text-gray-600">Obra seleccionada: {obra.nombre}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onBackToDashboard?.()}
            >
              Volver al Dashboard
            </Button>
            <Button
              onClick={() => setShowEstimationForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Estimación
            </Button>
          </div>
        </div>

        <ContractHeader contract={contractInfo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EstimationsTable estimations={estimations} />
          </div>
          <div className="space-y-6">
            <WeeklyExpenses
              expenses={expenses}
              onViewDetail={onViewExpenseDetails}
            />
          </div>
        </div>

        {showDetailView && <WeeklyExpensesDetail />}

        {showEstimationForm && (
          <EstimationForm
            onClose={() => setShowEstimationForm(false)}
            onSave={(data: EstimationFormData) => {
              setShowEstimationForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
