/**
 * ALMACÉN — Entradas de material
 */
import { Package } from 'lucide-react';

export default function AlmacenEntradas() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
      <Package className="w-12 h-12 text-slate-300" />
      <h2 className="text-xl font-semibold">Entradas de Material</h2>
      <p className="text-sm">Próximamente — pendiente integración con backend</p>
    </div>
  );
}
