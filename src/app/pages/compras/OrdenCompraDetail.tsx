/**
 * DETALLE DE ORDEN DE COMPRA
 *
 * Carga una OC real por ID desde el dataAdapter.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { OrdenCompra, OrdenCompraItem } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const ESTATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  aprobada: 'bg-blue-50 text-blue-700 border-blue-300',
  rechazada: 'bg-red-50 text-red-700 border-red-300',
  entregada: 'bg-green-50 text-green-700 border-green-300',
  cancelada: 'bg-slate-50 text-slate-500 border-slate-300',
};

export default function OrdenCompraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [items, setItems] = useState<OrdenCompraItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    if (!id) return;
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.getOrdenCompra(id);
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setOrden(res.data!.orden);
      setItems(res.data!.items);
      setStatus('data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, [id]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (status === 'error' || !orden) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">{error || 'Orden no encontrada'}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/compras/ordenes')} className="gap-2"><ArrowLeft className="w-4 h-4" />Volver</Button>
        </div>
      </div>
    );
  }

  const est = ESTATUS_STYLE[orden.estatus] || '';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/compras/ordenes')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">OC {orden.numero_oc}</h2>
        <Badge variant="outline" className={est}>{orden.estatus}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-slate-800 mb-3">Información General</h3>
            <Row label="Número OC" value={orden.numero_oc} />
            <Row label="Obra" value={orden.obra_id} />
            <Row label="Proveedor" value={orden.proveedor_id} />
            <Row label="Comprador" value={orden.comprador} />
            <Row label="Tipo entrega" value={orden.tipo_entrega} />
            <Row label="Fecha creación" value={new Date(orden.fecha_creacion).toLocaleDateString('es-MX')} />
            <Row label="Fecha entrega" value={new Date(orden.fecha_entrega).toLocaleDateString('es-MX')} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-slate-800 mb-3">Resumen Financiero</h3>
            <Row label="Subtotal" value={`$${orden.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
            <Row label={`Descuento (${orden.porcentaje_descuento}%)`} value={`-$${orden.monto_descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
            <Row label="IVA" value={`$${orden.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
            <div className="border-t pt-3">
              <Row label="Total" value={`$${orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} bold />
            </div>
            {orden.observaciones && (
              <div className="pt-2">
                <p className="text-xs text-slate-500 font-medium mb-1">Observaciones</p>
                <p className="text-sm text-slate-700">{orden.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Ítems ({items.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['#', 'Descripción', 'Cantidad', 'Unidad', 'P. Unitario', 'Subtotal'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item, i) => (
                  <tr key={item.item_id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-2">{item.descripcion}</td>
                    <td className="px-4 py-2">{item.cantidad}</td>
                    <td className="px-4 py-2">{item.unidad}</td>
                    <td className="px-4 py-2">${item.precio_unitario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 font-semibold">${item.subtotal_item.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? 'font-bold text-slate-900' : 'text-slate-800'}>{value}</span>
    </div>
  );
}
