/**
 * GLOBAL DASHBOARD - Estado Empty
 * Se muestra cuando no hay obras registradas
 */

import { EmptyState } from "@/app/components/states";
import {
  Building2,
  DollarSign,
  AlertCircle,
  Plus,
  BarChart3,
  Target,
} from "lucide-react";

interface DashboardStateEmptyProps {
  onCreateWork?: () => void;
}

export function DashboardStateEmpty({ onCreateWork }: DashboardStateEmptyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-700 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Empresarial
              </h1>
              <p className="text-muted-foreground">
                Gestión financiera global de proyectos constructivos
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={Building2}
          title="No hay obras registradas"
          description="Comienza registrando tu primera obra para llevar el control financiero y operativo de todos tus proyectos constructivos."
          ctaLabel="Crear Primera Obra"
          ctaIcon={Plus}
          onCta={onCreateWork}
          benefits={[
            {
              icon: DollarSign,
              title: "Control Financiero",
              description:
                "Monitorea contratos, estimaciones y gastos en tiempo real",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: BarChart3,
              title: "Reportes Consolidados",
              description:
                "Vista ejecutiva de todas tus obras con métricas clave",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: Target,
              title: "Seguimiento de Avance",
              description:
                "Compara avance financiero vs físico en cada proyecto",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: AlertCircle,
              title: "Alertas Automáticas",
              description: "Detecta desviaciones y problemas de forma temprana",
              color: "bg-orange-100 text-orange-600",
            },
          ]}
        />
      </div>
    </div>
  );
}
