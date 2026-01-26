import { ContractHeader } from "./components/ContractHeader";
import { EstimationsTable } from "./components/EstimationsTable";
import { WeeklyExpenses } from "./components/WeeklyExpenses";
import { WeeklyExpensesDetail } from "./components/WeeklyExpensesDetail";
import { EstimationForm, EstimationFormData } from "./components/EstimationForm";
import { HardHat, AlertCircle, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { useState } from "react";

interface ContractTrackingProps {
  projectId: string | null;
}

export default function ContractTracking({ projectId }: ContractTrackingProps) {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);
  
  // Datos del contrato
  const contractInfo = {
    contractNumber: "CONT-2025-078",
    contractAmount: 5800000,
    client: "Gobierno del Estado de México",
    projectName: "Construcción de Centro Educativo Nivel Secundaria",
    startDate: "15 Sep 2025",
    endDate: "15 Jun 2026",
    advancePercentage: 30,
    guaranteeFundPercentage: 10,
  };

  // Datos de movimientos del contrato (estimaciones, aditivas, deductivas)
  const contractMovements = [
    {
      no: 1,
      type: "estimacion" as const,
      date: "15 Oct 2025",
      description: "Estimación 1 - Trabajos preliminares y cimentación",
      amount: 580000,
      advanceAmortization: 174000,
      guaranteeFund: 58000,
      advanceBalance: 1566000,
      paid: 348000,
      balanceToPay: 0,
      contractPending: 5220000,
    },
    {
      no: 2,
      type: "estimacion" as const,
      date: "15 Nov 2025",
      description: "Estimación 2 - Estructura y muros",
      amount: 820000,
      advanceAmortization: 246000,
      guaranteeFund: 82000,
      advanceBalance: 1320000,
      paid: 492000,
      balanceToPay: 0,
      contractPending: 4400000,
    },
    {
      no: 3,
      type: "estimacion" as const,
      date: "15 Dic 2025",
      description: "Estimación 3 - Instalaciones hidráulicas y sanitarias",
      amount: 650000,
      advanceAmortization: 195000,
      guaranteeFund: 65000,
      advanceBalance: 1125000,
      paid: 390000,
      balanceToPay: 0,
      contractPending: 3750000,
    },
    {
      no: 4,
      type: "estimacion" as const,
      date: "15 Ene 2026",
      description: "Estimación 4 - Instalaciones eléctricas",
      amount: 720000,
      advanceAmortization: 216000,
      guaranteeFund: 72000,
      advanceBalance: 909000,
      paid: 432000,
      balanceToPay: 0,
      contractPending: 3030000,
    },
    {
      no: 5,
      type: "estimacion" as const,
      date: "09 Ene 2026",
      description: "Estimación 5 - Acabados generales (En proceso)",
      amount: 890000,
      advanceAmortization: 267000,
      guaranteeFund: 89000,
      advanceBalance: 642000,
      paid: 0,
      balanceToPay: 534000,
      contractPending: 2140000,
    },
  ];

  // Datos de salidas semanales
  const weeklyExpenses = [
    { week: "Semana 1", purchaseOrders: 125000, payroll: 85000, total: 210000 },
    { week: "Semana 2", purchaseOrders: 180000, payroll: 85000, total: 265000 },
    { week: "Semana 3", purchaseOrders: 95000, payroll: 85000, total: 180000 },
    { week: "Semana 4", purchaseOrders: 220000, payroll: 90000, total: 310000 },
    { week: "Semana 5", purchaseOrders: 145000, payroll: 90000, total: 235000 },
    { week: "Semana 6", purchaseOrders: 198000, payroll: 90000, total: 288000 },
    { week: "Semana 7", purchaseOrders: 175000, payroll: 95000, total: 270000 },
    { week: "Semana 8", purchaseOrders: 210000, payroll: 95000, total: 305000 },
  ];

  // CÁLCULO DE GASTOS INDIRECTOS PROPORCIONALES
  // Gastos totales de esta obra
  const thisWorkExpenses = weeklyExpenses.reduce((sum, week) => sum + week.total, 0);
  
  // Datos de ejemplo de gastos totales de todas las obras (en producción vendría del backend)
  const totalAllWorksExpenses = 2465000; // Total de gastos de todas las obras activas
  const indirectCostsTotal = 85000; // Monto fijo mensual de indirectos
  
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
    console.log("Nuevo movimiento guardado:", data);
    // Aquí se implementaría la lógica para guardar en el backend
    // Por ahora solo mostramos en consola
  };

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