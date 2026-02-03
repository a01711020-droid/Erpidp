/**
 * EMPTY STATE - Módulo de Pagos
 * Sin datos (estado vacío con CTAs)
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  DollarSign,
  Receipt,
  Plus,
  Upload,
  CreditCard,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function PaymentManagementEmpty() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Verde */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Módulo de Pagos
              </h1>
              <p className="text-muted-foreground">
                Control de pagos a proveedores y gestión de facturas
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 py-6"
            onClick={() => setShowPaymentForm(true)}
          >
            <Plus className="h-5 w-5" />
            Registrar Pago
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6"
            onClick={() => setShowImportCSV(true)}
          >
            <Upload className="h-5 w-5" />
            Importar CSV Bancario
          </Button>
        </div>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex p-6 bg-emerald-100 rounded-full mb-6">
                <Receipt className="h-16 w-16 text-emerald-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No hay órdenes de compra con pagos pendientes
              </h3>
              
              <p className="text-gray-600 mb-8">
                Aquí aparecerán las órdenes de compra que requieran pagos o facturas.
                El sistema rastrea automáticamente los plazos de crédito y vencimientos.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Control de Créditos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Rastreo automático de días de crédito por proveedor
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Alertas de Vencimiento
                      </h4>
                      <p className="text-sm text-gray-600">
                        Notificaciones de pagos próximos a vencer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
                      <Receipt className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Gestión de Facturas
                      </h4>
                      <p className="text-sm text-gray-600">
                        Registro de facturas vinculadas a OCs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Pagos Parciales
                      </h4>
                      <p className="text-sm text-gray-600">
                        Registro de múltiples pagos por OC con historial
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>Próximo paso:</strong> Crea órdenes de compra en el módulo de Compras.
                  Automáticamente aparecerán aquí para su seguimiento de pagos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fake Payment Form Dialog */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
                    <Receipt className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Formulario de Registro de Pago
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    En la versión con datos, aquí aparecerá el formulario completo para registrar pagos a proveedores con facturas y métodos de pago.
                  </p>
                  <Button onClick={() => setShowPaymentForm(false)} className="w-full">
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fake CSV Import Dialog */}
        {showImportCSV && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <Upload className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Importador CSV Bancario
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    En la versión con datos, aquí podrás importar archivos CSV de tu banco para conciliar pagos automáticamente.
                  </p>
                  <Button onClick={() => setShowImportCSV(false)} className="w-full">
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}