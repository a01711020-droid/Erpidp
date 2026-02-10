import { PurchaseOrdersTable } from "@/ui/PurchaseOrdersTable";
import { DestajosTable } from "@/ui/DestajosTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useDestajos, usePagos } from "@/core/hooks/useEntities";

export default function ExpenseDetails() {
  const pagosQuery = usePagos();
  const destajosQuery = useDestajos();

  const totalPurchaseOrders = pagosQuery.data.reduce(
    (sum, pago) => sum + Number(pago.monto),
    0
  );
  const totalDestajos = destajosQuery.data.reduce(
    (sum, destajo) => sum + Number(destajo.monto),
    0
  );
  const totalExpenses = totalPurchaseOrders + totalDestajos;

  const weeklyExpenses = [
    ...pagosQuery.data.map((pago) => ({
      week: pago.fechaProgramada || pago.fechaPago || "Sin fecha",
      purchaseOrders: Number(pago.monto),
      destajos: 0,
      total: Number(pago.monto),
    })),
    ...destajosQuery.data.map((destajo) => ({
      week: destajo.semana,
      purchaseOrders: 0,
      destajos: Number(destajo.monto),
      total: Number(destajo.monto),
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Detalle de Gastos</h1>
          <p className="text-muted-foreground">
            Información detallada de Órdenes de Compra y Destajos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Órdenes de Compra</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${totalPurchaseOrders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Destajos</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ${totalDestajos.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total General</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Gastos Semanales por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left p-3 font-semibold">Periodo</th>
                    <th className="text-right p-3 font-semibold text-blue-700">Órdenes de Compra</th>
                    <th className="text-right p-3 font-semibold text-purple-700">Destajos</th>
                    <th className="text-right p-3 font-semibold">Total Semanal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {weeklyExpenses.map((expense, index) => (
                    <tr key={`${expense.week}-${index}`} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{expense.week}</td>
                      <td className="text-right p-3 text-blue-700">
                        ${expense.purchaseOrders.toLocaleString()}
                      </td>
                      <td className="text-right p-3 text-purple-700">
                        ${expense.destajos.toLocaleString()}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${expense.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td className="p-3">TOTALES</td>
                    <td className="text-right p-3 text-blue-700">${totalPurchaseOrders.toLocaleString()}</td>
                    <td className="text-right p-3 text-purple-700">${totalDestajos.toLocaleString()}</td>
                    <td className="text-right p-3 text-emerald-700">${totalExpenses.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <PurchaseOrdersTable />
        <DestajosTable />
      </div>
    </div>
  );
}
