import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { History } from 'lucide-react';

interface Pago {
  pago_id: string;
  numero_pago: string;
  numero_oc: string;
  proveedor_alias: string;
  obra_nombre: string;
  monto_pagado: number;
  fecha_pago: string;
  metodo_pago: string;
  estatus: string;
}

interface PagosRes { data: Pago[]; total: number; }

export default function PagosHistorial() {
  const { status, data, error, reload } = useApi<PagosRes>(EP.pagos, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando historial de pagos..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={History}
      titulo="Sin pagos registrados"
      descripcion="Aquí aparecerán todos los pagos realizados a proveedores una vez que se registren."
      iconBg="bg-blue-100" iconColor="text-blue-500"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg"><History className="h-6 w-6 text-white" /></div>
        <div>
          <h1 className="text-2xl font-bold">Historial de Pagos</h1>
          <p className="text-sm text-muted-foreground">{data!.total} pagos registrados</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Pagos Realizados</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Folio','OC','Proveedor','Obra','Monto','Fecha','Método','Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(p => (
                <tr key={p.pago_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold">{p.numero_pago}</td>
                  <td className="px-4 py-3">{p.numero_oc}</td>
                  <td className="px-4 py-3">{p.proveedor_alias}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.obra_nombre}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">${p.monto_pagado.toLocaleString('es-MX')}</td>
                  <td className="px-4 py-3">{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3 capitalize">{p.metodo_pago}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={p.estatus === 'aplicado' ? 'text-green-700 border-green-300' : 'text-gray-600'}>
                      {p.estatus}
                    </Badge>
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
