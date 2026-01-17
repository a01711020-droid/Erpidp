/**
 * COMPONENTE DE PRUEBA DEL DATA PROVIDER
 * Este componente se puede agregar temporalmente para verificar
 * que el DataProvider funciona correctamente
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Server,
  RefreshCw,
} from "lucide-react";
import { dataProvider } from "@/app/providers";
import type { Obra, Requisicion, OrdenCompra, Pago } from "@/app/providers";

export default function DataProviderTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${isError ? "❌" : "✅"} ${message}`]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults({});
    setLogs([]);
    addLog("Iniciando pruebas del DataProvider...");

    const results: Record<string, boolean> = {};

    // ========== TEST 1: Listar Obras ==========
    try {
      addLog("Test 1: Listando obras...");
      const obrasResponse = await dataProvider.obras.list({ page: 1, pageSize: 10 });
      results.test1 = obrasResponse.data.length > 0;
      addLog(`✓ Encontradas ${obrasResponse.total} obras (${obrasResponse.data.length} en página)`);
    } catch (error: any) {
      results.test1 = false;
      addLog(`Test 1 falló: ${error.message}`, true);
    }

    // ========== TEST 2: Obtener Obra por ID ==========
    try {
      addLog("Test 2: Obteniendo obra CASTELLO E...");
      const obra = await dataProvider.obras.getById("550e8400-e29b-41d4-a716-446655440000");
      results.test2 = obra.code === "227" && obra.name === "CASTELLO E";
      addLog(`✓ Obra cargada: ${obra.code} - ${obra.name}`);
    } catch (error: any) {
      results.test2 = false;
      addLog(`Test 2 falló: ${error.message}`, true);
    }

    // ========== TEST 3: Resumen Financiero ==========
    try {
      addLog("Test 3: Obteniendo resumen financiero...");
      const summary = await dataProvider.obras.getFinancialSummary(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      results.test3 = summary.contractAmount > 0;
      addLog(`✓ Contrato: $${summary.contractAmount.toLocaleString()}, Saldo: $${summary.actualBalance.toLocaleString()}`);
    } catch (error: any) {
      results.test3 = false;
      addLog(`Test 3 falló: ${error.message}`, true);
    }

    // ========== TEST 4: Listar Proveedores ==========
    try {
      addLog("Test 4: Listando proveedores...");
      const proveedoresResponse = await dataProvider.proveedores.list();
      results.test4 = proveedoresResponse.data.length >= 5;
      addLog(`✓ Encontrados ${proveedoresResponse.total} proveedores`);
    } catch (error: any) {
      results.test4 = false;
      addLog(`Test 4 falló: ${error.message}`, true);
    }

    // ========== TEST 5: Listar Requisiciones ==========
    try {
      addLog("Test 5: Listando requisiciones de obra 227...");
      const reqResponse = await dataProvider.requisiciones.list({
        filters: { obraId: "550e8400-e29b-41d4-a716-446655440000" },
      });
      results.test5 = reqResponse.data.length > 0;
      addLog(`✓ Encontradas ${reqResponse.total} requisiciones`);

      // Verificar items
      const totalItems = reqResponse.data.reduce((sum, req) => sum + req.items.length, 0);
      addLog(`  └─ Total de items en requisiciones: ${totalItems}`);
    } catch (error: any) {
      results.test5 = false;
      addLog(`Test 5 falló: ${error.message}`, true);
    }

    // ========== TEST 6: Listar Órdenes de Compra ==========
    try {
      addLog("Test 6: Listando órdenes de compra...");
      const ocResponse = await dataProvider.ordenesCompra.list({
        filters: { obraId: "550e8400-e29b-41d4-a716-446655440000" },
      });
      results.test6 = ocResponse.data.length >= 3;
      addLog(`✓ Encontradas ${ocResponse.total} órdenes de compra`);

      // Verificar relación con requisiciones
      const conRequisicion = ocResponse.data.filter((oc) => oc.requisicionId).length;
      addLog(`  └─ ${conRequisicion} OCs vinculadas a requisiciones`);
    } catch (error: any) {
      results.test6 = false;
      addLog(`Test 6 falló: ${error.message}`, true);
    }

    // ========== TEST 7: Listar Pagos ==========
    try {
      addLog("Test 7: Listando pagos...");
      const pagosResponse = await dataProvider.pagos.list({
        filters: { obraId: "550e8400-e29b-41d4-a716-446655440000" },
      });
      results.test7 = pagosResponse.data.length >= 4;
      addLog(`✓ Encontrados ${pagosResponse.total} pagos`);

      // Calcular totales
      const completados = pagosResponse.data.filter((p) => p.status === "Completado");
      const totalPagado = completados.reduce((sum, p) => sum + p.amount, 0);
      addLog(`  └─ ${completados.length} pagos completados por $${totalPagado.toLocaleString()}`);
    } catch (error: any) {
      results.test7 = false;
      addLog(`Test 7 falló: ${error.message}`, true);
    }

    // ========== TEST 8: Gastos por Categoría ==========
    try {
      addLog("Test 8: Obteniendo gastos por categoría...");
      const expenses = await dataProvider.obras.getExpensesByCategory(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      results.test8 = expenses.length > 0;
      addLog(`✓ ${expenses.length} categorías de gastos`);
      expenses.forEach((exp) => {
        addLog(`  └─ ${exp.category}: $${exp.amount.toLocaleString()} (${exp.percentage.toFixed(1)}%)`);
      });
    } catch (error: any) {
      results.test8 = false;
      addLog(`Test 8 falló: ${error.message}`, true);
    }

    // ========== TEST 9: Listar Destajos ==========
    try {
      addLog("Test 9: Listando destajos...");
      const destajosResponse = await dataProvider.destajos.list({
        filters: { obraId: "550e8400-e29b-41d4-a716-446655440000" },
      });
      results.test9 = destajosResponse.data.length >= 4;
      addLog(`✓ Encontrados ${destajosResponse.total} destajos`);
    } catch (error: any) {
      results.test9 = false;
      addLog(`Test 9 falló: ${error.message}`, true);
    }

    // ========== TEST 10: Listar Usuarios ==========
    try {
      addLog("Test 10: Listando usuarios...");
      const usuariosResponse = await dataProvider.usuarios.list();
      results.test10 = usuariosResponse.data.length >= 4;
      addLog(`✓ Encontrados ${usuariosResponse.total} usuarios`);
    } catch (error: any) {
      results.test10 = false;
      addLog(`Test 10 falló: ${error.message}`, true);
    }

    setTestResults(results);
    setLoading(false);

    const passed = Object.values(results).filter((r) => r).length;
    const total = Object.values(results).length;
    addLog(`\n🎯 Pruebas completadas: ${passed}/${total} exitosas`);
  };

  const dataMode = import.meta.env.VITE_DATA_MODE || "mock";
  const apiUrl = import.meta.env.VITE_API_URL || "No configurado";

  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter((r) => r).length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            DataProvider - Panel de Pruebas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold">Modo de Datos</p>
                <Badge variant={dataMode === "mock" ? "secondary" : "default"}>
                  {dataMode.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">API URL</p>
              <p className="text-xs text-gray-600">{apiUrl}</p>
            </div>
          </div>

          <Button
            onClick={runTests}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Ejecutando pruebas...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Ejecutar Pruebas del DataProvider
              </>
            )}
          </Button>

          {totalTests > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Resultados</p>
                <Badge
                  variant={successRate === 100 ? "default" : "destructive"}
                  className="text-lg"
                >
                  {passedTests}/{totalTests} Pruebas
                </Badge>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    successRate === 100 ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {successRate.toFixed(0)}% de éxito
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados Detallados */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detallados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(testResults).map(([test, passed]) => (
                <div
                  key={test}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium capitalize">
                    {test.replace("test", "Prueba ")}
                  </span>
                  {passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Log de Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de Mock Data */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            📊 Datos Mock - Obra CASTELLO E
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900">
          <p className="mb-2">
            El sistema está configurado con datos coherentes para 1 obra completa:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Obra:</strong> CASTELLO E (código 227) - $5,250,000 MXN
            </li>
            <li>
              <strong>Proveedores:</strong> 5 proveedores registrados
            </li>
            <li>
              <strong>Requisiciones:</strong> 4 requisiciones con 9 items totales
            </li>
            <li>
              <strong>Órdenes de Compra:</strong> 3 OCs vinculadas a requisiciones
            </li>
            <li>
              <strong>Pagos:</strong> 4 pagos (3 completados, 1 programado)
            </li>
            <li>
              <strong>Destajos:</strong> 4 trabajos en diferentes estados
            </li>
            <li>
              <strong>Usuarios:</strong> 4 usuarios del sistema
            </li>
          </ul>
          <p className="mt-3 text-xs">
            💡 Todos los datos están interrelacionados y son coherentes entre
            módulos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
