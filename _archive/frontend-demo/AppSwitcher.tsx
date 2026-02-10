/**
 * APP SWITCHER - Sistema integrado con toggle de 3 estados
 * Muestra botones Verde/Naranja/Azul para módulos con toggle
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Database, DatabaseZap, Loader2 } from "lucide-react";

// Import módulos REALES del sistema
import GlobalDashboard from "@/app/GlobalDashboard";
import Home from "@/app/Home";
import ContractTracking from "@/app/ContractTracking";
import ExpenseDetails from "@/app/ExpenseDetails";
import SupplierManagement from "@/app/SupplierManagement";

// Módulos con 3 estados
import PurchaseOrderManagementFull from "@/app/PurchaseOrderManagement";
import MaterialRequisitionsFull from "@/app/MaterialRequisitions";
import PaymentManagementFull from "@/app/PaymentManagement";

// Empty states (crearemos estos)
import PurchaseOrderManagementEmpty from "@/app-empty/PurchaseOrderManagement";
import MaterialRequisitionsEmpty from "@/app-empty/MaterialRequisitions";
import PaymentManagementEmpty from "@/app-empty/PaymentManagement";
import GlobalDashboardEmpty from "@/app-empty/GlobalDashboard";
import ContractTrackingEmpty from "@/app-empty/ContractTracking";

// Loading states (crearemos estos)
import PurchaseOrderManagementLoading from "@/app-loading/PurchaseOrderManagement";
import MaterialRequisitionsLoading from "@/app-loading/MaterialRequisitions";
import PaymentManagementLoading from "@/app-loading/PaymentManagement";
import GlobalDashboardLoading from "@/app-loading/GlobalDashboard";
import ContractTrackingLoading from "@/app-loading/ContractTracking";

type AppMode = "full" | "empty" | "loading";

type Module = 
  | "home" 
  | "dashboard" 
  | "purchases"
  | "requisitions" 
  | "payments" 
  | "contract-tracking"
  | "expense-details"
  | "supplier-management";

export default function AppSwitcher() {
  const [mode, setMode] = useState<AppMode>("full");
  const [activeModule, setActiveModule] = useState<Module>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [previousModule, setPreviousModule] = useState<Module | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveModule("contract-tracking");
  };

  const handleBackToHome = () => {
    setActiveModule("home");
    setSelectedProjectId(null);
  };

  const handleBackToDashboard = () => {
    setActiveModule("dashboard");
    setSelectedProjectId(null);
  };

  const handleViewExpenseDetails = () => {
    setActiveModule("expense-details");
  };

  const handleBackToContractTracking = () => {
    setActiveModule("contract-tracking");
  };

  // Módulos que tienen toggle (3 estados)
  const modulesWithToggle = ["purchases", "requisitions", "payments", "dashboard", "contract-tracking"];
  const showToggle = modulesWithToggle.includes(activeModule);

  // Determine back button behavior
  const getBackButton = () => {
    if (activeModule === "dashboard") {
      return { label: "Volver al Inicio", onClick: handleBackToHome };
    }
    if (activeModule === "contract-tracking") {
      return { label: "Volver al Dashboard", onClick: handleBackToDashboard };
    }
    // Default for purchases, requisitions, payments
    return { label: "Volver al Inicio", onClick: handleBackToHome };
  };

  const backButton = getBackButton();

  const renderModule = () => {
    // Home - NO tiene toggle
    if (activeModule === "home") {
      return (
        <Home
          onSelectModule={(mod) => {
            const moduleMap: Record<string, Module> = {
              "dashboard": "dashboard",
              "requisitions": "requisitions",
              "purchases": "purchases",
              "payments": "payments",
            };
            const mappedModule = moduleMap[mod];
            if (mappedModule) {
              setActiveModule(mappedModule);
            }
          }}
          userRole="admin"
          userName="Sistema de Gestión"
        />
      );
    }

    // Dashboard Global - CON TOGGLE
    if (activeModule === "dashboard") {
      if (mode === "full") {
        return <GlobalDashboard onSelectProject={handleSelectProject} />;
      }
      if (mode === "empty") {
        return <GlobalDashboardEmpty />;
      }
      if (mode === "loading") {
        return <GlobalDashboardLoading />;
      }
    }

    // Contract Tracking - CON TOGGLE
    if (activeModule === "contract-tracking") {
      if (mode === "full") {
        return <ContractTracking projectId={selectedProjectId} />;
      }
      if (mode === "empty") {
        return <ContractTrackingEmpty projectId={selectedProjectId} />;
      }
      if (mode === "loading") {
        return <ContractTrackingLoading projectId={selectedProjectId} />;
      }
    }

    // Expense Details - NO tiene toggle
    if (activeModule === "expense-details") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToContractTracking}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Seguimiento
              </Button>
            </div>
          </div>
          <ExpenseDetails />
        </div>
      );
    }

    // Supplier Management - NO tiene toggle
    if (activeModule === "supplier-management") {
      return (
        <SupplierManagement 
          onBack={() => {
            if (previousModule === "purchases") {
              setActiveModule("purchases");
              setPreviousModule(null);
            } else {
              handleBackToHome();
            }
          }}
        />
      );
    }

    // Purchases (Órdenes de Compra) - CON TOGGLE
    if (activeModule === "purchases") {
      if (mode === "full") return <PurchaseOrderManagementFull onNavigateToSuppliers={() => {
        setPreviousModule("purchases");
        setActiveModule("supplier-management");
      }} />;
      if (mode === "empty") return <PurchaseOrderManagementEmpty />;
      if (mode === "loading") return <PurchaseOrderManagementLoading />;
    }

    // Requisitions (Requisiciones) - CON TOGGLE
    if (activeModule === "requisitions") {
      if (mode === "full") return <MaterialRequisitionsFull />;
      if (mode === "empty") return <MaterialRequisitionsEmpty />;
      if (mode === "loading") return <MaterialRequisitionsLoading />;
    }

    // Payments (Pagos) - CON TOGGLE
    if (activeModule === "payments") {
      if (mode === "full") return <PaymentManagementFull />;
      if (mode === "empty") return <PaymentManagementEmpty />;
      if (mode === "loading") return <PaymentManagementLoading />;
    }

    return null;
  };

  const modes = [
    {
      value: "full" as AppMode,
      label: "Con Datos",
      icon: <Database className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      value: "empty" as AppMode,
      label: "Sin Datos",
      icon: <DatabaseZap className="h-5 w-5" />,
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      value: "loading" as AppMode,
      label: "Cargando",
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toggle Header - Solo para módulos con toggle */}
      {showToggle && (
        <div className="sticky top-0 z-50 bg-white border-b shadow-md">
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Left: Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={backButton.onClick}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backButton.label}
              </Button>

              {/* Right: Mode Toggle Buttons */}
              <div className="flex items-center gap-2">
                {modes.map((modeOption) => (
                  <Button
                    key={modeOption.value}
                    variant={mode === modeOption.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode(modeOption.value)}
                    className={`gap-2 ${
                      mode === modeOption.value ? modeOption.color : ""
                    }`}
                  >
                    {modeOption.icon}
                    {modeOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderModule()}
    </div>
  );
}