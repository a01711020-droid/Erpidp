/**
 * PURCHASE ORDER MANAGEMENT - Estado Empty
 */

import { EmptyState } from "@/app/components/states";
import {
  ShoppingCart,
  FileText,
  ClipboardList,
  Users,
  BarChart3,
  Plus,
} from "lucide-react";

interface PurchaseOrderStateEmptyProps {
  onCreateOrder?: () => void;
  onNavigateToSuppliers?: () => void;
}

export function PurchaseOrderStateEmpty({
  onCreateOrder,
  onNavigateToSuppliers,
}: PurchaseOrderStateEmptyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Departamento de Compras
              </h1>
              <p className="text-muted-foreground">
                Gestión de órdenes de compra y requisiciones de material
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={ShoppingCart}
          title="No hay órdenes de compra"
          description="Comienza generando tu primera orden de compra para gestionar las adquisiciones de materiales y servicios de tus obras."
          ctaLabel="Crear Primera Orden de Compra"
          ctaIcon={Plus}
          onCta={onCreateOrder}
          secondaryCtaLabel="Gestionar Proveedores"
          onSecondaryCta={onNavigateToSuppliers}
          benefits={[
            {
              icon: FileText,
              title: "Órdenes Profesionales",
              description:
                "Genera OCs con folio automático, partidas detalladas y PDF descargable",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: ClipboardList,
              title: "Requisiciones Integradas",
              description:
                "Recibe solicitudes de obra y conviértelas en órdenes automáticamente",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Users,
              title: "Catálogo de Proveedores",
              description:
                "Mantén tu base de proveedores organizada con datos fiscales completos",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: BarChart3,
              title: "Control de Costos",
              description:
                "Monitorea gastos por obra y recibe alertas de desviaciones presupuestales",
              color: "bg-orange-100 text-orange-600",
            },
          ]}
          infoItems={[
            {
              label: "IVA Flexible",
              description: "Configurable por orden (obras gobierno sin IVA)",
            },
          ]}
        />
      </div>
    </div>
  );
}
