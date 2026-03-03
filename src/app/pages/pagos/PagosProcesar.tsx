import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { CheckSquare } from 'lucide-react';

export default function PagosProcesar() {
  const { status, error, reload } = useApi<any>(`${EP.cxp}?por_procesar=true`, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando pagos por procesar..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  return (
    <PageEmpty
      icon={CheckSquare}
      titulo="Sin pagos por procesar"
      descripcion="Aquí aparecerán las cuentas por pagar listas para ejecutar el pago. Selecciónalas desde la programación."
      iconBg="bg-green-100" iconColor="text-green-600"
    />
  );
}
