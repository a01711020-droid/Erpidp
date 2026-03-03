/**
 * GLOBAL DASHBOARD
 *
 * Conectado al backend real via api client.
 * Estados: loading → error → empty → data
 * Diseño 100% fiel a Figma.
 */

import { useState, useEffect } from 'react';
import { api, ApiError, EP } from '@/core/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Building2,
  DollarSign,
  BarChart3,
  Plus,
  Archive,
  AlertCircle,
  RefreshCw,
  Loader2,
  Target,
  TrendingUp,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Obra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  cliente: string;
  residente: string | null;
  presupuesto_total: number;
  estatus: 'activa' | 'pausada' | 'terminada' | 'cancelada';
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
}

interface ObrasResponse {
  data: Obra[];
  total: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ESTATUS_STYLE: Record<string, { label: string; cls: string }> = {
  activa:    { label: 'Activa',    cls: 'bg-green-50 text-green-700 border-green-300' },
  pausada:   { label: 'Pausada',   cls: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  terminada: { label: 'Terminada', cls: 'bg-slate-50 text-slate-700 border-slate-300' },
  cancelada: { label: 'Cancelada', cls: 'bg-red-50 text-red-700 border-red-300' },
};

function fmtPesos(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 0 });
}

function fmtMillones(n: number) {
  return `$${(n / 1_000_000).toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

// ─── Estado: Loading ─────────────────────────────────────────────────────────

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-slate-600 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando obras...</p>
      </div>
    </div>
  );
}

// ─── Estado: Error ───────────────────────────────────────────────────────────

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-3 bg-slate-700 rounded-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
            <p className="text-muted-foreground">Gestión financiera global de proyectos constructivos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar obras</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">{message}</p>
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Estado: Vacío ───────────────────────────────────────────────────────────

function DashboardEmpty({ onCrear }: { onCrear: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header igual a cuando hay datos */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-3 bg-slate-700 rounded-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
            <p className="text-muted-foreground">Gestión financiera global de proyectos constructivos</p>
          </div>
        </div>

        {/* Cards en cero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Obras Activas',      value: '0',   icon: Building2,  bg: 'bg-slate-100',  ic: 'text-slate-600' },
            { label: 'Presupuesto Total',  value: '$0',  icon: DollarSign, bg: 'bg-blue-100',   ic: 'text-blue-600'  },
            { label: 'Módulos activos',    value: '7',   icon: BarChart3,  bg: 'bg-purple-100', ic: 'text-purple-600'},
          ].map(({ label, value, icon: Icon, bg, ic }) => (
            <Card key={label}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-400">{value}</p>
                </div>
                <div className={`p-3 ${bg} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${ic}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action central */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center bg-slate-50">
          <div className="inline-flex p-4 bg-slate-100 rounded-full mb-6">
            <Building2 className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No hay obras registradas</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Comienza registrando tu primera obra para llevar el control financiero
            y operativo de todos tus proyectos constructivos.
          </p>
          <Button size="lg" className="gap-2 bg-slate-700 hover:bg-slate-800" onClick={onCrear}>
            <Plus className="h-5 w-5" />
            Crear Primera Obra
          </Button>

          {/* Beneficios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-left">
            {[
              { icon: DollarSign, title: 'Control Financiero',      desc: 'Monitorea contratos, estimaciones y gastos en tiempo real',      bg: 'bg-green-100',  ic: 'text-green-600'  },
              { icon: BarChart3,  title: 'Reportes Consolidados',   desc: 'Vista ejecutiva de todas tus obras con métricas clave',         bg: 'bg-blue-100',   ic: 'text-blue-600'   },
              { icon: Target,     title: 'Seguimiento de Avance',   desc: 'Compara avance financiero vs físico en cada proyecto',          bg: 'bg-purple-100', ic: 'text-purple-600' },
              { icon: AlertCircle,title: 'Alertas Automáticas',     desc: 'Detecta desviaciones y problemas de forma temprana',           bg: 'bg-orange-100', ic: 'text-orange-600' },
            ].map(({ icon: Icon, title, desc, bg, ic }) => (
              <div key={title} className="flex gap-3">
                <div className={`p-2 ${bg} rounded-lg h-fit`}>
                  <Icon className={`h-5 w-5 ${ic}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Estado: Con datos ────────────────────────────────────────────────────────

function DashboardData({
  obras,
  onCrear,
  onSeleccionar,
}: {
  obras: Obra[];
  onCrear: () => void;
  onSeleccionar?: (id: string) => void;
}) {
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

        {/* Cards resumen */}
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
                <p className="text-3xl font-bold">{fmtMillones(totalPresupuesto)}</p>
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

        {/* Tabla */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Obras Activas</h2>
              <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800" onClick={onCrear}>
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
                  {obras.map(obra => {
                    const est = ESTATUS_STYLE[obra.estatus] ?? ESTATUS_STYLE.activa;
                    return (
                      <tr key={obra.obra_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-semibold">{obra.codigo_obra}</td>
                        <td className="px-4 py-3 font-medium">{obra.nombre_obra}</td>
                        <td className="px-4 py-3 text-muted-foreground">{obra.cliente}</td>
                        <td className="px-4 py-3">{obra.residente ?? '—'}</td>
                        <td className="px-4 py-3 font-semibold">${fmtPesos(obra.presupuesto_total)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={est.cls}>{est.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => onSeleccionar?.(obra.obra_id)}>
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

// ─── Componente principal ─────────────────────────────────────────────────────

interface Props {
  onSelectProject?: (id: string) => void;
}

export default function GlobalDashboard({ onSelectProject }: Props) {
  const [obras, setObras]   = useState<Obra[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError]   = useState<string>('');

  async function cargar() {
    setStatus('loading');
    try {
      const res = await api.get<ObrasResponse>(`${EP.obras}?estatus=activa`);
      const data = res.data ?? [];
      setObras(data);
      setStatus(data.length === 0 ? 'empty' : 'data');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error inesperado');
      setStatus('error');
    }
  }

  useEffect(() => { cargar(); }, []);

  // TODO: abrir modal real de creación cuando esté el endpoint POST /obras
  const handleCrear = () => console.log('TODO: modal crear obra');

  if (status === 'loading') return <DashboardLoading />;
  if (status === 'error')   return <DashboardError message={error} onRetry={cargar} />;
  if (status === 'empty')   return <DashboardEmpty onCrear={handleCrear} />;
  return <DashboardData obras={obras} onCrear={handleCrear} onSeleccionar={onSelectProject} />;
}
