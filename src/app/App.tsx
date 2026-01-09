import { useState } from "react";
import GlobalDashboard from "./GlobalDashboard";
import ContractTracking from "./ContractTracking";
import ExpenseDetails from "./ExpenseDetails";
import PurchaseOrderManagement from "./PurchaseOrderManagement";
import { Button } from "./components/ui/button";
import { Home, FileText, DollarSign, ChevronLeft, ShoppingCart } from "lucide-react";

type View = "dashboard" | "contract" | "expenses" | "purchase-orders";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentView("contract");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Sistema de Gestión Financiera</h1>
              {selectedProject && currentView !== "dashboard" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/</span>
                  <span className="font-medium text-gray-900">
                    {selectedProject.toUpperCase().replace("-", " ")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {currentView !== "dashboard" && (
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Volver al Dashboard
                </Button>
              )}
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                onClick={handleBackToDashboard}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard Global
              </Button>
              {currentView !== "dashboard" && (
                <>
                  <Button
                    variant={currentView === "contract" ? "default" : "outline"}
                    onClick={() => setCurrentView("contract")}
                    className="gap-2"
                    disabled={!selectedProject}
                  >
                    <FileText className="h-4 w-4" />
                    Seguimiento de Contrato
                  </Button>
                  <Button
                    variant={currentView === "expenses" ? "default" : "outline"}
                    onClick={() => setCurrentView("expenses")}
                    className="gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Detalle de Gastos
                  </Button>
                  <Button
                    variant={currentView === "purchase-orders" ? "default" : "outline"}
                    onClick={() => setCurrentView("purchase-orders")}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Órdenes de Compra
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {currentView === "dashboard" && (
        <GlobalDashboard onSelectProject={handleSelectProject} />
      )}
      {currentView === "contract" && <ContractTracking />}
      {currentView === "expenses" && <ExpenseDetails />}
      {currentView === "purchase-orders" && <PurchaseOrderManagement />}
    </div>
  );
}