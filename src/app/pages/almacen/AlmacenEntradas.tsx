/**
 * ALMACÉN — ENTRADAS DE MATERIAL
 * Registro de entradas al inventario.
 */
import { useState, useEffect } from 'react';
import { dataAdapter } from '@/core/data';
import type { Entrega } from '@/core/data/types';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Loader2, AlertCircle, RefreshCw, PackageCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const ESTATUS_STYLE: Record<string, string> = {
  parcial: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  completa: 'bg-green-50 text-green-700 border-green-300',
  con_incidencia: 'bg-red-50 text-red-700 border-red-300',
};

export default function AlmacenEntradas() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listEntregas();
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setEntregas(res.data);
      setStatus(res.data.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  if (status === 'loading') return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  if (status === 'error') return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
      <AlertCircle className="w-8 h-8" /><p className="text-sm">{error}</p>
      <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
    </div>
  );
  if (status === 'empty') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
      <PackageCheck className="w-12 h-12 text-slate-300" />
      <p className="text-lg font-medium">No hay entradas registradas</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Entradas de Material</h2>
        <p className="text-slate-500 text-sm mt-1">{entregas.length} entrega{entregas.length !== 1 ? 's' : ''} registrada{entregas.length !== 1 ? 's' : ''}</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Número', 'OC', 'Obra', 'Fecha', 'Recibe', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {entregas.map(e => (
                  <tr key={e.entrega_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold">{e.numero_entrega}</td>
                    <td className="px-4 py-3 text-slate-600">{e.oc_id}</td>
                    <td className="px-4 py-3 text-slate-600">{e.obra_id}</td>
                    <td className="px-4 py-3">{new Date(e.fecha_entrega).toLocaleDateString('es-MX')}</td>
                    <td className="px-4 py-3">{e.quien_recibe || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={ESTATUS_STYLE[e.estatus] || ''}>
                        {e.estatus.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
