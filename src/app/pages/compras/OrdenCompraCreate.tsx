/**
 * CREAR ORDEN DE COMPRA
 *
 * Formulario real conectado al dataAdapter.
 * Permite seleccionar obra, proveedor, agregar ítems y calcular totales.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { Obra, Proveedor, CreateOrdenCompraDTO } from '@/core/data/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Plus, Trash2, Loader2, Save } from 'lucide-react';

interface ItemForm {
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
}

const UNIDADES = ['PZA', 'KG', 'M2', 'M3', 'ML', 'LT', 'TON', 'JGO', 'LTE', 'SVC'];

export default function OrdenCompraCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [obras, setObras] = useState<Obra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario
  const [obraId, setObraId] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'recoleccion'>('entrega');
  const [aplicaIva, setAplicaIva] = useState(true);
  const [descuento, setDescuento] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ItemForm[]>([
    { descripcion: '', cantidad: 1, unidad: 'PZA', precio_unitario: 0 }
  ]);

  useEffect(() => {
    async function cargar() {
      const [resObras, resProv] = await Promise.all([
        dataAdapter.listObras({ estatus: 'activa' }),
        dataAdapter.listProveedores({ activo: true }),
      ]);
      if (resObras.status === 'success') setObras(resObras.data);
      if (resProv.status === 'success') setProveedores(resProv.data);
      setLoading(false);
    }
    cargar();
  }, []);

  // Cálculos
  const subtotal = items.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0);
  const montoDescuento = subtotal * (descuento / 100);
  const base = subtotal - montoDescuento;
  const iva = aplicaIva ? base * 0.16 : 0;
  const total = base + iva;

  function addItem() {
    setItems(prev => [...prev, { descripcion: '', cantidad: 1, unidad: 'PZA', precio_unitario: 0 }]);
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof ItemForm, value: string | number) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!obraId || !proveedorId || !fechaEntrega) {
      setError('Obra, proveedor y fecha de entrega son requeridos');
      return;
    }
    if (items.some(i => !i.descripcion || i.cantidad <= 0 || i.precio_unitario < 0)) {
      setError('Todos los ítems deben tener descripción, cantidad válida y precio');
      return;
    }

    setSaving(true);
    const dto: CreateOrdenCompraDTO = {
      obra_id: obraId,
      proveedor_id: proveedorId,
      comprador: user?.nombre || 'Sistema',
      fecha_entrega: fechaEntrega,
      tipo_entrega: tipoEntrega,
      aplica_iva: aplicaIva,
      porcentaje_descuento: descuento,
      observaciones: observaciones || undefined,
      items: items.map(i => ({
        descripcion: i.descripcion,
        cantidad: i.cantidad,
        unidad: i.unidad,
        precio_unitario: i.precio_unitario,
      })),
    };

    const res = await dataAdapter.createOrdenCompra(dto);
    setSaving(false);

    if (res.status === 'error') {
      setError(res.error || 'Error al crear la orden');
      return;
    }

    navigate('/compras/ordenes');
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/compras/ordenes')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Nueva Orden de Compra</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos generales */}
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Obra *</label>
              <select value={obraId} onChange={e => setObraId(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="">Selecciona una obra...</option>
                {obras.map(o => <option key={o.obra_id} value={o.obra_id}>{o.codigo_obra} — {o.nombre_obra}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor *</label>
              <select value={proveedorId} onChange={e => setProveedorId(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="">Selecciona un proveedor...</option>
                {proveedores.map(p => <option key={p.proveedor_id} value={p.proveedor_id}>{p.alias_proveedor} — {p.razon_social}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de entrega *</label>
              <input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de entrega</label>
              <select value={tipoEntrega} onChange={e => setTipoEntrega(e.target.value as 'entrega' | 'recoleccion')}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="entrega">Entrega en obra</option>
                <option value="recoleccion">Recolección</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
              <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} rows={2}
                placeholder="Notas adicionales para el proveedor..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Ítems de la Orden</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                <Plus className="w-4 h-4" />Agregar ítem
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-4">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Descripción</label>}
                    <input value={item.descripcion} onChange={e => updateItem(i, 'descripcion', e.target.value)}
                      placeholder="Material o servicio..." required
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Cantidad</label>}
                    <input type="number" min="0.01" step="0.01" value={item.cantidad}
                      onChange={e => updateItem(i, 'cantidad', parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Unidad</label>}
                    <select value={item.unidad} onChange={e => updateItem(i, 'unidad', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500">
                      {UNIDADES.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Precio unitario</label>}
                    <input type="number" min="0" step="0.01" value={item.precio_unitario}
                      onChange={e => updateItem(i, 'precio_unitario', parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500" />
                  </div>
                  <div className="col-span-1 flex items-end pb-0.5">
                    {i === 0 && <div className="h-5 mb-1" />}
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}
                      disabled={items.length === 1} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="mt-6 border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Descuento (%)</span>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" step="0.1" value={descuento}
                    onChange={e => setDescuento(parseFloat(e.target.value) || 0)}
                    className="w-20 border border-slate-300 rounded px-2 py-1 text-right text-sm" />
                  <span className="text-slate-500 w-24 text-right">-${montoDescuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={aplicaIva} onChange={e => setAplicaIva(e.target.checked)} />
                  IVA (16%)
                </label>
                <span>${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Total</span>
                <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/compras/ordenes')}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Crear Orden</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
