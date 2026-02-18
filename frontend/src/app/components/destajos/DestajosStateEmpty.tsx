import { EmptyState } from "@/app/components/states";
import { HardHat, Home, ClipboardList, DollarSign, CheckCircle } from "lucide-react";

interface Props {
  onCreateWork?: () => void;
}

export function DestajosStateEmpty({ onCreateWork }: Props) {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)'
    }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <HardHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Control de Destajos</h1>
              <p className="text-teal-100 text-lg">
                Gestión de destajos por obra y captura semanal de avances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={HardHat}
          title="No hay obras con destajos configurados"
          description="Comienza creando tu primera obra y configura los destajos para llevar control del avance de construcción por lote y prototipo."
          ctaLabel="Crear Primera Obra"
          onCta={onCreateWork}
          benefits={[
            {
              icon: Home,
              title: "Configuración por Lote",
              description: "Asigna prototipos a cada lote y controla el avance de construcción individual",
            },
            {
              icon: ClipboardList,
              title: "Catálogo de Conceptos",
              description: "Define conceptos de trabajo por sección con precios específicos para cada prototipo",
            },
            {
              icon: DollarSign,
              title: "Captura Semanal",
              description: "Registra avances semanales y calcula automáticamente los pagos por destajo",
            },
            {
              icon: CheckCircle,
              title: "Control de Avance",
              description: "Visualiza el progreso de cada lote y genera reportes de pago por concepto",
            },
          ]}
        />
      </div>
    </div>
  );
}