import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus, ShoppingCart, Eye, FileText } from 'lucide-react';

interface OC {
  oc_id: string;
  numero_oc: string;
  obra_nombre: string;
  proveedor_alias: string;
  comprador: string;
  fecha_entrega: string;
  total: number;
  estatus: string;
}

interface OCsResponse { data: OC[]; total: number; }

const ESTATUS: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  aprobada:  'bg-green-50 text-green-700 border-green-300',
  entregada: 'bg-blue-50 text-blue-700 border-blue-300',
  cancelada: 'bg-red-50 text-red-700 border-red-300',
  rechazada: 'bg-gray-50 text-gray-700 border-gray-300',
};

export default function OrdenesCompraList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<OCsResponse>(EP.ocs, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando órdenes de compra..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={ShoppingCart}
      titulo="Sin órdenes de compra"
      descripcion="Aún no hay órdenes de compra registradas. Crea la primera directamente o desde una requisición."
      ctaLabel="Nueva Orden de Compra"
      onCta={() => navigate('/compras/ordenes/nueva')}
      iconBg="bg-blue-100" iconColor="text-blue-500"
    />
  );

  const ocs = data!.data;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-700 rounded-lg"><ShoppingCart className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Órdenes de Compra</h1>
            <p className="text-sm text-muted-foreground">{data!.total} órdenes registradas</p>
          </div>
        </div>
        <Button onClick={() => navigate('/compras/ordenes/nueva')} className="gap-2 bg-blue-700 hover:bg-blue-800">
          <Plus className="h-4 w-4" /> Nueva OC
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Registro de Órdenes</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Folio / Fecha','Obra','Proveedor','Comprador','F. Entrega','Total','Estado',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {ocs.map(oc => (
                <tr key={oc.oc_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{oc.numero_oc}</td>
                  <td className="px-4 py-3 text-muted-foreground">{oc.obra_nombre}</td>
                  <td className="px-4 py-3">{oc.proveedor_alias}</td>
                  <td className="px-4 py-3">{oc.comprador}</td>
                  <td className="px-4 py-3">{new Date(oc.fecha_entrega).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3 font-semibold">${oc.total.toLocaleString('es-MX')}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={ESTATUS[oc.estatus] ?? ''}>
                      {oc.estatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/compras/ordenes/${oc.oc_id}`)}>
                      <Eye className="h-4 w-4" />
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
