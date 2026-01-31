import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Home as HomeIcon, LogOut } from "lucide-react";

const currentUser = {
  name: "Sistema de Gestión",
  role: "admin" as const,
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    alert("Cerrando sesión...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isHome && (
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
                    Sistema de Gestión Empresarial
                  </h1>
                  <p className="text-xs text-slate-300">IDP Construcción</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
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
      )}
      <Outlet />
    </div>
  );
}
