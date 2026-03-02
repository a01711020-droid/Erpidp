/**
 * PROCESAR PAGOS
 *
 * Lista pagos pendientes y permite marcarlos como aplicados.
 */

import { useState, useEffect } from 'react';
import { dataAdapter } from '@/core/data';
import type { Pago } from '@/core/data/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Loader2, AlertCircle, RefreshCw, CheckCircle, CreditCard } from 'lucide-react';

export default function PagosProcesar() {
  const { user } = useAuth();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listPagos();
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      const pendientes = res.data.filter(p => p.estatus === 'pendiente');
      setPagos(pendientes);
      setStatus(pendientes.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  async function handleProcesar(pagoId: string) {
    setProcesando(pagoId);
    await dataAdapter.cancelPago(pagoId); // Placeholder hasta tener endpoint procesar
    setProcesando(null);
    cargar();
  }

  if (status === 'loading') return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  if (status === 'error') return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
      <AlertCircle className="w-8 h-8" /><p className="text-sm">{error}</p>
      <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
    </div>
  );
  if (status === 'empty') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
      <CheckCircle className="w-12 h-12 text-green-300" />
      <p className="text-lg font-medium">No hay pagos pendientes de procesar</p>
    </div>
  );

  const total = pagos.reduce((s, p) => s + p.monto_pagado, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Procesar Pagos</h2>
          <p className="text-slate-500 text-sm mt-1">{pagos.length} pendiente{pagos.length !== 1 ? 's' : ''} — Total: <span className="font-semibold">${total.toLocaleString('es-MX')}</span></p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Número', 'OC', 'Fecha programada', 'Monto', 'Método', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {pagos.map(p => (
                  <tr key={p.pago_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold">{p.numero_pago}</td>
                    <td className="px-4 py-3 text-slate-600">{p.oc_id}</td>
                    <td className="px-4 py-3">{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                    <td className="px-4 py-3 font-semibold">${p.monto_pagado.toLocaleString('es-MX')}</td>
                    <td className="px-4 py-3 capitalize">{p.metodo_pago}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" onClick={() => handleProcesar(p.pago_id)}
                        disabled={procesando === p.pago_id} className="gap-2">
                        {procesando === p.pago_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                        Procesar
                      </Button>
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
