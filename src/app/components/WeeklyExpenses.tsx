import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShoppingCart, Users } from "lucide-react";

interface WeeklyExpense {
  week: string;
  purchaseOrders: number;
  payroll: number;
  total: number;
}

interface WeeklyExpensesProps {
  expenses: WeeklyExpense[];
}

export function WeeklyExpenses({ expenses }: WeeklyExpensesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPurchaseOrders = expenses.reduce((sum, e) => sum + e.purchaseOrders, 0);
  const totalPayroll = expenses.reduce((sum, e) => sum + e.payroll, 0);
  const totalExpenses = totalPurchaseOrders + totalPayroll;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Órdenes de Compra</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPurchaseOrders)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Destajos</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Salidas</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Salidas Semanales</CardTitle>
          <CardDescription>Desglose de órdenes de compra y destajos por semana</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="purchaseOrders" 
                fill="#3b82f6" 
                name="Órdenes de Compra"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="payroll" 
                fill="#10b981" 
                name="Destajos"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}