import { useNavigate } from "react-router-dom";
import HomeView from "@/ui/home/HomeView";

const currentUser = {
  name: "Sistema de Gestión",
  role: "admin" as const,
};

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelectModule = (module: string) => {
    switch (module) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "obras":
        navigate("/obras");
        break;
      case "proveedores":
        navigate("/proveedores");
        break;
      case "purchases":
        navigate("/compras/ordenes-compra");
        break;
      case "payments":
        navigate("/pagos");
        break;
      case "requisitions":
        navigate("/requisiciones");
        break;
      default:
        break;
    }
  };

  return (
    <HomeView
      onSelectModule={handleSelectModule}
      userRole={currentUser.role}
      userName={currentUser.name}
    />
  );
}
