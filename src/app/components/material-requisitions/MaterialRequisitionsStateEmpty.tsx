/**
 * MATERIAL REQUISITIONS - Estado Empty
 */

import { EmptyState } from "@/app/components/states";
import {
  ClipboardList,
  Send,
  MessageSquare,
  AlertCircle,
  Clock,
} from "lucide-react";

export function MaterialRequisitionsStateEmpty() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Requisiciones de Material
              </h1>
              <p className="text-muted-foreground">
                Portal de solicitudes para residentes de obra
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={ClipboardList}
          title="No hay requisiciones activas"
          description="Los residentes de obra pueden solicitar materiales y servicios que se procesarán en el Departamento de Compras."
          benefits={[
            {
              icon: Send,
              title: "Solicitud Rápida",
              description:
                "Formulario simple para que los residentes pidan material en segundos",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: MessageSquare,
              title: "Comunicación Directa",
              description:
                "Chat integrado entre residente y comprador para aclarar dudas",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: AlertCircle,
              title: "Urgencia Configurable",
              description:
                "Marca solicitudes urgentes que requieren atención inmediata",
              color: "bg-orange-100 text-orange-600",
            },
            {
              icon: Clock,
              title: "Seguimiento en Tiempo Real",
              description:
                "Los residentes ven el estatus de cada requisición (Pendiente, En Proceso, Comprado)",
              color: "bg-purple-100 text-purple-600",
            },
          ]}
        />
      </div>
    </div>
  );
}
