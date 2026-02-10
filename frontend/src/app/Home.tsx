import { Card } from "./components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
  Truck,
  HardHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Module =
  | "dashboard"
  | "requisitions"
  | "purchases"
  | "payments"
  | "deliveries"
  | "destajos";

// Configuración de módulos
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
    id: "destajos" as Module,
    title: "Control de Destajos",
    description: "Gestión de destajos por obra, configuración de prototipos y captura semanal de avances",
    icon: HardHat,
    color: "from-teal-800 to-teal-900",
    bgGradient: "from-teal-50 to-teal-100",
    borderColor: "border-teal-300",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-800",
    hoverBorder: "hover:border-teal-500",
    allowedRoles: ["admin", "residente"],
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

export default function Home() {
  const navigate = useNavigate();
  const userRole: "admin" | "residente" | "compras" | "pagos" = "admin";
  const userName = "Sistema de Gestión";
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  const accessibleModules = modules.filter((module) =>
    hasAccess(module.allowedRoles)
  );

  const moduleRoutes: Record<Module, string> = {
    dashboard: "/dashboard",
    requisitions: "/requisiciones",
    purchases: "/compras",
    payments: "/pagos",
    deliveries: "/",
    destajos: "/destajos",
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)'
    }}>
      {/* Hero Section */}
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
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Sistema de Gestión Empresarial
            </h1>
            <p className="text-xl text-slate-300 mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
              IDP Construcción, Consultoría y Diseño
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full mt-4">
              <Users className="h-5 w-5 text-slate-300" />
              <span className="text-slate-200" style={{ fontFamily: "'Caveat', cursive" }}>
                Bienvenido, <span className="font-semibold text-white">{userName}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 capitalize" style={{ fontFamily: "'Caveat', cursive" }}>
                {userRole === "admin"
                  ? "Administrador"
                  : userRole === "residente"
                  ? "Residente de Obra"
                  : userRole === "compras"
                  ? "Departamento de Compras"
                  : "Departamento de Pagos"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Selection - Círculos */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Caveat', cursive" }}>
            Selecciona un Módulo
          </h2>
          <p className="text-xl text-gray-600" style={{ fontFamily: "'Caveat', cursive" }}>
            Elige el área del sistema que deseas gestionar
          </p>
        </div>

        {/* 4 círculos arriba */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {accessibleModules.slice(0, 4).map((module) => {
            const Icon = module.icon;
            const isComingSoon = module.comingSoon;
            
            return (
              <div
                key={module.id}
                className={`flex flex-col items-center ${
                  isComingSoon ? "opacity-75" : "cursor-pointer"
                }`}
                onClick={() => !isComingSoon && navigate(moduleRoutes[module.id])}
              >
                <div
                  className={`relative w-40 h-40 rounded-full border-4 ${module.borderColor} ${
                    isComingSoon ? "" : module.hoverBorder + " hover:scale-110"
                  } transition-all duration-300 shadow-xl flex items-center justify-center group`}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${module.bgGradient} opacity-90`}></div>
                  <div className="relative z-10">
                    <Icon className={`h-16 w-16 ${module.iconColor} ${
                      isComingSoon ? "" : "group-hover:scale-125"
                    } transition-transform duration-300`} />
                  </div>
                  {isComingSoon && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PRONTO
                    </div>
                  )}
                </div>
                <h3
                  className="mt-4 text-lg font-bold text-gray-900 text-center max-w-[160px]"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: "22px" }}
                >
                  {module.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* 2 círculos abajo */}
        {accessibleModules.length > 4 && (
          <div className="flex justify-center gap-8 flex-wrap">
            {accessibleModules.slice(4, 6).map((module) => {
              const Icon = module.icon;
              const isComingSoon = module.comingSoon;
              
              return (
                <div
                  key={module.id}
                  className={`flex flex-col items-center ${
                    isComingSoon ? "opacity-75" : "cursor-pointer"
                  }`}
                  onClick={() => !isComingSoon && navigate(moduleRoutes[module.id])}
                >
                  <div
                    className={`relative w-40 h-40 rounded-full border-4 ${module.borderColor} ${
                      isComingSoon ? "" : module.hoverBorder + " hover:scale-110"
                    } transition-all duration-300 shadow-xl flex items-center justify-center group`}
                    style={{
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    }}
                  >
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${module.bgGradient} opacity-90`}></div>
                    <div className="relative z-10">
                      <Icon className={`h-16 w-16 ${module.iconColor} ${
                        isComingSoon ? "" : "group-hover:scale-125"
                      } transition-transform duration-300`} />
                    </div>
                    {isComingSoon && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        PRONTO
                      </div>
                    )}
                  </div>
                  <h3
                    className="mt-4 text-lg font-bold text-gray-900 text-center max-w-[160px]"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: "22px" }}
                  >
                    {module.title}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-idp-normal.svg" alt="IDP" className="h-12 w-auto" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-white">
                  IDP Construcción, Consultoría y Diseño
                </p>
                <p>Sistema de Gestión Empresarial v1.0</p>
              </div>
            </div>
            <div className="text-sm text-slate-300">
              © 2025 Todos los derechos reservados
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
