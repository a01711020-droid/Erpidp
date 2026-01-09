import { PurchaseOrdersTable } from "./components/PurchaseOrdersTable";
import { DestajosTable } from "./components/DestajosTable";

export default function ExpenseDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de Gastos
          </h1>
          <p className="text-muted-foreground">
            Información detallada de Órdenes de Compra y Destajos
          </p>
        </div>

        {/* Purchase Orders Table */}
        <PurchaseOrdersTable />

        {/* Destajos Table */}
        <DestajosTable />
      </div>
    </div>
  );
}
