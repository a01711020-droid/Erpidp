/**
 * EMPTY STATE - Requisiciones de Material
 * Sin datos (estado vacío con CTAs)
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Package,
  Plus,
  ClipboardList,
  Bell,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

export default function MaterialRequisitionsEmpty() {
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Naranja */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 border-b-4 border-orange-800 shadow-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  Ing. Miguel Ángel Torres
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-orange-100">
                    <span className="font-semibold">Obra 227</span> - CASTELLO E
                  </p>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    0 Requisiciones
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4" />
              Notificaciones
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full mb-6 gap-2 bg-orange-600 hover:bg-orange-700 text-lg py-6"
          onClick={() => setShowRequisitionForm(true)}
        >
          <Plus className="h-6 w-6" />
          Nueva Requisición
        </Button>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="p-12">
            <div className="text-center max-w-lg mx-auto">
              <div className="inline-flex p-6 bg-orange-100 rounded-full mb-6">
                <ClipboardList className="h-16 w-16 text-orange-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No tienes requisiciones registradas
              </h3>
              
              <p className="text-gray-600 mb-6">
                Crea tu primera requisición de materiales para que el departamento de
                compras pueda procesarla y convertirla en una orden de compra.
              </p>

              <Button 
                size="lg"
                className="gap-2 bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowRequisitionForm(true)}
              >
                <Plus className="h-5 w-5" />
                Crear Primera Requisición
              </Button>

              {/* Proceso */}
              <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg text-left">
                <h4 className="font-semibold text-orange-900 mb-4 text-center">
                  ¿Cómo funciona el proceso?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Creas la requisición</p>
                      <p className="text-sm text-gray-600">
                        Agrega los materiales necesarios y define urgencia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        Compras la revisa
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                      </p>
                      <p className="text-sm text-gray-600">
                        Puedes chatear con el departamento de compras
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        Se convierte en OC
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </p>
                      <p className="text-sm text-gray-600">
                        Compras genera la orden y coordina entrega
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fake Requisition Form Dialog */}
        {showRequisitionForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-orange-100 rounded-full mb-4">
                    <ClipboardList className="h-12 w-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Formulario de Requisición de Material
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    En la versión con datos, aquí aparecerá el formulario completo para crear una nueva requisición con materiales, cantidades, urgencia y fecha de entrega.
                  </p>
                  <Button onClick={() => setShowRequisitionForm(false)} className="w-full">
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fake Notifications Dialog */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <Bell className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Notificaciones
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    En la versión con datos, aquí verás las actualizaciones de tus requisiciones (aprobadas, en proceso, comentarios de compras, etc.).
                  </p>
                  <Button onClick={() => setShowNotifications(false)} className="w-full">
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