import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FileText, Plus } from 'lucide-react';

export default function FacturasList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<any>(`${EP.pagos}?con_factura=true`, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando facturas..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={FileText}
      titulo="Sin facturas registradas"
      descripcion="Aquí aparecerán los pagos que tienen factura adjunta. Adjunta facturas desde el detalle de cada pago."
      iconBg="bg-indigo-100" iconColor="text-indigo-500"
    />
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Facturas</h1>
      <Card><CardHeader><CardTitle>Facturas adjuntas a pagos</CardTitle></CardHeader>
        <CardContent><pre className="text-xs">{JSON.stringify(data, null, 2)}</pre></CardContent>
      </Card>
    </div>
  );
}
