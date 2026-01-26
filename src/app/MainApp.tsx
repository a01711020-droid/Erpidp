import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Building2,
  Home as HomeIcon,
  ArrowLeft,
} from "lucide-react";
import Home from "./Home";
import GlobalDashboard from "./GlobalDashboard";
import PurchaseOrderManagement from "./PurchaseOrderManagement";
import MaterialRequisitions from "./MaterialRequisitions";
import PaymentManagement from "./PaymentManagement";
import ContractTracking from "./ContractTracking";
import ExpenseDetails from "./ExpenseDetails";

type Module =
  | "home"
  | "dashboard"
  | "requisitions"
  | "purchases"
  | "payments"
  | "contract-tracking"
  | "expense-details";

interface User {
  name: string;
  role: "admin" | "residente" | "compras" | "pagos";
  allowedModules: Module[];
}

// Simulación de usuario actual - en producción vendría de autenticación
const currentUser: User = {
  name: "Sistema de Gestión",
  role: "admin", // Cambia esto para probar diferentes roles: "residente", "compras", "pagos"
  allowedModules: ["home", "dashboard", "requisitions", "purchases", "payments", "contract-tracking", "expense-details"], // Admin tiene acceso a todo
};

// Configuración de acceso por rol
const roleConfig = {
  admin: {
    modules: ["home", "dashboard", "requisitions", "purchases", "payments", "contract-tracking", "expense-details"] as Module[],
  },
  residente: {
    modules: ["home", "requisitions", "contract-tracking", "expense-details"] as Module[],
  },
  compras: {
    modules: ["home", "purchases", "requisitions"] as Module[],
  },
  pagos: {
    modules: ["home", "payments"] as Module[],
  },
};

export default function MainApp() {
  const [activeModule, setActiveModule] = useState<Module>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);

  const hasAccess = (module: Module) => {
    return currentUser.allowedModules.includes(module);
  };

  const handleModuleChange = (module: Module) => {
    if (hasAccess(module)) {
      setActiveModule(module);
      setShowExpenseDetails(false);
    }
  };

  const handleBackToHome = () => {
    setActiveModule("home");
    setSelectedProjectId(null);
    setShowExpenseDetails(false);
  };
  
  const handleBackToDashboard = () => {
    setActiveModule("dashboard");
    setSelectedProjectId(null);
    setShowExpenseDetails(false);
  };
  
  const handleBackToContractTracking = () => {
    setShowExpenseDetails(false);
  };

  const handleLogout = () => {
    alert("Cerrando sesión...");
    // Aquí iría la lógica de cierre de sesión
  };
  
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveModule("contract-tracking");
    setShowExpenseDetails(false);
  };
  
  const handleShowExpenseDetails = () => {
    setShowExpenseDetails(true);
  };

  // Módulo Títulos para el header
  const getModuleTitle = () => {
    switch (activeModule) {
      case "home":
        return "Inicio";
      case "dashboard":
        return "Dashboard Global";
      case "requisitions":
        return "Requisiciones de Material";
      case "purchases":
        return "Órdenes de Compra";
      case "payments":
        return "Módulo de Pagos";
      case "contract-tracking":
        return "Seguimiento de Contratos";
      case "expense-details":
        return "Detalles de Gastos";
      default:
        return "";
    }
  };

  // Si estamos en home, mostrar solo la pantalla de selección
  if (activeModule === "home") {
    return (
      <Home
        onSelectModule={handleModuleChange}
        userRole={currentUser.role}
        userName={currentUser.name}
      />
    );
  }

  // Para otros módulos, mostrar el header simplificado
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Simplified Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-xl">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo-idp-normal.svg"
                alt="IDP Construcción"
                className="h-14 w-auto"
              />
              <div className="h-10 w-px bg-slate-500/50"></div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {getModuleTitle()}
                </h1>
                <p className="text-xs text-slate-300">
                  Sistema de Gestión Empresarial
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <HomeIcon className="h-4 w-4" />
                Volver al Inicio
              </Button>
              <div className="h-10 w-px bg-slate-500/50"></div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-300 capitalize">
                  {currentUser.role === "admin"
                    ? "Administrador"
                    : currentUser.role === "residente"
                    ? "Residente de Obra"
                    : currentUser.role === "compras"
                    ? "Departamento de Compras"
                    : "Departamento de Pagos"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white hover:bg-slate-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === "dashboard" && hasAccess("dashboard") && (
          <GlobalDashboard onSelectProject={handleSelectProject} />
        )}

        {activeModule === "requisitions" && hasAccess("requisitions") && (
          <MaterialRequisitions />
        )}

        {activeModule === "purchases" && hasAccess("purchases") && (
          <PurchaseOrderManagement />
        )}

        {activeModule === "payments" && hasAccess("payments") && (
          <PaymentManagement />
        )}

        {activeModule === "contract-tracking" && hasAccess("contract-tracking") && (
          <ContractTracking projectId={selectedProjectId} />
        )}

        {activeModule === "expense-details" && hasAccess("expense-details") && (
          <ExpenseDetails />
        )}

        {/* Access Denied Message */}
        {!hasAccess(activeModule) && (
          <Card className="p-12">
            <div className="text-center">
              <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Acceso Denegado
              </h2>
              <p className="text-gray-600 mb-4">
                No tienes permisos para acceder a este módulo.
              </p>
              <p className="text-sm text-gray-500">
                Tu rol actual:{" "}
                <span className="font-semibold capitalize">
                  {currentUser.role}
                </span>
              </p>
              <Button
                onClick={handleBackToHome}
                className="mt-4 gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-12">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-idp-normal.svg" alt="IDP" className="h-10 w-auto" />
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