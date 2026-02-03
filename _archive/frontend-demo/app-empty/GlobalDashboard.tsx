/**
 * EMPTY STATE - Dashboard Global Empresarial
 * Sin obras registradas
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { WorkForm, Work } from "@/app/components/WorkForm";
import {
  Building2,
  Plus,
  TrendingUp,
  BarChart3,
  FileText,
  Target,
  Users,
  Briefcase,
} from "lucide-react";

export default function GlobalDashboardEmpty() {
  const [showWorkForm, setShowWorkForm] = useState(false);

  const handleSaveWork = (work: Work) => {
    console.log("Nueva obra guardada:", work);
    alert(`Obra "${work.name}" guardada exitosamente. En producción se guardaría en la base de datos.`);
    setShowWorkForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-700 rounded-xl shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Dashboard Global Empresarial
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  IDP - Inmobiliaria y Desarrollos del Pacífico
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg"
              onClick={() => setShowWorkForm(true)}
            >
              <Plus className="h-5 w-5" />
              Nueva Obra
            </Button>
          </div>
        </div>

        {/* Empty Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total en Contratos
                  </p>
                  <p className="text-3xl font-bold text-gray-400">$0.00</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg opacity-50">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Saldo Actual
                  </p>
                  <p className="text-3xl font-bold text-gray-400">$0.00</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg opacity-50">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Estimaciones
                  </p>
                  <p className="text-3xl font-bold text-gray-400">$0.00</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg opacity-50">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="p-16">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex p-8 bg-slate-100 rounded-full mb-8">
                <Building2 className="h-20 w-20 text-slate-400" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No hay obras registradas
              </h3>
              
              <p className="text-lg text-gray-600 mb-8">
                Comienza registrando tu primera obra para visualizar el progreso empresarial,
                contratos, estimaciones y flujo de efectivo en tiempo real.
              </p>

              <Button 
                size="lg"
                className="gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
                onClick={() => setShowWorkForm(true)}
              >
                <Plus className="h-6 w-6" />
                Registrar Primera Obra
              </Button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Seguimiento de Contratos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Monitorea estimaciones, anticipos, fondo de garantía y pagos en tiempo real
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Control de Gastos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Visualiza gastos semanales, OCs pagadas, nómina y gastos indirectos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Flujo de Efectivo
                      </h4>
                      <p className="text-sm text-gray-600">
                        Analiza saldos, anticipos por amortizar y pendientes de cobro
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Vista Empresarial
                      </h4>
                      <p className="text-sm text-gray-600">
                        Consolida todas las obras en un solo dashboard ejecutivo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Gestión Multi-Proyecto
                    </h4>
                    <p className="text-sm text-blue-800">
                      Administra múltiples obras simultáneamente con seguimiento independiente
                      de contratos, estimaciones, pagos y gastos por proyecto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Form Modal */}
      {showWorkForm && (
        <WorkForm
          onClose={() => setShowWorkForm(false)}
          onSave={handleSaveWork}
        />
      )}
    </div>
  );
}