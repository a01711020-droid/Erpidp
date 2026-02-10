import { ContractHeader } from "./components/ContractHeader";
import { EstimationsTable } from "./components/EstimationsTable";
import { WeeklyExpenses } from "./components/WeeklyExpenses";
import { WeeklyExpensesDetail } from "./components/WeeklyExpensesDetail";
import { EstimationForm, EstimationFormData } from "./components/EstimationForm";
import { ViewState } from "@/app/components/states";
import {
  ContractTrackingStateLoading,
  ContractTrackingStateError,
  ContractTrackingStateEmpty,
} from "@/app/components/contract-tracking";
import { HardHat, AlertCircle, TrendingUp, Plus, FileText, BarChart3, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useObras, usePagos } from "@/core/hooks/useEntities";

interface ContractTrackingProps {
  projectId: string | null;
  initialState?: ViewState;
}

export default function ContractTracking({ projectId, initialState = "data" }: ContractTrackingProps) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);
  const obrasQuery = useObras();
  const pagosQuery = usePagos();

  const selectedObra = useMemo(
    () => obrasQuery.data.find((obra) => obra.id === projectId),
    [obrasQuery.data, projectId]
  );

  const contractInfoData = useMemo(
    () =>
      selectedObra
        ? {
            contractNumber: selectedObra.numeroContrato,
            contractAmount: selectedObra.montoContratado,
            client: selectedObra.cliente,
            projectName: selectedObra.nombre,
            startDate: selectedObra.fechaInicio,
            endDate: selectedObra.fechaFinProgramada,
            advancePercentage: 0,
            guaranteeFundPercentage: 0,
          }
        : {
            contractNumber: "",
            contractAmount: 0,
            client: "",
            projectName: "",
            startDate: "",
            endDate: "",
            advancePercentage: 0,
            guaranteeFundPercentage: 0,
          },
    [selectedObra]
  );

  const weeklyExpensesData = useMemo(() => {
    if (!projectId) {
      return [];
    }
    const obraPagos = pagosQuery.data.filter(
      (pago) => pago.obraId === projectId
    );
    const grouped = obraPagos.reduce<Record<string, number>>((acc, pago) => {
      const dateValue = pago.fechaPago ?? pago.fechaProgramada;
      if (!dateValue) {
        return acc;
      }
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) {
        return acc;
      }
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(date);
      weekStart.setDate(diff);
      const key = weekStart.toISOString().slice(0, 10);
      acc[key] = (acc[key] ?? 0) + Number(pago.monto);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([weekStart, total]) => ({
        week: `Semana del ${new Date(weekStart).toLocaleDateString("es-MX")}`,
        total,
        direct: total,
        indirect: 0,
      }))
      .sort((a, b) => (a.week > b.week ? 1 : -1));
  }, [pagosQuery.data, projectId]);

  useEffect(() => {
    if (obrasQuery.loading || pagosQuery.loading) {
      setViewState("loading");
      return;
    }
    if (obrasQuery.error || pagosQuery.error) {
      setViewState("error");
      return;
    }
    if (!projectId || !selectedObra) {
      setViewState("empty");
      return;
    }
    setViewState("data");
  }, [
    obrasQuery.loading,
    obrasQuery.error,
    pagosQuery.loading,
    pagosQuery.error,
    projectId,
    selectedObra,
  ]);
  
  // ====================================================================
  // Datos de movimientos del contrato
  // ====================================================================
  // IMPORTANTE: En producción, estos cálculos se deben hacer así:
  // 
  // 1. ANTICIPO INICIAL:
  //    advanceBalance inicial = contractAmount * (advancePercentage / 100)
  //    contractPending inicial = contractAmount
  //    contractAmountCurrent = contractAmount (se actualiza con aditivas/deductivas)
  // 
  // 2. ESTIMACIONES:
  //    - NUEVA FÓRMULA DE AMORTIZACIÓN PROPORCIONAL:
  //      advanceAmortization = (Monto estimación / Contrato vigente actual) × Anticipo total
  //      advanceAmortization = MIN(calculado, advanceBalance disponible)
  //    
  //    - guaranteeFund = MIN(importe × guaranteeFundPercentage/100, CAP_TOTAL - acumulado)
  //    - guaranteeFundCAP = contractAmount × guaranteeFundPercentage/100 ($30,000 para $1M al 3%)
  //    - Neto = importe - advanceAmortization - guaranteeFund
  //    - balanceToPay = Neto - paid
  //    - advanceBalance = advanceBalance anterior - advanceAmortization
  //    - contractPending = contractPending anterior - importe
  //    - contractAmountCurrent NO cambia (solo cambia con aditivas/deductivas)
  // 
  // 3. ADITIVAS:
  //    - NO tienen advanceAmortization ni guaranteeFund
  //    - contractPending = contractPending anterior + importe (SUMA)
  //    - contractAmountCurrent = contractAmountCurrent anterior + importe (ACTUALIZA BASE)
  //    - advanceBalance se mantiene igual
  // 
  // 4. DEDUCTIVAS:
  //    - NO tienen advanceAmortization ni guaranteeFund
  //    - contractPending = contractPending anterior - |importe| (RESTA)
  //    - contractAmountCurrent = contractAmountCurrent anterior - |importe| (ACTUALIZA BASE)
  //    - advanceBalance se mantiene igual
  // ====================================================================
  const [contractMovements, setContractMovements] = useState([]);
  
  // Datos del contrato
  const contractInfo = contractInfoData;

  // Datos de salidas semanales
  const weeklyExpenses = weeklyExpensesData;

  // CÁLCULO DE GASTOS INDIRECTOS PROPORCIONALES
  // Gastos totales de esta obra
  const thisWorkExpenses = weeklyExpenses.reduce((sum, week) => sum + week.total, 0);
  
  const totalAllWorksExpenses = thisWorkExpenses;
  const indirectCostsTotal = 0;
  
  // Calcular proporción y indirectos asignados a esta obra
  const proportion = totalAllWorksExpenses > 0 ? (thisWorkExpenses / totalAllWorksExpenses) * 100 : 0;
  const indirectCostAssigned = totalAllWorksExpenses > 0 ? (thisWorkExpenses / totalAllWorksExpenses) * indirectCostsTotal : 0;
  const totalWithIndirect = thisWorkExpenses + indirectCostAssigned;

  // Agregar costos indirectos semanales proporcionalmente
  const weeklyExpensesWithIndirect = weeklyExpenses.map(week => {
    const weekProportion = thisWorkExpenses > 0 ? week.total / thisWorkExpenses : 0;
    const weekIndirectCost = weekProportion * indirectCostAssigned;
    return {
      ...week,
      indirectCost: weekIndirectCost,
    };
  });

  const handleSaveEstimation = (data: EstimationFormData) => {
    if (contractMovements.length === 0) {
      return;
    }
    const lastMovement = contractMovements[contractMovements.length - 1];
    
    // Calcular los valores según el tipo de movimiento
    let newAdvanceBalance = lastMovement.advanceBalance;
    let newContractPending = lastMovement.contractPending;
    let newContractAmountCurrent = lastMovement.contractAmountCurrent || contractInfo.contractAmount;
    
    if (data.type === "aditiva") {
      // Aditiva: SUMA al pendiente, NO afecta anticipo
      newContractPending = lastMovement.contractPending + data.amount;
      newContractAmountCurrent = lastMovement.contractAmountCurrent + data.amount;
    } else if (data.type === "deductiva") {
      // Deductiva: RESTA del pendiente, NO afecta anticipo
      newContractPending = lastMovement.contractPending - Math.abs(data.amount);
      newContractAmountCurrent = lastMovement.contractAmountCurrent - Math.abs(data.amount);
    } else {
      // Estimación: RESTA del pendiente, amortiza anticipo
      newContractPending = lastMovement.contractPending - data.amount;
      newAdvanceBalance = lastMovement.advanceBalance - data.advanceAmortization;
    }
    
    // Crear nuevo movimiento
    const newMovement = {
      no: data.movementNumber,
      type: data.type,
      date: data.date,
      description: data.description,
      amount: data.amount,
      advanceAmortization: data.advanceAmortization,
      guaranteeFund: data.guaranteeFund,
      advanceBalance: newAdvanceBalance,
      paid: 0, // Siempre inicia en 0, se edita después desde la tabla
      balanceToPay: data.balanceToPay,
      contractPending: newContractPending,
      contractAmountCurrent: newContractAmountCurrent,
    };
    
    // Agregar a la lista de movimientos
    setContractMovements([...contractMovements, newMovement]);
    
    console.log("✅ Nuevo movimiento agregado:", newMovement);
  };

  // Handlers placeholder
  const handleCreateContract = () => {
    console.log("Crear nuevo contrato");
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    obrasQuery.refetch();
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <ContractTrackingStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <ContractTrackingStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return <ContractTrackingStateEmpty />;
  }

  // ESTADO: DATA (contenido completo original)
  return (
    <div className="min-h-screen bg-background">
      {showDetailView ? (
        <WeeklyExpensesDetail 
          expenses={weeklyExpensesWithIndirect} 
          onBack={() => setShowDetailView(false)}
        />
      ) : (
        <>
          {/* Main Content */}
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <HardHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Seguimiento Físico de Contrato</h2>
                  <p className="text-sm text-gray-500">Control de obra y flujo financiero</p>
                </div>
              </div>

              {/* Add Movement Button - Ahora ARRIBA del ContractHeader */}
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setShowEstimationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Movimiento
              </Button>

              {/* Contract Information */}
              <ContractHeader contract={contractInfo} />

              {/* Contract Movements Table (antes Estimations) */}
              <EstimationsTable estimations={contractMovements} />

              {/* Weekly Expenses */}
              <WeeklyExpenses 
                expenses={weeklyExpensesWithIndirect} 
                onViewDetail={() => setShowDetailView(true)}
              />

              {/* Indirect Costs Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Gastos Indirectos Asignados a Esta Obra</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Distribución proporcional del indirecto empresarial según el gasto de esta obra
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Gastos Directos de esta obra */}
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xs text-muted-foreground mb-1">Gastos Directos (Obra)</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${thisWorkExpenses.toLocaleString()}
                      </p>
                    </div>

                    {/* Proporción */}
                    <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Proporción del Total</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-blue-900">
                          {proportion.toFixed(2)}%
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          de ${totalAllWorksExpenses.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    {/* Indirecto Asignado */}
                    <div className="p-4 bg-orange-100 rounded-lg shadow-sm border border-orange-300">
                      <p className="text-xs text-orange-700 mb-1">Indirecto Asignado</p>
                      <p className="text-2xl font-bold text-orange-900">
                        ${Math.round(indirectCostAssigned).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        de ${indirectCostsTotal.toLocaleString()} total
                      </p>
                    </div>

                    {/* Total con Indirecto */}
                    <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-sm border-2 border-orange-400">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-orange-700" />
                        <p className="text-xs text-orange-700 font-semibold">Total Real con Indirecto</p>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">
                        ${Math.round(totalWithIndirect).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Explicación del cálculo */}
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      ¿Cómo se calculan los gastos indirectos?
                    </h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>1.</strong> Se suman todos los gastos directos de todas las obras activas: <span className="font-mono">${totalAllWorksExpenses.toLocaleString()}</span>
                      </p>
                      <p>
                        <strong>2.</strong> Se calcula la proporción de esta obra: <span className="font-mono">${thisWorkExpenses.toLocaleString()} ÷ ${totalAllWorksExpenses.toLocaleString()} = {proportion.toFixed(2)}%</span>
                      </p>
                      <p>
                        <strong>3.</strong> Se aplica esa proporción al total de indirectos: <span className="font-mono">{proportion.toFixed(2)}% × ${indirectCostsTotal.toLocaleString()} = ${Math.round(indirectCostAssigned).toLocaleString()}</span>
                      </p>
                      <p className="mt-2 pt-2 border-t border-blue-300">
                        <strong>Nota:</strong> Los gastos indirectos incluyen renta de oficina, servicios generales, personal administrativo, 
                        seguros empresariales y otros gastos operativos que no se asignan directamente a una obra.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </>
      )}

      {/* Estimation Form Modal */}
      <EstimationForm
        isOpen={showEstimationForm}
        onClose={() => setShowEstimationForm(false)}
        onSave={handleSaveEstimation}
        contractInfo={contractInfo}
        lastEstimation={contractMovements[contractMovements.length - 1]}
      />
    </div>
  );
}
