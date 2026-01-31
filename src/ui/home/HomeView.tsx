import { Card } from "@/app/components/ui/card";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Users,
  TrendingUp,
} from "lucide-react";

type Module =
  | "dashboard"
  | "requisitions"
  | "purchases"
  | "payments"
  | "deliveries"
  | "obras"
  | "proveedores";

interface HomeViewProps {
  onSelectModule: (module: Module) => void;
  userRole: "admin" | "residente" | "compras" | "pagos";
  userName: string;
}

const modules = [
  {
    id: "dashboard" as Module,
    title: "Dashboard Global",
    description: "Vista general del sistema empresarial con todas las métricas y estadísticas",
    icon: LayoutDashboard,
    color: "from-slate-800 to-slate-900",
    bgGradient: "from-slate-100 to-slate-200",
    borderColor: "border-slate-300",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-800",
    hoverBorder: "hover:border-slate-500",
    allowedRoles: ["admin"],
  },
  {
    id: "obras" as Module,
    title: "Obras",
    description: "Control de obras activas, métricas financieras y seguimiento de contratos",
    icon: Building2,
    color: "from-indigo-700 to-indigo-800",
    bgGradient: "from-indigo-50 to-indigo-100",
    borderColor: "border-indigo-300",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    hoverBorder: "hover:border-indigo-500",
    allowedRoles: ["admin", "residente"],
  },
  {
    id: "proveedores" as Module,
    title: "Proveedores",
    description: "Catálogo de proveedores con contactos, crédito y estatus",
    icon: Users,
    color: "from-sky-700 to-sky-800",
    bgGradient: "from-sky-50 to-sky-100",
    borderColor: "border-sky-300",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    hoverBorder: "hover:border-sky-500",
    allowedRoles: ["admin", "compras", "pagos"],
  },
  {
    id: "requisitions" as Module,
    title: "Requisiciones de Material",
    description: "Gestión de solicitudes de material desde obra con sistema de urgencia y aprobaciones",
    icon: ClipboardList,
    color: "from-amber-700 to-amber-800",
    bgGradient: "from-amber-50 to-amber-100",
    borderColor: "border-amber-300",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    hoverBorder: "hover:border-amber-500",
    allowedRoles: ["admin", "residente", "compras"],
  },
  {
    id: "purchases" as Module,
    title: "Órdenes de Compra",
    description: "Gestión completa de órdenes de compra, proveedores y generación de PDFs",
    icon: ShoppingCart,
    color: "from-blue-700 to-blue-800",
    bgGradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-300",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    hoverBorder: "hover:border-blue-500",
    allowedRoles: ["admin", "compras"],
  },
  {
    id: "payments" as Module,
    title: "Módulo de Pagos",
    description: "Control de pagos a proveedores, vinculación con OCs y pagos parciales",
    icon: CreditCard,
    color: "from-emerald-700 to-emerald-800",
    bgGradient: "from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-300",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    hoverBorder: "hover:border-emerald-500",
    allowedRoles: ["admin", "pagos"],
  },
  {
    id: "deliveries" as Module,
    title: "Módulo de Entregas",
    description: "Próximamente - Control de entregas y recepción de materiales en obra",
    icon: Truck,
    color: "from-orange-700 to-orange-800",
    bgGradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-300",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
    hoverBorder: "hover:border-orange-500",
    allowedRoles: ["admin"],
    comingSoon: true,
  },
];

export default function HomeView({ onSelectModule, userRole, userName }: HomeViewProps) {
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  const accessibleModules = modules.filter((module) =>
    hasAccess(module.allowedRoles)
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
      }}
    >
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo-idp-normal.svg"
                alt="IDP Construcción"
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Sistema de Gestión Empresarial
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              IDP Construcción, Consultoría y Diseño
            </p>
            <p className="text-lg text-slate-400">
              Bienvenido, {userName}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Módulos del Sistema
          </h2>
          <p className="text-lg text-slate-600">
            Seleccione el módulo al que desea acceder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessibleModules.map((module) => {
            const Icon = module.icon;
            const isDisabled = module.comingSoon;
            return (
              <Card
                key={module.id}
                className={`relative overflow-hidden border-2 ${module.borderColor} ${
                  module.hoverBorder
                } transition-all duration-300 hover:shadow-xl cursor-pointer bg-gradient-to-br ${
                  module.bgGradient
                } ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => !isDisabled && onSelectModule(module.id)}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${module.color}`}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${module.iconBg}`}>
                      <Icon className={`h-8 w-8 ${module.iconColor}`} />
                    </div>
                    {isDisabled ? (
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        PRÓXIMAMENTE
                      </span>
                    ) : (
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{module.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>Acceso {userRole}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
