import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { BarChart3 } from 'lucide-react';

export default function ResumenDestajos() {
  const { status, error, reload } = useApi<any>(`${EP.destajos}?resumen=true`, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando resumen..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  return (
    <PageEmpty
      icon={BarChart3}
      titulo="Sin datos de resumen"
      descripcion="El resumen de destajos por obra y periodo aparecerá aquí una vez que se capturen avances."
      iconBg="bg-purple-100" iconColor="text-purple-500"
    />
  );
}
