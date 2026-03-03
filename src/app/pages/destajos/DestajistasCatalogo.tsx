/**
 * DESTAJOS — Control de Destajos
 * UI 100% fiel a Figma: header negro, buscador, grid de cards por obra (teal cuando hay datos)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, HardHat, Search, Building2, Users } from 'lucide-react';

interface ObraDestajo {
  obra_id: string; codigo_obra: string; nombre_obra: string;
  num_lotes: number; total_pagado: number; pagado_semana: number;
}
interface ObrasRes { data: ObraDestajo[]; total: number; }

function fmtM(n: number) {
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString('es-MX')}`;
}

export default function DestajistasCatalogo() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<ObrasRes>(
    `${EP.obras}?estatus=activa`,
    d => !d?.data
  );
  const [search, setSearch] = useState('');

  if (status === 'loading') return <PageLoading mensaje="Cargando destajos..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const obras = data?.data ?? [];
  const filtradas = obras.filter(o =>
    o.nombre_obra.toLowerCase().includes(search.toLowerCase())
    || o.codigo_obra.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header negro */}
      <div className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white p-1">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="p-2 bg-blue-500 rounded-lg">
              <HardHat className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Control de Destajos</h1>
              <p className="text-sm text-gray-400">Gestión de avances y pagos por obra</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <Building2 className="h-4 w-4" /> Resumen General
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4" /> Gestión de Destajistas
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Buscador + contador obras */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar obra..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{obras.length} obras activas</span>
          </div>
        </div>

        {/* Grid de obras o empty state */}
        {filtradas.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <HardHat className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">No hay obras asignadas</h3>
              <p className="text-sm text-gray-400 text-center max-w-sm mb-6">
                Las obras se gestionan desde el Dashboard General. Una vez creadas, aparecerán aquí para gestionar sus destajos.
              </p>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
                + Crear Nueva Obra
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtradas.map(obra => (
              <div key={obra.obra_id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 leading-tight">{obra.nombre_obra}</h3>
                    <p className="text-sm text-gray-400 mt-1">{obra.codigo_obra}</p>
                  </div>
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Número de Lotes:</span>
                    <span className="font-semibold">{obra.num_lotes ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Pagado:</span>
                    <span className="font-semibold text-blue-600">{fmtM(obra.total_pagado ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pagado esta Semana:</span>
                    <span className="font-semibold text-blue-600">${(obra.pagado_semana ?? 0).toLocaleString('es-MX')}</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                  Ver Detalle
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
