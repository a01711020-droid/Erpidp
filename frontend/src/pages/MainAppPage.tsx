import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/components/ui/button";
import { LogOut, Home as HomeIcon } from "lucide-react";
import HomeView from "../ui/Home";
import GlobalDashboardView from "../ui/GlobalDashboard";
import PurchaseOrderManagementView from "../ui/PurchaseOrderManagement";
import MaterialRequisitionsView from "../ui/MaterialRequisitions";
import PaymentManagementView from "../ui/PaymentManagement";
import ContractTrackingView from "../ui/ContractTracking";
import ExpenseDetailsView from "../ui/ExpenseDetails";
import { useObras } from "../core/hooks/useObras";
import { useProveedores } from "../core/hooks/useProveedores";
import { useOrdenesCompra } from "../core/hooks/useOrdenesCompra";
import { usePagos } from "../core/hooks/usePagos";
import { useRequisiciones } from "../core/hooks/useRequisiciones";
import { apiRequest } from "../core/api/client";

const DEFAULT_USER = {
  name: import.meta.env.VITE_USER_NAME || "Sistema de Gestión",
  role: (import.meta.env.VITE_USER_ROLE || "admin") as
    | "admin"
    | "residente"
    | "compras"
    | "pagos",
};

type Module =
  | "home"
  | "dashboard"
  | "requisitions"
  | "purchases"
  | "payments"
  | "contract-tracking"
  | "expense-details";

const roleConfig: Record<typeof DEFAULT_USER.role, { modules: Module[] }> = {
  admin: {
    modules: [
      "home",
      "dashboard",
      "requisitions",
      "purchases",
      "payments",
      "contract-tracking",
      "expense-details",
    ],
  },
  residente: {
    modules: ["home", "requisitions", "contract-tracking", "expense-details"],
  },
  compras: {
    modules: ["home", "purchases", "requisitions"],
  },
  pagos: {
    modules: ["home", "payments"],
  },
};

export default function MainAppPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeModule = useMemo<Module>(() => {
    switch (location.pathname) {
      case "/home":
        return "home";
      case "/dashboard":
        return "dashboard";
      case "/requisitions":
        return "requisitions";
      case "/purchases":
        return "purchases";
      case "/payments":
        return "payments";
      case "/contract-tracking":
        return "contract-tracking";
      case "/expense-details":
        return "expense-details";
      default:
        return "home";
    }
  }, [location.pathname]);

  const obras = useObras();
  const proveedores = useProveedores();
  const ordenesCompra = useOrdenesCompra();
  const pagos = usePagos();
  const requisiciones = useRequisiciones();

  const buyers = [
    {
      name: DEFAULT_USER.name,
      initials: DEFAULT_USER.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase(),
    },
  ];

  const hasAccess = (module: Module) =>
    roleConfig[DEFAULT_USER.role].modules.includes(module);

  const handleModuleChange = (module: Module) => {
    if (hasAccess(module)) {
      navigate(`/${module}`);
    }
  };

  const handleBackToHome = () => {
    setSelectedProjectId(null);
    navigate("/home");
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
    navigate("/dashboard");
  };

  const handleBackToContractTracking = () => {
    navigate("/contract-tracking");
  };

  const handleLogout = () => {
    alert("Cerrando sesión...");
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    navigate("/contract-tracking");
  };

  const handleShowExpenseDetails = () => {
    navigate("/expense-details");
  };

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

  if (activeModule === "home") {
    return (
      <HomeView
        onSelectModule={handleModuleChange}
        userRole={DEFAULT_USER.role}
        userName={DEFAULT_USER.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                <h1 className="text-lg font-bold text-white">{getModuleTitle()}</h1>
                <p className="text-xs text-slate-300">
                  Sistema de Gestión Empresarial
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-px bg-slate-500/50"></div>
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
                <p className="text-sm font-medium text-white">{DEFAULT_USER.name}</p>
                <p className="text-xs text-slate-300 capitalize">
                  {DEFAULT_USER.role === "admin"
                    ? "Administrador"
                    : DEFAULT_USER.role === "residente"
                    ? "Residente de Obra"
                    : DEFAULT_USER.role === "compras"
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

      <main>
        {activeModule === "dashboard" && (
          <GlobalDashboardView
            onSelectProject={handleSelectProject}
            obras={obras.data}
            isLoading={obras.isLoading}
            error={obras.error}
            onCreateObra={obras.create}
            onUpdateObra={obras.update}
            onAuthenticate={(password) =>
              apiRequest(\"/api/v1/auth/verify\", {
                method: \"POST\",
                body: JSON.stringify({ password }),
              })
            }
          />
        )}
        {activeModule === "contract-tracking" && (
          <ContractTrackingView
            projectId={selectedProjectId}
            obras={obras.data}
            pagos={pagos.data}
            ordenesCompra={ordenesCompra.data}
            isLoading={obras.isLoading || pagos.isLoading || ordenesCompra.isLoading}
            error={obras.error || pagos.error || ordenesCompra.error}
            onViewExpenseDetails={handleShowExpenseDetails}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
        {activeModule === "expense-details" && (
          <ExpenseDetailsView
            onBack={handleBackToContractTracking}
            ordenesCompra={ordenesCompra.data}
            pagos={pagos.data}
          />
        )}
        {activeModule === "purchases" && (
          <PurchaseOrderManagementView
            obras={obras.data}
            proveedores={proveedores.data}
            ordenesCompra={ordenesCompra.data}
            requisiciones={requisiciones.data}
            buyers={buyers}
            isLoading={
              obras.isLoading ||
              proveedores.isLoading ||
              ordenesCompra.isLoading ||
              requisiciones.isLoading
            }
            error={
              obras.error ||
              proveedores.error ||
              ordenesCompra.error ||
              requisiciones.error
            }
            onCreateOrdenCompra={ordenesCompra.create}
            onUpdateOrdenCompra={ordenesCompra.update}
            onDeleteOrdenCompra={ordenesCompra.remove}
            onAuthenticateProveedor={(password) =>
              apiRequest("/api/v1/auth/verify", {
                method: "POST",
                body: JSON.stringify({ password }),
              })
            }
          />
        )}
        {activeModule === "requisitions" && (
          <MaterialRequisitionsView
            obras={obras.data}
            requisiciones={requisiciones.data}
            isLoading={obras.isLoading || requisiciones.isLoading}
            error={obras.error || requisiciones.error}
            onCreateRequisicion={requisiciones.create}
            onUpdateRequisicion={requisiciones.update}
          />
        )}
        {activeModule === "payments" && (
          <PaymentManagementView
            ordenesCompra={ordenesCompra.data}
            pagos={pagos.data}
            proveedores={proveedores.data}
            isLoading={
              ordenesCompra.isLoading || pagos.isLoading || proveedores.isLoading
            }
            error={ordenesCompra.error || pagos.error || proveedores.error}
            onCreatePago={pagos.create}
          />
        )}
      </main>
    </div>
  );
}
