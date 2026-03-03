import { PageEmpty } from '@/app/components/PageStates';
import { CalendarCheck } from 'lucide-react';

export default function PersonalAsistencia() {
  return (
    <PageEmpty
      icon={CalendarCheck}
      titulo="Módulo de asistencia"
      descripcion="El control de asistencia y nómina estará disponible en la siguiente fase del sistema."
      iconBg="bg-blue-100" iconColor="text-blue-500"
    />
  );
}
