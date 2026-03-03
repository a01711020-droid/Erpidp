/**
 * GLOBAL DASHBOARD — Estado vacío y con datos 100% fiel a Figma imagen 2
 * Fondo beige, 4 KPIs con iconos grises, tabla con empty state central
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api, ApiError, EP, useApi } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Archive, Plus, Building2, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

interface Obra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  residente: string | null;
  presupuesto_total: number;
  avance_pct: number;
  saldo: number;
  estatus: 'activa' | 'pausada' | 'terminada' | 'cancelada';
}

interface ObrasRes { data: Obra[]; total: number; }

const ESTATUS_CLS: Record<string, string> = {
  activa:    'bg-green-50 text-green-700 border-green-200',
  pausada:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  terminada: 'bg-slate-50 text-slate-600 border-slate-200',
  cancelada: 'bg-red-50 text-red-600 border-red-200',
};

function fmtM(n: number) { return `$${(n/1_000_000).toFixed(1)} M`; }
function fmtPct(n: number) { return `${n.toFixed(0)}%`; }

export default function GlobalDashboard() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<ObrasRes>(`${EP.obras}?estatus=activa`, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando obras..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const obras = data?.data ?? [];
  const totalContrato = obras.reduce((s, o) => s + o.presupuesto_total, 0);
  const totalSaldo    = obras.reduce((s, o) => s + o.saldo, 0);
  const avanceGlobal  = obras.length ? obras.reduce((s, o) => s + o.avance_pct, 0) / obras.length : 0;

  const kpis = [
    { label: 'Obras Activas',      value: obras.length,        Icon: Building2,  },
    { label: 'Contratos Totales',  value: fmtM(totalContrato), Icon: DollarSign, },
    { label: 'Saldo Global',       value: fmtM(totalSaldo),    Icon: TrendingUp, },
    { label: 'Avance Global',      value: fmtPct(avanceGlobal),Icon: BarChart2,  },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f0ece6' }}>
      {/* Barra volver */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Inicio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-700 rounded-xl">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
              <p className="text-muted-foreground text-sm">Gestión financiera global de proyectos constructivos</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-slate-600">
            <Archive className="h-4 w-4" /> Ver Archivadas ({obras.filter(o=>o.estatus!=='activa').length})
          </Button>
        </div>

        {/* KPIs — igual a Figma: borde, fondo blanco, icono gris derecha */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm text-gray-400 mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className="h-8 w-8 text-gray-200" />
            </div>
          ))}
        </div>

        {/* Card principal — tabla */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h2 className="text-xl font-bold text-gray-900">Obras Activas</h2>
            <Button className="gap-2 bg-slate-800 hover:bg-slate-900" size="sm">
              <Plus className="h-4 w-4" /> Nueva Obra
            </Button>
          </div>

          {obras.length === 0 ? (
            /* Empty state fiel a Figma: ícono gris, texto centrado, botón outline */
            <>
              {/* Cabeceras igual que cuando hay datos */}
              <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {['Código','Nombre de la Obra','Residente','Contrato','Saldo','Avance','Estado','Acciones'].map(h=><div key={h}>{h}</div>)}
              </div>
              <div className="flex flex-col items-center justify-center py-20">
                <Building2 className="h-16 w-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">No hay obras registradas</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm mb-6">
                  Comienza registrando tu primera obra para llevar el control financiero y operativo.
                </p>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Registrar Primera Obra
                </Button>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {['Código','Nombre de la Obra','Residente','Contrato','Saldo','Avance','Estado','Acciones'].map(h=>(
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {obras.map(o => (
                    <tr key={o.obra_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-mono font-semibold text-slate-700">{o.codigo_obra}</td>
                      <td className="px-4 py-4 font-medium">{o.nombre_obra}</td>
                      <td className="px-4 py-4 text-gray-500">{o.residente ?? '—'}</td>
                      <td className="px-4 py-4 font-semibold">{fmtM(o.presupuesto_total)}</td>
                      <td className="px-4 py-4">{fmtM(o.saldo)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${o.avance_pct}%` }} />
                          </div>
                          <span className="text-xs">{fmtPct(o.avance_pct)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded border capitalize ${ESTATUS_CLS[o.estatus]}`}>{o.estatus}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/obras/${o.codigo_obra}`)}>Ver</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
