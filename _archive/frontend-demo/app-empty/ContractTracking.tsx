/**
 * EMPTY STATE - Seguimiento Físico de Contrato
 * 
 * IMPORTANTE: Esta NO es una pantalla completamente vacía.
 * 
 * DATOS QUE SÍ EXISTEN (vienen del WorkForm al crear la obra):
 * - No. Contrato, Monto, Cliente, Nombre de la Obra
 * - Fechas inicio/fin, % Anticipo, % Fondo de Garantía
 * - Anticipo calculado
 * 
 * DATOS QUE NO EXISTEN (tabla vacía):
 * - Estimaciones/Movimientos del contrato
 * - Gastos semanales
 * - Gastos indirectos calculados
 * 
 * Este es el estado que se ve cuando abres el dashboard de una obra
 * por PRIMERA VEZ después de crearla, antes de registrar estimaciones.
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { EstimationForm, EstimationFormData } from "@/app/components/EstimationForm";
import {
  Plus,
  FileText,
  Building2,
  User,
  Calendar,
  Percent,
  HardHat,
  BarChart3,
  DollarSign,
  Target,
} from "lucide-react";

interface ContractTrackingEmptyProps {
  projectId?: string | null;
}

export default function ContractTrackingEmpty({ projectId }: ContractTrackingEmptyProps) {
  const [showEstimationForm, setShowEstimationForm] = useState(false);

  // ====================================================================
  // DATOS DE LA OBRA (vienen del WorkForm cuando se creó la obra)
  // ====================================================================
  // Estos NO son mock data fijo, son los datos REALES de la obra actual.
  // Cuando se crea una obra diferente, estos datos cambiarían.
  // En producción, estos datos vendrían del backend según el projectId.
  // ====================================================================
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
  // ====================================================================

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const handleSaveEstimation = (data: EstimationFormData) => {
    console.log("Nueva estimación guardada:", data);
    alert(`Estimación ${data.movementNumber} guardada exitosamente. En producción se guardaría en la base de datos.`);
    setShowEstimationForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Title - IGUAL que FULL */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Seguimiento Físico de Contrato</h2>
              <p className="text-sm text-gray-500">Control de obra y flujo financiero</p>
            </div>
          </div>

          {/* Add Movement Button - A LA IZQUIERDA como en FULL */}
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => setShowEstimationForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Movimiento
          </Button>

          {/* Contract Header - IDÉNTICO a la versión FULL */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Contract Number */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">No. Contrato</p>
                    <p className="text-lg font-bold text-gray-900">{contractInfo.contractNumber}</p>
                  </div>
                </div>

                {/* Contract Amount */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monto del Contrato</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(contractInfo.contractAmount)}</p>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cliente</p>
                    <p className="text-sm font-semibold text-gray-900">{contractInfo.client}</p>
                  </div>
                </div>

                {/* Project Name */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nombre de la Obra</p>
                    <p className="text-sm font-semibold text-gray-900">{contractInfo.projectName}</p>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha Inicio / Fin</p>
                    <p className="text-sm font-semibold text-gray-900">{contractInfo.startDate} - {contractInfo.endDate}</p>
                  </div>
                </div>

                {/* Advance Percentage */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Percent className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">% Anticipo</p>
                    <p className="text-lg font-bold text-gray-900">{contractInfo.advancePercentage}%</p>
                  </div>
                </div>

                {/* Guarantee Fund Percentage */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Percent className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">% Fondo de Garantía</p>
                    <p className="text-lg font-bold text-gray-900">{contractInfo.guaranteeFundPercentage}%</p>
                  </div>
                </div>

                {/* Calculated Advance */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Anticipo Calculado</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(contractInfo.contractAmount * (contractInfo.advancePercentage / 100))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty State - Movimientos del Contrato */}
          <Card>
            <CardContent className="p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex p-8 bg-gray-100 rounded-full mb-6">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No hay estimaciones o movimientos registrados
                </h3>
                
                <p className="text-gray-600 mb-8">
                  Comienza registrando la primera estimación o movimiento del contrato
                  para iniciar el seguimiento físico y financiero de la obra.
                </p>

                <Button 
                  size="lg"
                  className="gap-2 bg-gray-700 hover:bg-gray-800 px-8"
                  onClick={() => setShowEstimationForm(true)}
                >
                  <Plus className="h-5 w-5" />
                  Registrar Primera Estimación
                </Button>

                {/* Info Cards - 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Estimaciones
                        </h4>
                        <p className="text-sm text-gray-600">
                          Registra estimaciones, amortizaciones de anticipo y fondo de garantía
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Gastos Semanales
                        </h4>
                        <p className="text-sm text-gray-600">
                          Visualiza OCs pagadas y nómina semanal automáticamente
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <Percent className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Gastos Indirectos
                        </h4>
                        <p className="text-sm text-gray-600">
                          Cálculo proporcional de indirectos asignados a la obra
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <Target className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Control de Saldos
                        </h4>
                        <p className="text-sm text-gray-600">
                          Seguimiento de saldo anticipo, pagado y pendiente por cobrar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Section - 3 Cards como en la imagen 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gastos Semanales - Empty */}
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-700">Gastos Semanales</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Los gastos aparecerán cuando se registren OCs y nómina
                </p>
              </CardContent>
            </Card>

            {/* Gastos Indirectos - Empty */}
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-700">Gastos Indirectos</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Se calcularán automáticamente según proporción de gastos
                </p>
              </CardContent>
            </Card>

            {/* Desglose Detallado - Empty */}
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-700">Desglose Detallado</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Disponible después de registrar gastos y pagos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Estimation Form Modal */}
      <EstimationForm
        isOpen={showEstimationForm}
        onClose={() => setShowEstimationForm(false)}
        onSave={handleSaveEstimation}
        contractInfo={{
          contractAmount: contractInfo.contractAmount,
          advancePercentage: contractInfo.advancePercentage,
          guaranteeFundPercentage: contractInfo.guaranteeFundPercentage,
        }}
        lastEstimation={undefined}
      />
    </div>
  );
}