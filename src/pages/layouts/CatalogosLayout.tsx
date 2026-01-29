import { Building2, Users } from "lucide-react";
import ModuleLayout from "./ModuleLayout";

export default function CatalogosLayout() {
  return (
    <ModuleLayout
      title="Catálogos"
      subtitle="Gestión de obras y proveedores"
      navItems={[
        { label: "Obras", icon: <Building2 className="h-4 w-4" />, path: "/obras" },
        { label: "Proveedores", icon: <Users className="h-4 w-4" />, path: "/proveedores" },
      ]}
    />
  );
}
