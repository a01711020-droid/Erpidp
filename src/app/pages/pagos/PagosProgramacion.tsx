import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { CreditCard, CheckCircle } from 'lucide-react';

interface CxP {
  cxp_id: string;
  numero_oc: string;
  proveedor_alias: string;
  obra_nombre: string;
  monto_pendiente: number;
  fecha_vencimiento: string;
  estatus: string;
  dias_restantes: number;
}

interface CxPRes { data: CxP[]; total: number; }

export default function PagosProgramacion() {
  const { status, data, error, reload } = useApi<CxPRes>(EP.cxp, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando cuentas por pagar..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={CreditCard}
      titulo="Sin cuentas por pagar"
      descripcion="No hay compromisos de pago pendientes. Cuando se generen órdenes de compra apareceran aquí para programar su pago."
      iconBg="bg-green-100" iconColor="text-green-500"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-600 rounded-lg"><CreditCard className="h-6 w-6 text-white" /></div>
        <div>
          <h1 className="text-2xl font-bold">Programación de Pagos</h1>
          <p className="text-sm text-muted-foreground">Cuentas por pagar activas</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Cuentas por Pagar</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['OC','Proveedor','Obra','Monto','Vencimiento','Días','Estado',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(c => (
                <tr key={c.cxp_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold">{c.numero_oc}</td>
                  <td className="px-4 py-3">{c.proveedor_alias}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.obra_nombre}</td>
                  <td className="px-4 py-3 font-semibold">${c.monto_pendiente.toLocaleString('es-MX')}</td>
                  <td className="px-4 py-3">{new Date(c.fecha_vencimiento).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3">
                    <span className={c.dias_restantes < 0 ? 'text-red-600 font-bold' : c.dias_restantes <= 3 ? 'text-orange-600 font-semibold' : ''}>
                      {c.dias_restantes < 0 ? `${Math.abs(c.dias_restantes)}d vencido` : `${c.dias_restantes}d`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={c.estatus === 'vencido' ? 'text-red-700 border-red-300' : 'text-yellow-700 border-yellow-300'}>
                      {c.estatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Pagar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
