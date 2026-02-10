/** PAYMENT MANAGEMENT - Estado Empty */
import { EmptyState } from "@/ui/states";
import {
  CreditCard,
  FileText,
  DollarSign,
  AlertTriangle,
  Ban,
} from "lucide-react";

export function PaymentManagementStateEmpty() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Pagos
              </h1>
              <p className="text-muted-foreground">
                Control de facturas y pagos a proveedores
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={CreditCard}
          title="No hay órdenes de compra para gestionar pagos"
          description="Comienza creando órdenes de compra. Luego podrás registrar facturas y pagos asociados a cada una."
          benefits={[
            {
              icon: FileText,
              title: "Múltiples Facturas por OC",
              description:
                "Registra varias facturas para una misma orden de compra si el proveedor entrega en parcialidades",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: DollarSign,
              title: "Múltiples Pagos por Factura",
              description:
                "Registra pagos parciales o diferidos para cada factura con fechas y métodos de pago",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: AlertTriangle,
              title: "Alertas de Vencimiento",
              description:
                "Identifica facturas próximas a vencer y evita cargos moratorios",
              color: "bg-orange-100 text-orange-600",
            },
            {
              icon: Ban,
              title: "Proveedores sin Factura",
              description:
                "Detecta OCs sin factura registrada que requieren seguimiento",
              color: "bg-red-100 text-red-600",
            },
          ]}
        />
      </div>
    </div>
  );
}
