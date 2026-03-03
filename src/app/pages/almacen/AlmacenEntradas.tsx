import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { PackagePlus } from 'lucide-react';

export default function AlmacenEntradas() {
  const { status, data, error, reload } = useApi<any>(`${EP.recepciones}?tipo=entrada`, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando entradas..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={PackagePlus}
      titulo="Sin entradas registradas"
      descripcion="Las entradas de material al almacén aparecerán aquí cuando se registren recepciones de OC."
      iconBg="bg-green-100" iconColor="text-green-500"
    />
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Entradas de Material</h1>
      <Card><CardHeader><CardTitle>Entradas</CardTitle></CardHeader><CardContent><pre className="text-xs">{JSON.stringify(data, null, 2)}</pre></CardContent></Card>
    </div>
  );
}
