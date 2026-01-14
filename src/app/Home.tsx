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
} from "lucide-react";

// Logo IDP
import logoIdp from "figma:asset/f8466b45551caf0d2ba4727b71061c2b0b7fdee1.png";

type Module = "dashboard" | "requisitions" | "purchases" | "payments";

interface HomeProps {
  onSelectModule: (module: Module) => void;
  userRole: "admin" | "residente" | "compras" | "pagos";
  userName: string;
}

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
];

export default function Home({ onSelectModule, userRole, userName }: HomeProps) {
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  const accessibleModules = modules.filter((module) =>
    hasAccess(module.allowedRoles)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logoIdp}
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
            <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full mt-4">
              <Users className="h-5 w-5 text-slate-300" />
              <span className="text-slate-200">
                Bienvenido, <span className="font-semibold text-white">{userName}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 capitalize">
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

      {/* Modules Selection */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Selecciona un Módulo
          </h2>
          <p className="text-lg text-gray-600">
            Elige el área del sistema que deseas gestionar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {accessibleModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className={`relative overflow-hidden border-2 ${module.borderColor} ${module.hoverBorder} transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group`}
                onClick={() => onSelectModule(module.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} opacity-50`}></div>
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 ${module.iconBg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-10 w-10 ${module.iconColor}`} />
                    </div>
                    <div className="bg-white rounded-full p-2 shadow-md group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className={`h-6 w-6 ${module.iconColor}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No Access Message */}
        {accessibleModules.length === 0 && (
          <Card className="max-w-2xl mx-auto p-12">
            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sin Módulos Disponibles
              </h3>
              <p className="text-gray-600">
                Tu rol actual no tiene acceso a ningún módulo del sistema.
                <br />
                Por favor, contacta con el administrador.
              </p>
            </div>
          </Card>
        )}

        {/* Statistics Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold mb-1">
                  Módulos Activos
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {accessibleModules.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">
                  Tu Acceso
                </p>
                <p className="text-xl font-bold text-purple-900 capitalize">
                  {userRole === "admin"
                    ? "Completo"
                    : userRole === "residente"
                    ? "Requisiciones"
                    : userRole === "compras"
                    ? "Compras"
                    : "Pagos"}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-1">
                  Estado del Sistema
                </p>
                <p className="text-xl font-bold text-green-900">
                  Operativo
                </p>
              </div>
              <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoIdp} alt="IDP" className="h-12 w-auto" />
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