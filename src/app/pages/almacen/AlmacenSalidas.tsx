/**
 * ALMACÉN — Salidas de material
 */
import { ClipboardList } from 'lucide-react';

export default function AlmacenSalidas() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
      <ClipboardList className="w-12 h-12 text-slate-300" />
      <h2 className="text-xl font-semibold">Salidas de Material</h2>
      <p className="text-sm">Próximamente — pendiente integración con backend</p>
    </div>
  );
}
