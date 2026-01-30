import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { WorkForm, Work } from "./components/WorkForm";
import {
  Building2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Plus,
  Archive,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { dataAdapter } from "@/core/data";
import type { Obra } from "@/core/data/types";

interface GlobalDashboardProps {
  onSelectProject: (projectId: string) => void;
}

const ADMIN_PASSWORD = "idpjedi01"; // En producción, esto debería estar en un backend seguro

const initialWorks: Work[] = [
  {
    code: "227",
    name: "CASTELLO E",
    client: "Desarrolladora Inmobiliaria del Centro",
    contractNumber: "CONT-2025-045",
    contractAmount: 5250000,
    advancePercentage: 30,
    retentionPercentage: 5,
    startDate: "2024-11-01",
    estimatedEndDate: "2025-06-30",
    resident: "Ing. Miguel Ángel Torres",
    residentInitials: "MAT",
    status: "Activa",
    actualBalance: 1575000,
    totalEstimates: 2100000,
    totalExpenses: 525000,
  },
];

export default function GlobalDashboard({ onSelectProject }: GlobalDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showIndirectCosts, setShowIndirectCosts] = useState(false);

  // Cargar obras desde el dataAdapter
  useEffect(() => {
    async function loadObras() {
      setLoading(true);
      try {
        const response = await dataAdapter.listObras({ estatus: 'activa' });
        if (response.success && response.data) {
          // Convertir Obra[] a Work[]
          const worksFromObras: Work[] = response.data.map((obra: Obra) => ({
            code: obra.codigo_obra,
            name: obra.nombre_obra,
            client: obra.cliente,
            contractNumber: `CONT-${obra.codigo_obra}`,
            contractAmount: obra.presupuesto_total,
            advancePercentage: 30,
            retentionPercentage: 5,
            startDate: obra.fecha_inicio || '',
            estimatedEndDate: obra.fecha_fin_estimada || '',
            resident: obra.residente || 'Sin asignar',
            residentInitials: obra.residente?.split(' ').map(n => n[0]).join('') || 'SA',
            status: obra.estatus === 'activa' ? 'Activa' as const : 'Archivada' as const,
            actualBalance: 0,
            totalEstimates: 0,
            totalExpenses: 0,
          }));
          setWorks(worksFromObras);
        }
      } catch (error) {
        console.error('Error cargando obras:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadObras();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleSaveWork = (work: Work) => {
    if (editingWork) {
      setWorks(works.map((w) => (w.code === work.code ? work : w)));
    } else {
      setWorks([...works, work]);
    }
    setEditingWork(null);
  };

  const handleArchiveWork = (code: string) => {
    if (confirm("¿Está seguro de archivar esta obra?")) {
      setWorks(
        works.map((w) =>
          w.code === code ? { ...w, status: "Archivada" as const } : w
        )
      );
    }
  };

  const handleUnarchiveWork = (code: string) => {
    setWorks(
      works.map((w) =>
        w.code === code ? { ...w, status: "Activa" as const } : w
      )
    );
  };

  const handleEditWork = (work: Work) => {
    setEditingWork(work);
    setShowWorkForm(true);
  };

  const handleUploadDestajos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí se implementará la lógica para leer el archivo Excel
      console.log("Archivo de destajos cargado:", file.name);
      alert(`Archivo "${file.name}" cargado. Función de lectura en desarrollo.`);
      // TODO: Implementar lectura de Excel con librería como xlsx
    }
  };

  const activeWorks = works.filter((w) => w.status === "Activa");
  const archivedWorks = works.filter((w) => w.status === "Archivada");
  const displayWorks = showArchived ? archivedWorks : activeWorks;

  const totalContracts = activeWorks.reduce((sum, w) => sum + w.contractAmount, 0);
  const totalBalance = activeWorks.reduce((sum, w) => sum + (w.actualBalance || 0), 0);
  const totalEstimates = activeWorks.reduce((sum, w) => sum + (w.totalEstimates || 0), 0);
  const totalExpenses = activeWorks.reduce((sum, w) => sum + (w.totalExpenses || 0), 0);

  // CÁLCULO DE GASTOS INDIRECTOS
  const indirectCostsTotal = 85000; // Monto fijo mensual de indirectos
  
  // Calcular gastos indirectos proporcionales por obra
  const worksWithIndirectCosts = activeWorks.map((work) => {
    const workExpenses = work.totalExpenses || 0;
    const proportion = totalExpenses > 0 ? workExpenses / totalExpenses : 0;
    const indirectCost = proportion * indirectCostsTotal;
    const totalWithIndirect = workExpenses + indirectCost;
    
    return {
      ...work,
      proportion: proportion * 100, // Porcentaje
      indirectCost,
      totalWithIndirect,
    };
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-slate-700">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Lock className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl">Dashboard Global Empresarial</CardTitle>
                <p className="text-slate-300 text-sm mt-1">
                  Acceso restringido - Vista ejecutiva
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña de Acceso</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Ingrese la contraseña"
                    className={authError ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {authError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {authError}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800">
                <Unlock className="h-4 w-4 mr-2" />
                Acceder
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Solo personal autorizado de dirección general
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 bg-[rgba(189,155,92,0)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-700 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
              <p className="text-muted-foreground">
                Gestión financiera global de proyectos constructivos
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="gap-2"
            >
              <Archive className="h-4 w-4" />
              {showArchived ? `Activas (${activeWorks.length})` : `Archivadas (${archivedWorks.length})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Lock className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Summary Cards - Only for Active Works */}
        {!showArchived && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Obras Activas</p>
                    <p className="text-3xl font-bold">{activeWorks.length}</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contratos Totales</p>
                    <p className="text-2xl font-bold">
                      ${(totalContracts / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saldo Real</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      ${(totalBalance / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Estimaciones</p>
                    <p className="text-2xl font-bold">
                      ${(totalEstimates / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-bold">
            {showArchived ? "Obras Archivadas" : "Obras Activas"}
          </h2>
          {!showArchived && (
            <div className="flex gap-2">
              {/* Upload Excel Destajos */}
              <label htmlFor="upload-destajos">
                <input
                  id="upload-destajos"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleUploadDestajos}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
                  onClick={() => document.getElementById('upload-destajos')?.click()}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Cargar Destajos (Excel)
                </Button>
              </label>
              
              {/* Nueva Obra Button */}
              <Button
                onClick={() => setShowWorkForm(true)}
                className="gap-2 bg-slate-700 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Nueva Obra
              </Button>
            </div>
          )}
        </div>

        {/* Indirect Costs Distribution - Only for Active Works */}
        {!showArchived && totalExpenses > 0 && (
          <div className="mb-6">
            {/* Collapsed Header Button */}
            <Button
              variant="outline"
              onClick={() => setShowIndirectCosts(!showIndirectCosts)}
              className="w-full justify-between p-4 h-auto bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:bg-orange-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">Distribución de Gastos Indirectos</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    ${indirectCostsTotal.toLocaleString()} distribuidos proporcionalmente - Click para {showIndirectCosts ? 'ocultar' : 'ver detalles'}
                  </div>
                </div>
              </div>
              {showIndirectCosts ? (
                <ChevronUp className="h-5 w-5 text-orange-700" />
              ) : (
                <ChevronDown className="h-5 w-5 text-orange-700" />
              )}
            </Button>

            {/* Expanded Content */}
            {showIndirectCosts && (
              <Card className="mt-2 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 border-t-0 rounded-t-none">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground">Total Gastos Directos</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${totalExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-orange-100 rounded-lg shadow-sm">
                        <p className="text-sm text-orange-700">Gastos Indirectos a Distribuir</p>
                        <p className="text-2xl font-bold text-orange-900">
                          ${indirectCostsTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Distribution Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-orange-300 bg-orange-100/50">
                            <th className="text-left p-3 font-semibold">Obra</th>
                            <th className="text-right p-3 font-semibold">Gastos Directos</th>
                            <th className="text-right p-3 font-semibold">% Proporción</th>
                            <th className="text-right p-3 font-semibold">Indirecto Asignado</th>
                            <th className="text-right p-3 font-semibold">Total con Indirecto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {worksWithIndirectCosts.map((work) => (
                            <tr key={work.code} className="border-b border-orange-200 hover:bg-white/50">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {work.code}
                                  </Badge>
                                  <span className="font-medium">{work.name}</span>
                                </div>
                              </td>
                              <td className="text-right p-3 font-medium">
                                ${(work.totalExpenses || 0).toLocaleString()}
                              </td>
                              <td className="text-right p-3">
                                <Badge variant="secondary" className="font-mono">
                                  {work.proportion.toFixed(2)}%
                                </Badge>
                              </td>
                              <td className="text-right p-3 font-semibold text-orange-700">
                                ${Math.round(work.indirectCost).toLocaleString()}
                              </td>
                              <td className="text-right p-3 font-bold text-orange-900">
                                ${Math.round(work.totalWithIndirect).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-orange-200 font-bold">
                            <td className="p-3">TOTALES</td>
                            <td className="text-right p-3">${totalExpenses.toLocaleString()}</td>
                            <td className="text-right p-3">100.00%</td>
                            <td className="text-right p-3 text-orange-900">
                              ${indirectCostsTotal.toLocaleString()}
                            </td>
                            <td className="text-right p-3 text-orange-900">
                              ${(totalExpenses + indirectCostsTotal).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm text-blue-900">
                        <strong>Nota:</strong> Los gastos indirectos incluyen: renta de oficina, servicios generales, 
                        personal administrativo, seguros empresariales, y otros gastos operativos que no se asignan directamente a una obra específica.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : displayWorks.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {showArchived ? "No hay obras archivadas" : "No hay obras activas"}
                  </p>
                  <p className="text-sm mt-2">
                    {!showArchived && "Comienza agregando una nueva obra al sistema"}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            displayWorks.map((work) => {
              const progress = work.contractAmount > 0
                ? ((work.totalEstimates || 0) / work.contractAmount) * 100
                : 0;

              return (
                <Card
                  key={work.code}
                  className={`hover:shadow-lg transition-shadow ${
                    work.status === "Archivada" ? "opacity-75 bg-gray-50" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono">
                            {work.code}
                          </Badge>
                          <Badge
                            variant={work.status === "Activa" ? "default" : "secondary"}
                          >
                            {work.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{work.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{work.client}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Financial Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contrato:</span>
                        <span className="font-semibold">
                          ${(work.contractAmount / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Saldo Real:</span>
                        <span className="font-semibold text-green-600">
                          ${((work.actualBalance || 0) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimaciones:</span>
                        <span className="font-semibold">
                          ${((work.totalEstimates || 0) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Avance</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Resident */}
                    <div className="pt-2 border-t text-sm">
                      <span className="text-muted-foreground">Residente: </span>
                      <span className="font-medium">{work.resident}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {work.status === "Activa" ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => onSelectProject(work.code)}
                          >
                            Abrir Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWork(work)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveWork(work.code)}
                            className="text-orange-600"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUnarchiveWork(work.code)}
                          >
                            Restaurar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectProject(work.code)}
                          >
                            Ver
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

      </div>

      {/* Work Form Modal */}
      {showWorkForm && (
        <WorkForm
          onClose={() => {
            setShowWorkForm(false);
            setEditingWork(null);
          }}
          onSave={handleSaveWork}
          editWork={editingWork}
        />
      )}
    </div>
  );
}