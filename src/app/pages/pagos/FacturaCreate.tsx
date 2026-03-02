/**
 * REGISTRAR FACTURA
 * Asocia una factura a un pago / OC existente.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { OrdenCompra } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function FacturaCreate() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ocId, setOcId] = useState('');
  const [facturaNumero, setFacturaNumero] = useState('');
  const [monto, setMonto] = useState(0);
  const [metodoPago, setMetodoPago] = useState<'transferencia' | 'cheque' | 'efectivo' | 'tarjeta'>('transferencia');
  const [fechaPago, setFechaPago] = useState('');
  const [referencia, setReferencia] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    dataAdapter.listOrdenesCompra({ estatus: 'aprobada' }).then(res => {
      if (res.status === 'success') setOrdenes(res.data);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ocId || !facturaNumero || !fechaPago || monto <= 0) {
      setError('OC, número de factura, fecha y monto son requeridos');
      return;
    }
    setSaving(true);
    const oc = ordenes.find(o => o.oc_id === ocId);
    const res = await dataAdapter.createPago({
      oc_id: ocId,
      fecha_pago: fechaPago,
      monto_pagado: monto,
      metodo_pago: metodoPago,
      referencia_pago: referencia || undefined,
      factura_numero: facturaNumero,
      notas: notas || undefined,
    });
    setSaving(false);
    if (res.status === 'error') { setError(res.error || 'Error al registrar'); return; }
    navigate('/pagos/facturas');
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/pagos/facturas')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Registrar Factura</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Orden de Compra *</label>
              <select value={ocId} onChange={e => setOcId(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="">Selecciona una OC aprobada...</option>
                {ordenes.map(o => <option key={o.oc_id} value={o.oc_id}>{o.numero_oc} — ${o.total.toLocaleString('es-MX')}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de Factura *</label>
              <input value={facturaNumero} onChange={e => setFacturaNumero(e.target.value)} required
                placeholder="Ej: A-00123" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto *</label>
              <input type="number" min="0.01" step="0.01" value={monto} onChange={e => setMonto(parseFloat(e.target.value) || 0)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Método de pago</label>
              <select value={metodoPago} onChange={e => setMetodoPago(e.target.value as typeof metodoPago)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de pago *</label>
              <input type="date" value={fechaPago} onChange={e => setFechaPago(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Referencia / No. de operación</label>
              <input value={referencia} onChange={e => setReferencia(e.target.value)}
                placeholder="Número de transferencia, cheque..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
          </CardContent>
        </Card>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/pagos/facturas')}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Registrar Factura</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
