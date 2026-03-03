/**
 * COMPRAS — 100% fiel a Figma
 * Fondo beige, tabs OC/Requisiciones, filtros inline, tabla sin KPIs
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';
import {
  ShoppingCart, ClipboardList, Search, Filter, Plus, Eye, Trash2, Download,
  Zap, Users, ArrowLeft, Package,
} from 'lucide-react';

interface OC {
  oc_id: string; numero_oc: string; obra_codigo: string; obra_nombre: string;
  proveedor_alias: string; proveedor_razon_social: string; comprador: string;
  fecha_entrega: string; tipo_entrega: string; total: number;
  descuento_pct: number; tiene_iva: boolean;
  estatus: string; fecha_creacion: string;
}
interface Req {
  requisicion_id: string; numero_requisicion: string; obra_codigo: string;
  obra_nombre: string; residente_nombre: string; urgencia: string;
  estatus: string; fecha_creacion: string;
}
interface OCsRes { data: OC[]; total: number; }
interface ReqRes { data: Req[]; total: number; }

const ESTATUS_REQ: Record<string, string> = {
  pendiente:     'bg-yellow-100 text-yellow-800',
  en_revision:   'bg-blue-100 text-blue-800',
  aprobada:      'bg-green-100 text-green-800',
  convertida_oc: 'bg-emerald-100 text-emerald-800',
  rechazada:     'bg-red-100 text-red-800',
};

function fmtMXN(n: number) { return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`; }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('es-MX'); }

export default function OrdenesCompraList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'ocs' | 'reqs'>('ocs');
  const [search, setSearch] = useState('');
  const [filtroObra, setFiltroObra] = useState('Todas');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  const { status: sOC, data: dOC, error: eOC, reload: rOC } = useApi<OCsRes>(EP.ocs, d => !d?.data);
  const { status: sRQ, data: dRQ, error: eRQ, reload: rRQ } = useApi<ReqRes>(EP.requisiciones, d => !d?.data);

  const loading = tab === 'ocs' ? sOC === 'loading' : sRQ === 'loading';
  const err     = tab === 'ocs' ? eOC : eRQ;
  const reload  = tab === 'ocs' ? rOC : rRQ;
  if (loading) return <PageLoading mensaje="Cargando..." />;
  if (tab === 'ocs'  && sOC === 'error')  return <PageError mensaje={eOC} onRetry={rOC} />;
  if (tab === 'reqs' && sRQ === 'error')  return <PageError mensaje={eRQ} onRetry={rRQ} />;

  const ocs  = dOC?.data ?? [];
  const reqs = dRQ?.data ?? [];
  const urgentes = reqs.filter(r => r.urgencia === 'urgente' && r.estatus !== 'convertida_oc').length;
  const obras = Array.from(new Set(ocs.map(o => o.obra_codigo)));

  const ocsFiltered = ocs.filter(o => {
    const s = o.numero_oc.toLowerCase().includes(search.toLowerCase())
      || o.proveedor_alias.toLowerCase().includes(search.toLowerCase())
      || o.obra_nombre.toLowerCase().includes(search.toLowerCase());
    const e = filtroEstatus === 'Todos' || o.estatus === filtroEstatus;
    const w = filtroObra === 'Todas' || o.obra_codigo === filtroObra;
    return s && e && w;
  });

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8' }}>
      {/* Top bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Inicio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departamento de Compras</h1>
              <p className="text-sm text-gray-500">Gestión centralizada de órdenes de compra y requisiciones</p>
            </div>
          </div>
          <Button onClick={() => navigate('/compras/proveedores')} className="gap-2 bg-green-600 hover:bg-green-700">
            <Users className="h-4 w-4" /> Gestión de Proveedores
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border border-b-0 flex">
          <button
            onClick={() => setTab('ocs')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              tab === 'ocs' ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-gray-500 border-transparent hover:bg-gray-50'
            }`}
          >
            <ShoppingCart className="h-4 w-4" /> Órdenes de Compra
            <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{ocs.length}</span>
          </button>
          <button
            onClick={() => setTab('reqs')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              tab === 'reqs' ? 'text-purple-600 border-purple-600 bg-purple-50' : 'text-gray-500 border-transparent hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Requisiciones Recibidas
            <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{reqs.length}</span>
            {urgentes > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3" />{urgentes}
              </span>
            )}
          </button>
        </div>

        {/* Filtros + tabla OCs */}
        {tab === 'ocs' && (
          <div className="bg-white rounded-b-xl border shadow-sm">
            {/* Filtros */}
            <div className="p-4 border-b flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Buscar por número de OC, proveedor u obra..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-gray-50" />
                </div>
                <Select value={filtroObra} onValueChange={setFiltroObra}>
                  <SelectTrigger className="w-44 bg-gray-50"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas las obras</SelectItem>
                    {obras.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
                  <SelectTrigger className="w-44 bg-gray-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los estados</SelectItem>
                    {['pendiente','aprobada','entregada','rechazada','cancelada'].map(e => (
                      <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => navigate('/compras/ordenes/nueva')} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" /> Nueva Orden de Compra
              </Button>
            </div>

            {/* Cabecera tabla */}
            <div className="px-6 py-3 border-b">
              <h2 className="font-semibold text-gray-700">Registro de Órdenes de Compra</h2>
            </div>

            {/* Tabla */}
            {ocsFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">No hay órdenes de compra</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm mb-4">No se han encontrado órdenes de compra registradas en el sistema. Puedes comenzar creando una nueva orden.</p>
                <Button variant="outline" className="gap-2" onClick={() => navigate('/compras/ordenes/nueva')}>
                  <Plus className="h-4 w-4" /> Crear Primera Orden
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {['OC / Fecha','Obra','Proveedor','Comprador','F. Entrega / Tipo','Total','Acciones'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ocsFiltered.map(oc => (
                    <tr key={oc.oc_id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">{oc.numero_oc}</div>
                        <div className="text-xs text-gray-400">{fmtDate(oc.fecha_creacion)}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium">{oc.obra_codigo}</div>
                        <div className="text-xs text-gray-400">{oc.obra_nombre}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{oc.proveedor_alias}</div>
                        <div className="text-xs text-gray-400">{oc.proveedor_razon_social}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{oc.comprador}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm">{fmtDate(oc.fecha_entrega)}</div>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded border border-gray-200 mt-1 inline-block">{oc.tipo_entrega}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{fmtMXN(oc.total)}</div>
                        {!oc.tiene_iva && <div className="text-xs text-gray-400">Sin IVA</div>}
                        {oc.descuento_pct > 0 && <div className="text-xs text-red-500">-{oc.descuento_pct}% desc.</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-600"><Download className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Requisiciones recibidas */}
        {tab === 'reqs' && (
          <div className="bg-white rounded-b-xl border shadow-sm">
            {reqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">Sin requisiciones recibidas</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm">Los residentes aún no han enviado requisiciones de material.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {['Número','Obra','Residente','Urgencia','Estado','Fecha',''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reqs.map(r => (
                    <tr key={r.requisicion_id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-mono font-semibold">{r.numero_requisicion}</td>
                      <td className="px-5 py-4"><div>{r.obra_codigo}</div><div className="text-xs text-gray-400">{r.obra_nombre}</div></td>
                      <td className="px-5 py-4 text-gray-600">{r.residente_nombre}</td>
                      <td className="px-5 py-4">
                        {r.urgencia === 'urgente'
                          ? <span className="flex items-center gap-1 text-red-600 font-semibold"><Zap className="h-4 w-4 fill-red-600" />Urgente</span>
                          : <span className="text-gray-500 capitalize">{r.urgencia}</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${ESTATUS_REQ[r.estatus] ?? 'bg-gray-100 text-gray-600'}`}>
                          {r.estatus.replace('_',' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{fmtDate(r.fecha_creacion)}</td>
                      <td className="px-5 py-4">
                        <Button size="sm" variant="outline" className="gap-1 text-blue-600">Convertir a OC</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
