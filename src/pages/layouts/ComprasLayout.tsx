import { ShoppingCart, FilePlus } from "lucide-react";
import ModuleLayout from "./ModuleLayout";

export default function ComprasLayout() {
  return (
    <ModuleLayout
      title="Compras"
      subtitle="Órdenes de compra"
      navItems={[
        { label: "Órdenes", icon: <ShoppingCart className="h-4 w-4" />, path: "/compras" },
        { label: "Nueva OC", icon: <FilePlus className="h-4 w-4" />, path: "/compras/nueva" },
      ]}
    />
  );
}
