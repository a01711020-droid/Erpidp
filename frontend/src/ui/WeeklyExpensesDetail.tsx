import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Users, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface WeeklyExpense {
  week: string;
  purchaseOrders: number;
  payroll: number;
  total: number;
  indirectCost?: number;
}

interface WeeklyExpensesDetailProps {
  expenses: WeeklyExpense[];
  onBack: () => void;
}


export function WeeklyExpensesDetail({ expenses, onBack }: WeeklyExpensesDetailProps) {
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleWeek = (week: string) => {
    setSelectedWeeks(prev => {
      if (prev.includes(week)) {
        return prev.filter(w => w !== week);
      } else {
        return [...prev, week];
      }
    });
  };

  const selectedWeeksData = expenses.filter(e => selectedWeeks.includes(e.week));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Desglose Detallado de Gastos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona una o varias semanas para ver el detalle y comparar
              </p>
            </div>
          </div>
          
          {selectedWeeks.length > 0 && (
            <Badge variant="default" className="text-lg px-4 py-2">
              {selectedWeeks.length} semana{selectedWeeks.length !== 1 ? 's' : ''} seleccionada{selectedWeeks.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Week Selector */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Seleccionar Semanas
            </CardTitle>
            <CardDescription>
              Marca las semanas que deseas analizar. Puedes seleccionar varias para comparar.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {expenses.map((expense) => (
                <div
                  key={expense.week}
                  onClick={() => toggleWeek(expense.week)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedWeeks.includes(expense.week)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={selectedWeeks.includes(expense.week)}
                      onCheckedChange={() => toggleWeek(expense.week)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{expense.week}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(expense.purchaseOrders + expense.payroll)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Weeks Detail */}
        {selectedWeeks.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <CheckSquare className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Selecciona al menos una semana
              </h3>
              <p className="text-sm text-muted-foreground">
                Marca las semanas arriba para ver el desglose detallado de órdenes de compra y destajos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${selectedWeeks.length === 1 ? 'grid-cols-1' : selectedWeeks.length === 2 ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {selectedWeeksData.map((weekData) => {
              const weekPOs: Array<{ code: string; supplier: string; amount: number }> = [];
              const weekDestajos: Array<{ initials: string; name: string; amount: number }> = [];

              return (
                <Card key={weekData.week} className="border-2 border-blue-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="text-base bg-blue-600">
                          {weekData.week}
                        </Badge>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWeek(weekData.week)}
                        className="hover:bg-red-100 text-red-600"
                      >
                        Quitar
                      </Button>
                    </div>
                    <CardDescription className="mt-2">
                      Desglose completo de gastos directos
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {/* Purchase Orders */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Órdenes de Compra Pagadas</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(weekData.purchaseOrders)}
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-blue-50 border-b">
                              <th className="text-left p-2 font-semibold">Código OC</th>
                              <th className="text-left p-2 font-semibold">Proveedor</th>
                              <th className="text-right p-2 font-semibold">Monto</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {weekPOs.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="p-3 text-center text-xs text-muted-foreground">
                                  Módulo pendiente de implementación
                                </td>
                              </tr>
                            ) : (
                              weekPOs.map((po, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2">
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                      {po.code}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-gray-700">{po.supplier}</td>
                                  <td className="text-right p-2 font-semibold text-blue-700">
                                    {formatCurrency(po.amount)}
                                  </td>
                                </tr>
                              ))
                            )}
                            <tr className="bg-blue-100 font-bold">
                              <td colSpan={2} className="p-2 text-xs">SUBTOTAL OCs</td>
                              <td className="text-right p-2 text-blue-900 text-xs">
                                {formatCurrency(weekData.purchaseOrders)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Destajos */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Destajos Pagados</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(weekData.payroll)}
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-green-50 border-b">
                              <th className="text-left p-2 font-semibold">Iniciales</th>
                              <th className="text-left p-2 font-semibold">Nombre</th>
                              <th className="text-right p-2 font-semibold">Importe</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {weekDestajos.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="p-3 text-center text-xs text-muted-foreground">
                                  Módulo pendiente de implementación
                                </td>
                              </tr>
                            ) : (
                              weekDestajos.map((destajo, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2">
                                    <Badge className="bg-green-600 font-mono text-[10px]">
                                      {destajo.initials}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-gray-700 font-medium">{destajo.name}</td>
                                  <td className="text-right p-2 font-semibold text-green-700">
                                    {formatCurrency(destajo.amount)}
                                  </td>
                                </tr>
                              ))
                            )}
                            <tr className="bg-green-100 font-bold">
                              <td colSpan={2} className="p-2 text-xs">SUBTOTAL DESTAJOS</td>
                              <td className="text-right p-2 text-green-900 text-xs">
                                {formatCurrency(weekData.payroll)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border-2 border-slate-300">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">OCs</p>
                          <p className="text-sm font-bold text-blue-700">
                            {formatCurrency(weekData.purchaseOrders)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Destajos</p>
                          <p className="text-sm font-bold text-green-700">
                            {formatCurrency(weekData.payroll)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Indirecto</p>
                          <p className="text-sm font-bold text-orange-700">
                            {formatCurrency(weekData.indirectCost || 0)}
                          </p>
                        </div>
                        <div className="bg-slate-200 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground mb-1">TOTAL</p>
                          <p className="text-base font-bold text-gray-900">
                            {formatCurrency(
                              weekData.purchaseOrders + 
                              weekData.payroll + 
                              (weekData.indirectCost || 0)
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
