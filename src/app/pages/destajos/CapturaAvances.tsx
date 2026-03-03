import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { ClipboardCheck } from 'lucide-react';

export default function CapturaAvances() {
  const { status, error, reload } = useApi<any>(EP.destajos, d => !d?.data?.length);

  if (status === 'loading') return <PageLoading mensaje="Cargando avances..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  return (
    <PageEmpty
      icon={ClipboardCheck}
      titulo="Sin capturas de avance"
      descripcion="Aquí podrás registrar el avance semanal por concepto y destajista en cada obra."
      iconBg="bg-amber-100" iconColor="text-amber-600"
    />
  );
}
