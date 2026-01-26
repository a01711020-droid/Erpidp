import { CreditCard } from "lucide-react";
import ModuleLayout from "./ModuleLayout";

export default function PagosLayout() {
  return (
    <ModuleLayout
      title="Pagos"
      subtitle="Gestión de pagos"
      navItems={[
        { label: "Pagos", icon: <CreditCard className="h-4 w-4" />, path: "/pagos" },
      ]}
      guard={{
        storageKey: "pin:pagos",
        title: "Acceso a Pagos",
      }}
    />
  );
}
