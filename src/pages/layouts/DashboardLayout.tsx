import { LayoutDashboard } from "lucide-react";
import ModuleLayout from "./ModuleLayout";

export default function DashboardLayout() {
  return (
    <ModuleLayout
      title="Dashboard"
      subtitle="Resumen por obra"
      navItems={[
        { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, path: "/dashboard" },
      ]}
    />
  );
}
