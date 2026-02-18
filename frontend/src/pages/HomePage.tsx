import { useNavigate } from "react-router";
import Home from "@/app/Home";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Home
      onSelectModule={(module) => {
        const map: Record<string, string> = {
          dashboard: "/dashboard",
          requisitions: "/requisiciones",
          purchases: "/compras",
          payments: "/pagos",
          destajos: "/destajos",
          warehouse: "/compras",
          personal: "/destajos/catalogo",
        };
        navigate(map[module] ?? "/");
      }}
      userRole="admin"
      userName="Sistema de Gestión"
    />
  );
}
