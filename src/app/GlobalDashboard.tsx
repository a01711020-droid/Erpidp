import { ProjectCard, ProjectData } from "./components/ProjectCard";
import { Building, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";

interface GlobalDashboardProps {
  onSelectProject: (projectId: string) => void;
}

const mockProjects: ProjectData[] = [
  {
    id: "castello-e",
    name: "CASTELLO E",
    contractNumber: "CONT-2025-045",
    client: "Desarrolladora Inmobiliaria del Centro",
    status: "En proceso",
    progress: 65,
    contractAmount: 8500000,
    amountPaid: 5525000,
    startDate: "05 Ene 2025",
    endDate: "05 Ago 2025",
    currentEstimation: 4,
    totalEstimations: 6,
    pendingAmount: 534000,
  },
  {
    id: "castello-f",
    name: "CASTELLO F",
    contractNumber: "CONT-2025-052",
    client: "Grupo Constructor Metropolitano",
    status: "En tiempo",
    progress: 45,
    contractAmount: 7200000,
    amountPaid: 3240000,
    startDate: "20 Ene 2025",
    endDate: "20 Sep 2025",
    currentEstimation: 3,
    totalEstimations: 7,
    pendingAmount: 0,
  },
  {
    id: "castello-g",
    name: "CASTELLO G",
    contractNumber: "CONT-2025-078",
    client: "Gobierno del Estado de México",
    status: "En proceso",
    progress: 55,
    contractAmount: 5800000,
    amountPaid: 3190000,
    startDate: "15 Feb 2025",
    endDate: "15 Oct 2025",
    currentEstimation: 5,
    totalEstimations: 8,
    pendingAmount: 534000,
  },
  {
    id: "castello-h",
    name: "CASTELLO H",
    contractNumber: "CONT-2024-089",
    client: "Inversiones Urbanas SA de CV",
    status: "Retrasado",
    progress: 72,
    contractAmount: 9800000,
    amountPaid: 7056000,
    startDate: "10 Dic 2024",
    endDate: "10 Jul 2025",
    currentEstimation: 6,
    totalEstimations: 8,
    pendingAmount: 890000,
  },
];

export default function GlobalDashboard({ onSelectProject }: GlobalDashboardProps) {
  const totalProjects = mockProjects.length;
  const totalContractAmount = mockProjects.reduce(
    (sum, p) => sum + p.contractAmount,
    0
  );
  const totalPaid = mockProjects.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalPending = mockProjects.reduce((sum, p) => sum + p.pendingAmount, 0);
  const averageProgress =
    mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Empresarial
          </h1>
          <p className="text-muted-foreground">
            Resumen general de todas las obras en proceso
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Obras Activas
                  </p>
                  <p className="text-3xl font-bold">{totalProjects}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Monto Total Contratos
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalContractAmount)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Pagado
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Pendiente de Pago
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(totalPending)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Progreso General</h3>
              <span className="text-2xl font-bold">{averageProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Obras Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onSelectProject}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
