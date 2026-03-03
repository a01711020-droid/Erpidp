import { PageEmpty } from '@/app/components/PageStates';
import { FileBarChart } from 'lucide-react';

export default function PersonalReportes() {
  return (
    <PageEmpty
      icon={FileBarChart}
      titulo="Reportes de Personal"
      descripcion="Los reportes de nómina y distribución de indirectos estarán disponibles próximamente."
      iconBg="bg-purple-100" iconColor="text-purple-500"
    />
  );
}
