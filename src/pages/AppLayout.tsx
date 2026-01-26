import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../ui/layout/AppShell";
import { Toaster } from "../ui/primitives/sonner";
import {
  Home,
  Building2,
  Users,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const titleByPath: Record<string, string> = {
  "/": "Inicio",
  "/obras": "Obras",
  "/proveedores": "Proveedores",
  "/compras/ordenes-compra": "Órdenes de Compra",
  "/pagos": "Pagos",
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const title = titleByPath[currentPath] || "Sistema";

  const navItems = [
    {
      label: "Inicio",
      icon: <Home className="h-4 w-4" />,
      active: currentPath === "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Obras",
      icon: <Building2 className="h-4 w-4" />,
      active: currentPath.startsWith("/obras"),
      onClick: () => navigate("/obras"),
    },
    {
      label: "Proveedores",
      icon: <Users className="h-4 w-4" />,
      active: currentPath.startsWith("/proveedores"),
      onClick: () => navigate("/proveedores"),
    },
    {
      label: "Órdenes",
      icon: <ShoppingCart className="h-4 w-4" />,
      active: currentPath.startsWith("/compras/ordenes-compra"),
      onClick: () => navigate("/compras/ordenes-compra"),
    },
    {
      label: "Pagos",
      icon: <CreditCard className="h-4 w-4" />,
      active: currentPath.startsWith("/pagos"),
      onClick: () => navigate("/pagos"),
    },
  ];

  return (
    <AppShell title={title} subtitle="Sistema de Gestión Empresarial" navItems={navItems}>
      <Toaster />
      <Outlet />
    </AppShell>
  );
}
