import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { PackageMinus } from 'lucide-react';

export default function AlmacenSalidas() {
  const { status, error, reload } = useApi<any>(`${EP.prestamos}`, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando salidas..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  return (
    <PageEmpty
      icon={PackageMinus}
      titulo="Sin salidas / préstamos registrados"
      descripcion="Los préstamos de herramientas y material crítico aparecerán aquí cuando se registren."
      iconBg="bg-yellow-100" iconColor="text-yellow-500"
    />
  );
}
