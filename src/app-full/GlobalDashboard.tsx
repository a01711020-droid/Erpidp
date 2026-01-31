/**
 * GLOBAL DASHBOARD - VERSIÓN FULL
 * Sistema con 7 obras mock completas
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Building2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Plus,
  Edit,
  Archive,
} from "lucide-react";

interface GlobalDashboardProps {
  onSelectProject: (projectId: string) => void;
}

// DATOS MOCK COMPLETOS - 7 obras
const mockWorks = [
  {
    code: "227",
    name: "CASTELLO E - Tláhuac",
    client: "Desarrolladora Inmobiliaria del Centro",
    contractAmount: 5250000,
    actualBalance: 1575000,
    totalEstimates: 2100000,
    totalExpenses: 525000,
    resident: "Ing. Miguel Ángel Torres",
    status: "Activa" as const,
  },
  {
    code: "228",
    name: "TORRE MILENIO - Ecatepec",
    client: "Constructora del Valle SA",
    contractAmount: 8900000,
    actualBalance: 2670000,
    totalEstimates: 3560000,
    totalExpenses: 890000,
    resident: "Arq. Laura Hernández",
    status: "Activa" as const,
  },
  {
    code: "229",
    name: "RESIDENCIAL BOSQUES - Xochimilco",
    client: "Inmobiliaria Bosques Verdes",
    contractAmount: 12500000,
    actualBalance: 3750000,
    totalEstimates: 5000000,
    totalExpenses: 1250000,
    resident: "Ing. Carlos Mendoza",
    status: "Activa" as const,
  },
  {
    code: "230",
    name: "PLAZA INSURGENTES - Iztapalapa",
    client: "Grupo Comercial MX",
    contractAmount: 6700000,
    actualBalance: 2010000,
    totalEstimates: 2680000,
    totalExpenses: 670000,
    resident: "Ing. Roberto Sánchez",
    status: "Activa" as const,
  },
  {
    code: "231",
    name: "CONDOMINIO VALLE - Naucalpan",
    client: "Desarrollos Metropolitanos",
    contractAmount: 9200000,
    actualBalance: 2760000,
    totalEstimates: 3680000,
    totalExpenses: 920000,
    resident: "Arq. Patricia Gómez",
    status: "Activa" as const,
  },
  {
    code: "232",
    name: "CORPORATIVO REFORMA - Cuauhtémoc",
    client: "Corporativo Nacional",
    contractAmount: 15800000,
    actualBalance: 4740000,
    totalEstimates: 6320000,
    totalExpenses: 1580000,
    resident: "Ing. Fernando Ruiz",
    status: "Activa" as const,
  },
  {
    code: "233",
    name: "HOTEL GRAND - Benito Juárez",
    client: "Hotelera Premium SA",
    contractAmount: 11200000,
    actualBalance: 3360000,
    totalEstimates: 4480000,
    totalExpenses: 1120000,
    resident: "Arq. Mónica Flores",
    status: "Activa" as const,
  },
];

export default function GlobalDashboard({ onSelectProject }: GlobalDashboardProps) {
  const [showArchived, setShowArchived] = useState(false);

  const activeWorks = mockWorks;
  const totalContracts = activeWorks.reduce((sum, w) => sum + w.contractAmount, 0);
  const totalBalance = activeWorks.reduce((sum, w) => sum + w.actualBalance, 0);
  const totalEstimates = activeWorks.reduce((sum, w) => sum + w.totalEstimates, 0);
  const totalExpenses = activeWorks.reduce((sum, w) => sum + w.totalExpenses, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Archive className="h-4 w-4" />
            Ver Archivadas (0)
          </Button>
        </div>

        {/* Summary Cards */}
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

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Obras Activas</h2>
          <Button className="gap-2 bg-slate-700 hover:bg-slate-800">
            <Plus className="h-4 w-4" />
            Nueva Obra
          </Button>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeWorks.map((work) => {
            const progress = work.contractAmount > 0
              ? (work.totalEstimates / work.contractAmount) * 100
              : 0;

            return (
              <Card key={work.code} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono">
                          {work.code}
                        </Badge>
                        <Badge variant="default">
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
                        ${(work.actualBalance / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimaciones:</span>
                      <span className="font-semibold">
                        ${(work.totalEstimates / 1000000).toFixed(2)}M
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
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => onSelectProject(work.code)}
                    >
                      Abrir Dashboard
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-orange-600">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
