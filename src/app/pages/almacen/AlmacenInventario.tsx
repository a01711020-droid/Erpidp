import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Warehouse, PackageCheck } from 'lucide-react';

interface Recepcion {
  recepcion_id: string;
  numero_recepcion: string;
  numero_oc: string;
  proveedor_alias: string;
  obra_nombre: string;
  quien_recibe: string | null;
  fecha_entrega: string;
  estatus: string;
}

interface RecRes { data: Recepcion[]; total: number; }

const ESTATUS_CLS: Record<string, string> = {
  parcial:         'bg-yellow-50 text-yellow-700 border-yellow-300',
  completa:        'bg-green-50 text-green-700 border-green-300',
  con_incidencia:  'bg-red-50 text-red-700 border-red-300',
};

export default function AlmacenInventario() {
  const { status, data, error, reload } = useApi<RecRes>(EP.recepciones, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando recepciones..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={Warehouse}
      titulo="Sin recepciones registradas"
      descripcion="Aquí aparecerán las recepciones de material cuando se registren contra órdenes de compra."
      iconBg="bg-orange-100" iconColor="text-orange-500"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500 rounded-lg"><Warehouse className="h-6 w-6 text-white" /></div>
        <div>
          <h1 className="text-2xl font-bold">Recepciones de Material</h1>
          <p className="text-sm text-muted-foreground">{data!.total} recepciones registradas</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Historial de Recepciones</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Recepción','OC','Proveedor','Obra','Recibe','Fecha','Estado',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(r => (
                <tr key={r.recepcion_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold">{r.numero_recepcion}</td>
                  <td className="px-4 py-3">{r.numero_oc}</td>
                  <td className="px-4 py-3">{r.proveedor_alias}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.obra_nombre}</td>
                  <td className="px-4 py-3">{r.quien_recibe ?? '—'}</td>
                  <td className="px-4 py-3">{new Date(r.fecha_entrega).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={ESTATUS_CLS[r.estatus] ?? ''}>{r.estatus.replace('_',' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost"><PackageCheck className="h-4 w-4" /></Button>
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
