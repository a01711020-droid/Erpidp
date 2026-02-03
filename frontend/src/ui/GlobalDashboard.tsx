import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { apiRequest } from "../core/api/client";
import { DashboardResumen, Obra } from "../core/api/types";

interface GlobalDashboardProps {
  onSelectProject: (projectId: string) => void;
  obras: Obra[];
  isLoading: boolean;
  error: string | null;
  onCreateObra?: (obra: Partial<Obra>) => Promise<Obra> | void;
  onUpdateObra?: (id: string, obra: Partial<Obra>) => Promise<Obra> | void;
  onAuthenticate?: (password: string) => Promise<void>;
}

const mapObraToWork = (obra: Obra): Work => ({
  code: obra.codigo,
  name: obra.nombre,
  client: obra.cliente,
  contractNumber: obra.numero_contrato,
  contractAmount: obra.monto_contrato,
  advancePercentage: obra.anticipo_porcentaje,
  retentionPercentage: obra.retencion_porcentaje,
  startDate: obra.fecha_inicio,
  estimatedEndDate: obra.fecha_fin_estimada,
  resident: obra.residente_nombre,
  residentInitials: obra.residente_iniciales,
  status: obra.estado,
  actualBalance: obra.balance_actual || 0,
  totalEstimates: obra.total_estimaciones || 0,
  totalExpenses: obra.total_gastos || 0,
});

const mapWorkToObra = (work: Work): Partial<Obra> => ({
  codigo: work.code,
  nombre: work.name,
  cliente: work.client,
  numero_contrato: work.contractNumber,
  monto_contrato: work.contractAmount,
  anticipo_porcentaje: work.advancePercentage,
  retencion_porcentaje: work.retentionPercentage,
  fecha_inicio: work.startDate,
  fecha_fin_estimada: work.estimatedEndDate,
  residente_nombre: work.resident,
  residente_iniciales: work.residentInitials,
  estado: work.status,
});

export default function GlobalDashboard({
  onSelectProject,
  obras,
  isLoading,
  error,
  onCreateObra,
  onUpdateObra,
  onAuthenticate,
}: GlobalDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showIndirectCosts, setShowIndirectCosts] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [dashboardResumen, setDashboardResumen] = useState<DashboardResumen | null>(
    null
  );
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const works = useMemo(() => obras.map(mapObraToWork), [obras]);

  const filteredWorks = useMemo(() => {
    return showArchived ? works : works.filter((work) => work.status === "Activa");
  }, [showArchived, works]);

  useEffect(() => {
    const fetchResumen = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      try {
        const response = await apiRequest<DashboardResumen>("/api/v1/dashboard/resumen");
        setDashboardResumen(response);
      } catch (err) {
        setSummaryError(
          err instanceof Error ? err.message : "Error al cargar resumen"
        );
      } finally {
        setIsSummaryLoading(false);
      }
    };
    fetchResumen();
  }, [obras.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAuthenticate) {
      setAuthError("Autenticación no configurada");
      return;
    }
    setIsAuthenticating(true);
    setAuthError("");
    try {
      await onAuthenticate(password);
      setIsAuthenticated(true);
      setPassword("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Contraseña incorrecta");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleSaveWork = async (work: Work) => {
    const payload = mapWorkToObra(work);
    if (editingWork && onUpdateObra) {
      const obra = obras.find((item) => item.codigo === editingWork.code);
      if (obra) {
        await onUpdateObra(obra.id, payload);
      }
    } else if (onCreateObra) {
      await onCreateObra(payload);
    }
    setEditingWork(null);
  };

  const handleArchiveWork = async (code: string) => {
    const obra = obras.find((item) => item.codigo === code);
    if (!obra || !onUpdateObra) return;
    if (confirm("¿Está seguro de archivar esta obra?")) {
      await onUpdateObra(obra.id, { estado: "Archivada" });
    }
  };

  const handleUnarchiveWork = async (code: string) => {
    const obra = obras.find((item) => item.codigo === code);
    if (!obra || !onUpdateObra) return;
    await onUpdateObra(obra.id, { estado: "Activa" });
  };

  const handleEditWork = (work: Work) => {
    setEditingWork(work);
    setShowWorkForm(true);
  };

  const handleUploadDestajos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Archivo cargado: ${file.name}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acceso Restringido</CardTitle>
            <p className="text-muted-foreground">
              Ingrese la contraseña de administrador
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {authError && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {authError}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? "Validando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Global</h1>
            <p className="text-gray-600">Resumen general de obras activas</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              Cerrar Sesión
            </Button>
            <Button
              onClick={() => {
                setEditingWork(null);
                setShowWorkForm(true);
              }}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Nueva Obra
            </Button>
          </div>
        </div>

        {(error || summaryError) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error || summaryError}
          </div>
        )}

        {isLoading || isSummaryLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando obras...</p>
            </div>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Building2 className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No hay obras registradas
            </h2>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera obra para ver el dashboard
            </p>
            <Button
              onClick={() => {
                setEditingWork(null);
                setShowWorkForm(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Obra
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Obras Activas
                      </p>
                      <p className="text-2xl font-bold">
                        {dashboardResumen?.obras_activas ?? 0}
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Contratos
                      </p>
                      <p className="text-2xl font-bold">
                        ${
                          dashboardResumen?.total_contratado?.toLocaleString("es-MX") ??
                          "0"
                        }
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Estimaciones
                      </p>
                      <p className="text-2xl font-bold">
                        ${dashboardResumen?.total_oc?.toLocaleString("es-MX") ?? "0"}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Gastos
                      </p>
                      <p className="text-2xl font-bold">
                        ${
                          dashboardResumen?.total_pagado?.toLocaleString("es-MX") ??
                          "0"
                        }
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant={showArchived ? "default" : "outline"}
                  onClick={() => setShowArchived(!showArchived)}
                  className="gap-2"
                >
                  {showArchived ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showArchived ? "Ocultar Archivadas" : "Ver Archivadas"}
                </Button>
                <Button
                  variant={showIndirectCosts ? "default" : "outline"}
                  onClick={() => setShowIndirectCosts(!showIndirectCosts)}
                  className="gap-2"
                >
                  {showIndirectCosts ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Costos Indirectos
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <Card key={work.code} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {work.code} - {work.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {work.client}
                        </p>
                      </div>
                      <Badge
                        variant={work.status === "Activa" ? "default" : "secondary"}
                      >
                        {work.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Contrato</p>
                        <p className="font-medium">{work.contractNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monto</p>
                        <p className="font-medium">
                          ${work.contractAmount.toLocaleString("es-MX")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Residente</p>
                        <p className="font-medium">{work.resident}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Periodo</p>
                        <p className="font-medium">
                          {work.startDate} - {work.estimatedEndDate}
                        </p>
                      </div>
                    </div>

                    {showIndirectCosts && (
                      <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance</span>
                          <span className="font-medium">
                            ${work.actualBalance?.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimaciones</span>
                          <span className="font-medium">
                            ${work.totalEstimates?.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gastos</span>
                          <span className="font-medium">
                            ${work.totalExpenses?.toLocaleString("es-MX")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onSelectProject(work.code)}
                        className="flex-1 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditWork(work)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {work.status === "Activa" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleArchiveWork(work.code)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnarchiveWork(work.code)}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

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
