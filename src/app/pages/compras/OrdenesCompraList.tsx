/**
 * COMPRAS — Lista de Órdenes de Compra
 * UI 100% fiel a Figma. Datos reales del backend.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, api, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';
import {
  Plus, Search, Filter, FileText, Eye, Trash2, Download,
  CheckCircle, Clock, Package, ShoppingCart, ClipboardList, Zap, Users, X, Edit, Ban,
} from 'lucide-react';

interface OC {
  oc_id: string;
  numero_oc: string;
  obra_codigo: string;
  obra_nombre: string;
  proveedor_alias: string;
  proveedor_razon_social: string;
  comprador: string;
  fecha_entrega: string;
  tipo_entrega: string;
  subtotal: number;
  iva: number;
  descuento_pct: number;
  descuento_monto: number;
  total: number;
  tiene_iva: boolean;
  estatus: 'pendiente' | 'aprobada' | 'entregada' | 'rechazada' | 'cancelada';
  fecha_creacion: string;
  observaciones: string;
}

interface OCsRes { data: OC[]; total: number; }

const ESTATUS_STYLE: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  aprobada:  { label: 'Aprobada',  cls: 'bg-green-100 text-green-800 border-green-300',  icon: <CheckCircle className="h-3 w-3" /> },
  entregada: { label: 'Entregada', cls: 'bg-blue-100 text-blue-800 border-blue-300',    icon: <Package className="h-3 w-3" /> },
  pendiente: { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <Clock className="h-3 w-3" /> },
  rechazada: { label: 'Rechazada', cls: 'bg-red-100 text-red-800 border-red-300',       icon: <X className="h-3 w-3" /> },
  cancelada: { label: 'Cancelada', cls: 'bg-gray-100 text-gray-600 border-gray-300',    icon: <Ban className="h-3 w-3" /> },
};

function fmtMXN(n: number) { return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`; }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('es-MX'); }

export default function OrdenesCompraList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<OCsRes>(EP.ocs, d => d.data.length === 0);
  const [search, setSearch]           = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');
  const [filtroObra, setFiltroObra]   = useState('Todos');
  const [ocDetalle, setOcDetalle]     = useState<OC | null>(null);

  if (status === 'loading') return <PageLoading mensaje="Cargando órdenes de compra..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={ShoppingCart}
      titulo="Sin órdenes de compra"
      descripcion="Aún no hay órdenes de compra. Crea la primera directamente o desde una requisición."
      ctaLabel="Nueva Orden de Compra"
      onCta={() => navigate('/compras/ordenes/nueva')}
      iconBg="bg-blue-100" iconColor="text-blue-500"
    />
  );

  const ocs = data!.data;
  const obras = Array.from(new Set(ocs.map(o => o.obra_codigo)));

  const filtradas = ocs.filter(o => {
    const matchSearch = o.numero_oc.toLowerCase().includes(search.toLowerCase())
      || o.proveedor_alias.toLowerCase().includes(search.toLowerCase())
      || o.obra_nombre.toLowerCase().includes(search.toLowerCase());
    const matchEstatus = filtroEstatus === 'Todos' || o.estatus === filtroEstatus.toLowerCase();
    const matchObra = filtroObra === 'Todos' || o.obra_codigo === filtroObra;
    return matchSearch && matchEstatus && matchObra;
  });

  const totalMonto  = filtradas.reduce((s, o) => s + o.total, 0);
  const aprobadas   = filtradas.filter(o => o.estatus === 'aprobada').length;
  const totalDesc   = filtradas.reduce((s, o) => s + o.descuento_monto, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-700 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departamento de Compras</h1>
              <p className="text-muted-foreground">Gestión centralizada de órdenes de compra</p>
            </div>
          </div>
          <Button onClick={() => navigate('/compras/proveedores')} className="gap-2 bg-green-600 hover:bg-green-700">
            <Users className="h-5 w-5" /> Gestión de Proveedores
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total OCs', value: ocs.length,              sub: 'registradas' },
            { label: 'Aprobadas',  value: aprobadas,              sub: 'este periodo' },
            { label: 'Monto Total', value: fmtMXN(totalMonto),   sub: 'comprometido' },
            { label: 'Descuentos', value: fmtMXN(totalDesc),     sub: 'ahorrados' },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar OC, proveedor u obra..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas las obras</SelectItem>
                  {obras.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los estados</SelectItem>
                  {['pendiente','aprobada','rechazada','entregada','cancelada'].map(e => (
                    <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => navigate('/compras/ordenes/nueva')} className="gap-2 bg-blue-700 hover:bg-blue-800">
              <Plus className="h-4 w-4" /> Nueva Orden de Compra
            </Button>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader><CardTitle>Registro de Órdenes de Compra</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['OC / Fecha','Obra','Proveedor','Comprador','F. Entrega / Tipo','Total','Estado','Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtradas.map(oc => {
                    const est = ESTATUS_STYLE[oc.estatus] ?? ESTATUS_STYLE.pendiente;
                    return (
                      <tr key={oc.oc_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium">{oc.numero_oc}{oc.estatus==='cancelada' && <span className="text-red-600 font-bold ml-1">*</span>}</div>
                          <div className="text-xs text-muted-foreground">{fmtDate(oc.fecha_creacion)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-sm">{oc.obra_codigo}</div>
                          <div className="text-xs text-muted-foreground">{oc.obra_nombre}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-sm">{oc.proveedor_alias}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">{oc.proveedor_razon_social}</div>
                        </td>
                        <td className="px-4 py-4 text-sm">{oc.comprador}</td>
                        <td className="px-4 py-4">
                          <div className="text-sm">{fmtDate(oc.fecha_entrega)}</div>
                          <Badge variant="outline" className="text-xs mt-1">{oc.tipo_entrega}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium">{fmtMXN(oc.total)}</div>
                          {!oc.tiene_iva && <div className="text-xs text-muted-foreground">Sin IVA</div>}
                          {oc.descuento_pct > 0 && <div className="text-xs text-orange-600">-{oc.descuento_pct}% desc.</div>}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className={`gap-1 ${est.cls}`}>{est.icon}{est.label}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" title="Ver" onClick={() => setOcDetalle(oc)}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="PDF"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Eliminar"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtradas.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron órdenes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal detalle OC */}
      {ocDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-xl font-bold text-white">Detalle de OC</h2>
                <p className="text-blue-100 text-sm">{ocDetalle.numero_oc}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOcDetalle(null)} className="text-white hover:bg-blue-800">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Obra</h3>
                  <p className="font-medium">{ocDetalle.obra_codigo} — {ocDetalle.obra_nombre}</p>
                  <p className="text-sm text-muted-foreground mt-1">Comprador: {ocDetalle.comprador}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Proveedor</h3>
                  <p className="font-medium">{ocDetalle.proveedor_alias}</p>
                  <p className="text-sm text-muted-foreground">{ocDetalle.proveedor_razon_social}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
                <div><p className="text-muted-foreground">F. Entrega</p><p className="font-medium">{fmtDate(ocDetalle.fecha_entrega)}</p></div>
                <div><p className="text-muted-foreground">Tipo</p><Badge variant="outline">{ocDetalle.tipo_entrega}</Badge></div>
                <div><p className="text-muted-foreground">Estado</p><Badge variant="outline" className={(ESTATUS_STYLE[ocDetalle.estatus]?.cls ?? '')}>{ESTATUS_STYLE[ocDetalle.estatus]?.label}</Badge></div>
              </div>
              {ocDetalle.observaciones && (
                <div className="p-4 bg-amber-50 rounded-lg text-sm">
                  <p className="font-semibold text-amber-900 mb-1">Observaciones</p>
                  <p>{ocDetalle.observaciones}</p>
                </div>
              )}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-sm font-semibold">Conceptos</div>
                <div className="p-4 text-sm text-muted-foreground italic">Los conceptos se cargarán desde el endpoint GET /ocs/{ocDetalle.oc_id}/items</div>
              </div>
              <div className="space-y-2 max-w-xs ml-auto text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmtMXN(ocDetalle.subtotal)}</span></div>
                {ocDetalle.descuento_pct > 0 && <div className="flex justify-between text-orange-600"><span>Descuento ({ocDetalle.descuento_pct}%)</span><span>-{fmtMXN(ocDetalle.descuento_monto)}</span></div>}
                {ocDetalle.tiene_iva && <div className="flex justify-between"><span className="text-muted-foreground">IVA 16%</span><span>{fmtMXN(ocDetalle.iva)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-green-600">{fmtMXN(ocDetalle.total)}</span></div>
              </div>
            </div>
            <div className="flex justify-between p-6 border-t bg-gray-50">
              <Button variant="ghost" className="text-red-600 gap-2"><Ban className="h-4 w-4" />Cancelar Orden</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOcDetalle(null)}>Cerrar</Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700"><Edit className="h-4 w-4" />Editar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
