/**
 * PAGOS — Gestión de Pagos
 * UI 100% fiel a Figma: header verde, 6 KPIs, 2 cards monto, buscador, tabla detallada
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
import {
  ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle, Receipt,
  DollarSign, Download, Plus, Search,
} from 'lucide-react';

interface CxP {
  cxp_id: string; numero_oc: string; obra_nombre: string;
  proveedor_alias: string; factura: string | null;
  fecha_factura: string | null; importe: number;
  pagado: number; condicion_pago: string;
  estatus: 'pagado' | 'pendiente' | 'vencido' | 'parcial';
  dias_retraso: number; fecha_oc: string;
}
interface CxPRes { data: CxP[]; total: number; }

const ESTATUS_BADGE: Record<string, { cls: string; label: string; Icon: React.ElementType }> = {
  pagado:   { cls: 'bg-green-100 text-green-700 border-green-300',  label: 'Pagado',   Icon: CheckCircle2 },
  pendiente:{ cls: 'bg-yellow-100 text-yellow-700 border-yellow-300',label: 'Pendiente',Icon: Clock },
  vencido:  { cls: 'bg-red-100 text-red-700 border-red-300',        label: 'Vencido',  Icon: AlertCircle },
  parcial:  { cls: 'bg-orange-100 text-orange-700 border-orange-300',label: 'Parcial',  Icon: Clock },
};

function fmtMXN(n: number) { return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`; }
function fmtDate(s: string | null) { return s ? new Date(s).toLocaleDateString('es-MX') : '-'; }

export default function PagosProgramacion() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<CxPRes>(EP.cxp, d => !d?.data);
  const [search, setSearch] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  if (status === 'loading') return <PageLoading mensaje="Cargando gestión de pagos..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const items = data?.data ?? [];
  const totalOCs   = items.length;
  const pagadas    = items.filter(c => c.estatus === 'pagado').length;
  const parciales  = items.filter(c => c.estatus === 'parcial').length;
  const pendientes = items.filter(c => c.estatus === 'pendiente').length;
  const vencidos   = items.filter(c => c.estatus === 'vencido').length;
  const sinFact    = items.filter(c => !c.factura).length;
  const montoTotal = items.reduce((s, c) => s + c.importe, 0);
  const montoPagado= items.reduce((s, c) => s + c.pagado, 0);
  const pctPagado  = montoTotal > 0 ? ((montoPagado / montoTotal) * 100).toFixed(1) : '0.0';

  const filtrados = items.filter(c => {
    const s = c.numero_oc.toLowerCase().includes(search.toLowerCase())
      || c.proveedor_alias.toLowerCase().includes(search.toLowerCase())
      || c.obra_nombre.toLowerCase().includes(search.toLowerCase());
    const e = filtroEstatus === 'Todos' || c.estatus === filtroEstatus;
    return s && e;
  });

  const KPIS = [
    { label: 'Total OCs', value: totalOCs,  Icon: FileText,    iconCls: 'text-blue-400',   bg: 'bg-blue-50' },
    { label: 'Pagadas',   value: pagadas,   Icon: CheckCircle2,iconCls: 'text-green-500',  bg: 'bg-green-50' },
    { label: 'Parciales', value: parciales, Icon: Clock,       iconCls: 'text-orange-400', bg: 'bg-orange-50' },
    { label: 'Pendientes',value: pendientes,Icon: Clock,       iconCls: 'text-yellow-400', bg: 'bg-yellow-50' },
    { label: 'Vencidos',  value: vencidos,  Icon: AlertCircle, iconCls: 'text-red-400',    bg: 'bg-red-50' },
    { label: 'Sin Factura',value: sinFact,  Icon: Receipt,     iconCls: 'text-purple-400', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Pagos</h1>
              <p className="text-sm text-gray-500">Control de pagos, facturas y seguimiento de órdenes de compra</p>
            </div>
          </div>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Download className="h-4 w-4" /> Importar CSV Bancario
          </Button>
        </div>

        {/* 6 KPIs */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          {KPIS.map(({ label, value, Icon, iconCls, bg }) => (
            <div key={label} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <div className={`p-2 rounded-lg ${bg}`}><Icon className={`h-5 w-5 ${iconCls}`} /></div>
            </div>
          ))}
        </div>

        {/* 2 cards de monto */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Monto Total en OCs</p>
              <p className="text-2xl font-bold">{fmtMXN(montoTotal)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg"><Receipt className="h-6 w-6 text-blue-400" /></div>
          </div>
          <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Monto Pagado</p>
              <p className="text-2xl font-bold text-green-600">{fmtMXN(montoPagado)}</p>
              <p className="text-xs text-gray-400">{pctPagado}% del total</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg"><DollarSign className="h-6 w-6 text-green-500" /></div>
          </div>
        </div>

        {/* Buscador + filtro */}
        <div className="bg-white rounded-xl border p-4 mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por folio, proveedor o obra..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-gray-50" />
          </div>
          <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
            <SelectTrigger className="w-48 bg-gray-50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los estados</SelectItem>
              {['pagado','pendiente','vencido','parcial'].map(e => (
                <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-700">Órdenes de Compra - Estado de Pagos y Facturas</h2>
          </div>
          {filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-500 mb-1">No hay pagos pendientes</h3>
              <p className="text-sm text-gray-400 text-center max-w-sm">No se han encontrado órdenes de compra pendientes de pago o facturación.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Fecha OC','Folio OC','Proveedor','Factura','Fecha Fact.','Importe','Pagado','Crédito','Estado','Acciones'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrados.map(c => {
                  const est = ESTATUS_BADGE[c.estatus] ?? ESTATUS_BADGE.pendiente;
                  const pctBar = c.importe > 0 ? (c.pagado / c.importe) * 100 : 0;
                  return (
                    <tr key={c.cxp_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(c.fecha_oc)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{c.numero_oc}</div>
                        <div className="text-xs text-gray-400">{c.obra_nombre}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{c.proveedor_alias}</td>
                      <td className="px-4 py-3 text-gray-600">{c.factura ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(c.fecha_factura)}</td>
                      <td className="px-4 py-3 font-semibold">{fmtMXN(c.importe)}</td>
                      <td className="px-4 py-3">
                        <div className={`font-semibold ${c.pagado >= c.importe ? 'text-green-600' : c.pagado > 0 ? 'text-orange-500' : ''}`}>
                          {fmtMXN(c.pagado)}
                        </div>
                        {c.pagado > 0 && c.pagado < c.importe && (
                          <div className="w-20 h-1.5 bg-gray-200 rounded mt-1">
                            <div className="h-full bg-orange-400 rounded" style={{ width: `${pctBar}%` }} />
                          </div>
                        )}
                        {c.estatus === 'vencido' && c.pagado > 0 && c.pagado < c.importe && (
                          <div className="text-xs text-red-500">Pendiente: {fmtMXN(c.importe - c.pagado)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {c.dias_retraso > 0
                          ? <div><div className="text-red-600 font-bold text-xs">¡Vencido!</div><div className="text-xs text-red-400">{c.dias_retraso} días de retraso</div></div>
                          : <span className="text-gray-500">{c.condicion_pago}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${est.cls}`}>
                          <est.Icon className="h-3 w-3" />{est.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.estatus !== 'pagado' && (
                          <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 text-xs">
                            <Plus className="h-3 w-3" /> Pago
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
