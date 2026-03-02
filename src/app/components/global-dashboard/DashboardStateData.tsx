/**
 * DASHBOARD STATE DATA
 *
 * Recibe obras reales como props — sin imports de mocks.
 * Muestra tarjetas resumen + tabla de obras activas.
 */

import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Plus,
  Archive,
  BarChart3,
} from 'lucide-react';
import type { Obra } from '@/core/data/types';

interface DashboardDataProps {
  obras: Obra[];
  onSelectProject?: (projectId: string) => void;
  onCreateWork?: () => void;
}

const ESTATUS_LABEL: Record<string, { label: string; class: string }> = {
  activa: { label: 'Activa', class: 'bg-green-50 text-green-700 border-green-300' },
  pausada: { label: 'Pausada', class: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  terminada: { label: 'Terminada', class: 'bg-slate-50 text-slate-700 border-slate-300' },
  cancelada: { label: 'Cancelada', class: 'bg-red-50 text-red-700 border-red-300' },
};

function fmt(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 0 });
}

function fmtM(n: number) {
  return `$${(n / 1_000_000).toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

export default function DashboardStateData({
  obras,
  onSelectProject,
  onCreateWork,
}: DashboardDataProps) {
  const totalPresupuesto = obras.reduce((s, o) => s + o.presupuesto_total, 0);

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
              <p className="text-muted-foreground">Gestión financiera global de proyectos constructivos</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="h-4 w-4" />
            Ver Archivadas
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Obras Activas</p>
                <p className="text-3xl font-bold">{obras.length}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <Building2 className="h-6 w-6 text-slate-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Presupuesto Total</p>
                <p className="text-3xl font-bold">{fmtM(totalPresupuesto)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Módulos activos</p>
                <p className="text-3xl font-bold">7</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Obras */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Obras Activas</h2>
              <Button size="sm" className="gap-2" onClick={onCreateWork}>
                <Plus className="h-4 w-4" />
                Nueva Obra
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 bg-gray-50">
                    {['Código', 'Nombre', 'Cliente', 'Residente', 'Presupuesto', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {obras.map((obra) => {
                    const est = ESTATUS_LABEL[obra.estatus] || ESTATUS_LABEL.activa;
                    return (
                      <tr key={obra.obra_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-semibold">{obra.codigo_obra}</td>
                        <td className="px-4 py-3 font-medium">{obra.nombre_obra}</td>
                        <td className="px-4 py-3 text-muted-foreground">{obra.cliente}</td>
                        <td className="px-4 py-3">{obra.residente || '—'}</td>
                        <td className="px-4 py-3 font-semibold">${fmt(obra.presupuesto_total)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={est.class}>{est.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectProject?.(obra.obra_id)}
                          >
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
