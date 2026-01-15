import { Button } from "./ui/button";
import { Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const logoIdp = "/logo-idp.svg";

interface ModuleHeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  showBackButton?: boolean;
}

export default function ModuleHeader({ 
  title, 
  userName = "Sistema de Gestión",
  userRole = "admin",
  showBackButton = true 
}: ModuleHeaderProps) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Aquí iría la lógica de cierre de sesión
    alert("Cerrando sesión...");
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrador";
      case "residente":
        return "Residente de Obra";
      case "compras":
        return "Departamento de Compras";
      case "pagos":
        return "Departamento de Pagos";
      default:
        return "Usuario";
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-xl">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img
              src={logoIdp}
              alt="IDP Construcción"
              className="h-14 w-auto cursor-pointer"
              onClick={handleBackToHome}
            />
            <div className="h-10 w-px bg-slate-500/50"></div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {title}
              </h1>
              <p className="text-xs text-slate-300">
                Sistema de Gestión Empresarial
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Home className="h-4 w-4" />
                Volver al Inicio
              </Button>
            )}
            <div className="h-10 w-px bg-slate-500/50"></div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {userName}
              </p>
              <p className="text-xs text-slate-300 capitalize">
                {getRoleLabel()}
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
  );
}
