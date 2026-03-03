/**
 * PAGOS — Programación (Cuentas por Pagar)
 * UI fiel a Figma: bandeja por vencer/vencidas, acción de pago por fila
 */
import { useState } from 'react';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { CreditCard, CheckCircle, Search, Filter, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface CxP {
  cxp_id: string;
  numero_oc: string;
  proveedor_alias: string;
  obra_nombre: string;
  monto_pendiente: number;
  fecha_vencimiento: string;
  estatus: string;
  dias_restantes: number;
  condicion_pago: string;
}

interface CxPRes { data: CxP[]; total: number; }

function fmtMXN(n: number) { return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`; }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('es-MX'); }

export default function PagosProgramacion() {
  const { status, data, error, reload } = useApi<CxPRes>(EP.cxp, d => d.data.length === 0);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');

  if (status === 'loading') return <PageLoading mensaje="Cargando cuentas por pagar..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={CreditCard}
      titulo="Sin cuentas por pagar"
      descripcion="No hay compromisos de pago pendientes. Cuando se emitan órdenes de compra aparecerán aquí."
      iconBg="bg-green-100" iconColor="text-green-500"
    />
  );

  const items = data!.data;
  const vencidas    = items.filter(c => c.dias_restantes < 0).length;
  const por_vencer  = items.filter(c => c.dias_restantes >= 0 && c.dias_restantes <= 7).length;
  const total_monto = items.reduce((s, c) => s + c.monto_pendiente, 0);

  const filtradas = items.filter(c => {
    const matchSearch = c.numero_oc.toLowerCase().includes(search.toLowerCase())
      || c.proveedor_alias.toLowerCase().includes(search.toLowerCase());
    if (filtro === 'vencidas')   return matchSearch && c.dias_restantes < 0;
    if (filtro === 'por_vencer') return matchSearch && c.dias_restantes >= 0 && c.dias_restantes <= 7;
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-600 rounded-lg"><CreditCard className="h-8 w-8 text-white" /></div>
          <div>
            <h1 className="text-3xl font-bold">Programación de Pagos</h1>
            <p className="text-muted-foreground">Control de cuentas por pagar a proveedores</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total pendiente</p>
            <p className="text-2xl font-bold">{fmtMXN(total_monto)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="text-sm text-muted-foreground">CxP activas</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent></Card>
          <Card className={vencidas > 0 ? 'border-red-300 bg-red-50' : ''}><CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Vencidas</p>
            <p className={`text-2xl font-bold ${vencidas > 0 ? 'text-red-600' : ''}`}>{vencidas}</p>
          </CardContent></Card>
          <Card className={por_vencer > 0 ? 'border-orange-300 bg-orange-50' : ''}><CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Por vencer (7d)</p>
            <p className={`text-2xl font-bold ${por_vencer > 0 ? 'text-orange-600' : ''}`}>{por_vencer}</p>
          </CardContent></Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar OC o proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              {[['todos','Todas'],['vencidas','Vencidas'],['por_vencer','Por vencer']].map(([val, label]) => (
                <Button key={val} variant={filtro === val ? 'default' : 'outline'} size="sm" onClick={() => setFiltro(val)}>{label}</Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader><CardTitle>Cuentas por Pagar</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['OC','Proveedor','Obra','Condición','Monto','Vencimiento','Días','Estado',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.map(c => (
                  <tr key={c.cxp_id} className={`hover:bg-gray-50 ${c.dias_restantes < 0 ? 'bg-red-50/40' : ''}`}>
                    <td className="px-4 py-3 font-mono font-semibold">{c.numero_oc}</td>
                    <td className="px-4 py-3 font-medium">{c.proveedor_alias}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.obra_nombre}</td>
                    <td className="px-4 py-3">{c.condicion_pago}</td>
                    <td className="px-4 py-3 font-semibold">{fmtMXN(c.monto_pendiente)}</td>
                    <td className="px-4 py-3">{fmtDate(c.fecha_vencimiento)}</td>
                    <td className="px-4 py-3">
                      <span className={c.dias_restantes < 0 ? 'text-red-600 font-bold' : c.dias_restantes <= 3 ? 'text-orange-600 font-semibold' : ''}>
                        {c.dias_restantes < 0 ? `${Math.abs(c.dias_restantes)}d vencido` : `${c.dias_restantes}d`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={c.dias_restantes < 0 ? 'text-red-700 border-red-300 bg-red-50' : 'text-yellow-700 border-yellow-300'}>
                        {c.estatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3" /> Pagar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtradas.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay cuentas por pagar con ese filtro</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
