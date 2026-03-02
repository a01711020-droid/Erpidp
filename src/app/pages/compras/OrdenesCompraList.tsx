/**
 * LISTA DE ÓRDENES DE COMPRA
 *
 * Carga órdenes reales desde el dataAdapter.
 * Maneja estados loading / error / empty / data.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { OrdenCompra } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Plus, Loader2, AlertCircle, ShoppingCart, RefreshCw } from 'lucide-react';

const ESTATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  aprobada: 'bg-blue-50 text-blue-700 border-blue-300',
  rechazada: 'bg-red-50 text-red-700 border-red-300',
  entregada: 'bg-green-50 text-green-700 border-green-300',
  cancelada: 'bg-slate-50 text-slate-500 border-slate-300',
};

export default function OrdenesCompraList() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listOrdenesCompra();
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setOrdenes(res.data);
      setStatus(res.data.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={cargar} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Reintentar
        </Button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
        <ShoppingCart className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">No hay órdenes de compra</p>
        <Button asChild size="sm">
          <Link to="/compras/ordenes/nueva"><Plus className="w-4 h-4 mr-2" />Nueva Orden</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Órdenes de Compra</h2>
          <p className="text-slate-500 text-sm mt-1">{ordenes.length} orden{ordenes.length !== 1 ? 'es' : ''} encontrada{ordenes.length !== 1 ? 's' : ''}</p>
        </div>
        <Button asChild>
          <Link to="/compras/ordenes/nueva"><Plus className="w-4 h-4 mr-2" />Nueva Orden</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Número OC', 'Obra', 'Proveedor', 'Fecha Entrega', 'Total', 'Estado', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {ordenes.map(oc => (
                  <tr key={oc.oc_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold">{oc.numero_oc}</td>
                    <td className="px-4 py-3 text-slate-600">{oc.obra_id}</td>
                    <td className="px-4 py-3 text-slate-600">{oc.proveedor_id}</td>
                    <td className="px-4 py-3">{new Date(oc.fecha_entrega).toLocaleDateString('es-MX')}</td>
                    <td className="px-4 py-3 font-semibold">${oc.total.toLocaleString('es-MX')}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={ESTATUS_STYLE[oc.estatus] || ''}>
                        {oc.estatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/compras/ordenes/${oc.oc_id}`}>Ver</Link>
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
