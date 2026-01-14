import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Calculator, TrendingUp, Building2, DollarSign, RefreshCw } from "lucide-react";
import { fastApiService, type CalculoDistribucionResponse } from "@/services/fastapi";

export default function DistribucionGastosIndirectos() {
  const [mes, setMes] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  });
  const [distribucion, setDistribucion] = useState<CalculoDistribucionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalcular = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await fastApiService.calcularDistribucionGastosIndirectos(mes);
      setDistribucion(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular distribución");
    } finally {
      setLoading(false);
    }
  };

  const handleObtener = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await fastApiService.obtenerDistribucionMes(mes);
      setDistribucion(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener distribución");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Distribución de Gastos Indirectos
            </h1>
            <p className="text-gray-600">
              Cálculo automático proporcional entre obras activas
            </p>
          </div>
        </div>

        {/* Controles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Mes</label>
                <input
                  type="month"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 items-end">
                <Button
                  onClick={handleCalcular}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {loading ? "Calculando..." : "Calcular Distribución"}
                </Button>
                <Button
                  onClick={handleObtener}
                  disabled={loading}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ver Distribución Guardada
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {distribucion && (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Gastos Indirectos
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${distribucion.total_gastos_indirectos.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Gastos Directos
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${distribucion.total_gastos_directos.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Obras Activas</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {distribucion.distribucion.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de distribución */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Obra
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Gastos Directos
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          % Asignado
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Indirectos Asignados
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total Obra
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {distribucion.distribucion.map((obra) => (
                        <tr key={obra.obra_id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium">{obra.obra_codigo}</div>
                              <div className="text-sm text-gray-600">
                                {obra.obra_nombre}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="font-medium text-green-600">
                              ${obra.gastos_directos.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant="outline" className="font-medium">
                              {(obra.porcentaje_asignado * 100).toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="font-medium text-purple-600">
                              ${obra.gastos_indirectos_asignados.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="font-bold text-gray-900">
                              ${obra.total_gastos_obra.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                      <tr>
                        <td className="px-4 py-4 font-bold">TOTALES</td>
                        <td className="px-4 py-4 text-right font-bold text-green-600">
                          ${distribucion.total_gastos_directos.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge className="bg-gray-700">100.00%</Badge>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-purple-600">
                          ${distribucion.total_gastos_indirectos.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-gray-900">
                          ${(
                            distribucion.total_gastos_directos +
                            distribucion.total_gastos_indirectos
                          ).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
