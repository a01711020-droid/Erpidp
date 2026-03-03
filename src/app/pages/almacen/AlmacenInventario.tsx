/**
 * ALMACÉN CENTRAL — 100% fiel a Figma
 * Header rojo/naranja, fondo beige claro, tabs OC/Inventario/Alertas, buscador + filtro obra
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft, Search, Package, ChevronRight, RefreshCw } from 'lucide-react';

interface OC {
  oc_id: string; numero_oc: string; obra_codigo: string; obra_nombre: string;
  proveedor_alias: string; fecha_entrega_esperada: string;
  tipo_entrega: string; fecha_creacion: string;
}
interface OCRes { data: OC[]; total: number; }

export default function AlmacenInventario() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'ocs' | 'inventario' | 'alertas'>('ocs');
  const [search, setSearch] = useState('');
  const [filtroObra, setFiltroObra] = useState('Todas');

  const { status, data, error, reload } = useApi<OCRes>(
    `${EP.ocs}?estatus=aprobada`,
    d => !d?.data
  );

  if (status === 'loading') return <PageLoading mensaje="Cargando almacén..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const ocs = data?.data ?? [];
  const obras = Array.from(new Set(ocs.map(o => o.obra_codigo)));
  const alertas = 0; // TODO: endpoint alertas

  const filtradas = ocs.filter(o => {
    const s = o.numero_oc.toLowerCase().includes(search.toLowerCase())
      || o.proveedor_alias.toLowerCase().includes(search.toLowerCase());
    const w = filtroObra === 'Todas' || o.obra_codigo === filtroObra;
    return s && w;
  });

  const TABS = [
    { id: 'ocs',        label: 'Órdenes de Compra' },
    { id: 'inventario', label: 'Inventario' },
    { id: 'alertas',    label: 'Alertas', badge: alertas },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#fdf5ec' }}>
      {/* Header naranja/rojo */}
      <div style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)' }} className="shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-1 bg-white/20 border-white/40 text-white hover:bg-white/30">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
          <div className="p-2 bg-white/20 rounded-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Almacén Central</h1>
            <p className="text-sm text-red-100">Control de recepción y salida de materiales</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Buscador + filtro obra */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por OC o proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-gray-50" />
          </div>
          <Select value={filtroObra} onValueChange={setFiltroObra}>
            <SelectTrigger className="w-48 bg-gray-50">
              <SelectValue placeholder="Filtrar por obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas las Obras</SelectItem>
              {obras.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border shadow-sm mb-0 grid grid-cols-3">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                tab === t.id
                  ? 'bg-orange-50 text-orange-700 border-orange-500'
                  : 'text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              {t.label}
              {(t.badge ?? 0) > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido OCs */}
        <div className="bg-white border border-t-0 rounded-b-xl shadow-sm">
          {tab === 'ocs' && (
            <>
              <div className="grid grid-cols-5 px-6 py-3 border-b bg-gray-50 text-xs font-medium text-gray-500">
                {['OC / Fecha', 'Obra', 'F. Entrega Esperada', 'Tipo', 'Acciones'].map(h => <div key={h}>{h}</div>)}
              </div>

              {filtradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-orange-300" />
                  </div>
                  <h3 className="font-semibold text-gray-600 mb-1">Sin Órdenes Pendientes</h3>
                  <p className="text-sm text-gray-400 text-center max-w-sm mb-4">
                    No hay órdenes de compra pendientes de recepción.<br />Las nuevas órdenes aprobadas aparecerán aquí.
                  </p>
                  <Button variant="outline" onClick={reload} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Actualizar Lista
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filtradas.map(o => (
                    <div key={o.oc_id} className="grid grid-cols-5 px-6 py-4 hover:bg-orange-50 cursor-pointer items-center">
                      <div>
                        <div className="font-semibold text-gray-800">{o.numero_oc}</div>
                        <div className="text-xs text-gray-400">{new Date(o.fecha_creacion).toLocaleDateString('es-MX')}</div>
                      </div>
                      <div>
                        <div className="font-medium">{o.obra_codigo}</div>
                        <div className="text-xs text-gray-400">{o.obra_nombre}</div>
                      </div>
                      <div>
                        <div className="text-sm">{new Date(o.fecha_entrega_esperada).toLocaleDateString('es-MX')}</div>
                        <div className="text-xs text-gray-400">Programada</div>
                      </div>
                      <div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded border">{o.tipo_entrega}</span>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'inventario' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Vista de inventario — próximamente</p>
            </div>
          )}

          {tab === 'alertas' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Alertas de material — próximamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
