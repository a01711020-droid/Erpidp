/**
 * PAGOS — PROGRAMACIÓN SEMANAL
 *
 * Carga pagos pendientes reales desde el dataAdapter.
 */

import { useState, useEffect } from 'react';
import { dataAdapter } from '@/core/data';
import type { Pago } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Loader2, AlertCircle, CreditCard, RefreshCw } from 'lucide-react';

const METODO_LABEL: Record<string, string> = {
  transferencia: 'Transferencia',
  cheque: 'Cheque',
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
};

const ESTATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  aplicado: 'bg-green-50 text-green-700 border-green-300',
  cancelado: 'bg-red-50 text-red-700 border-red-300',
};

export default function PagosProgramacion() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listPagos();
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setPagos(res.data);
      setStatus(res.data.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
        <CreditCard className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">No hay pagos programados</p>
      </div>
    );
  }

  const pendientes = pagos.filter(p => p.estatus === 'pendiente');
  const totalPendiente = pendientes.reduce((s, p) => s + p.monto_pagado, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Programación de Pagos</h2>
          <p className="text-slate-500 text-sm mt-1">
            {pendientes.length} pago{pendientes.length !== 1 ? 's' : ''} pendiente{pendientes.length !== 1 ? 's' : ''} — 
            Total: <span className="font-semibold text-slate-800">${totalPendiente.toLocaleString('es-MX')}</span>
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Número', 'OC', 'Fecha Programada', 'Monto', 'Método', 'Estado'].map(h => (
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
                    <td className="px-4 py-3">{METODO_LABEL[p.metodo_pago] || p.metodo_pago}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={ESTATUS_STYLE[p.estatus] || ''}>{p.estatus}</Badge>
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
