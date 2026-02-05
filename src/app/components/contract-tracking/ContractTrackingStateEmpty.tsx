/** CONTRACT TRACKING - Estado Empty */
import { EmptyState } from "@/app/components/states";
import {
  FileText,
  TrendingUp,
  Calculator,
  Plus,
  Minus,
  Target,
} from "lucide-react";

export function ContractTrackingStateEmpty() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Control de Contrato
              </h1>
              <p className="text-muted-foreground">
                Seguimiento de estimaciones y ejecución contractual
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={FileText}
          title="No hay datos de contrato disponibles"
          description="Selecciona una obra desde el Dashboard Global para visualizar el control contractual completo con estimaciones y avances."
          benefits={[
            {
              icon: TrendingUp,
              title: "Estimaciones Progresivas",
              description:
                "Registra estimaciones por concepto con avance financiero y físico mensual",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: Calculator,
              title: "Cálculos Automáticos",
              description:
                "Anticipo, fondo de garantía, amortizaciones y retenciones calculadas automáticamente",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Plus,
              title: "Aditivas y Deductivas",
              description:
                "Gestiona incrementos o decrementos al monto contractual con justificación",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: Target,
              title: "Control de Avance",
              description:
                "Compara avance físico vs financiero para detectar desviaciones",
              color: "bg-orange-100 text-orange-600",
            },
          ]}
        />
      </div>
    </div>
  );
}
