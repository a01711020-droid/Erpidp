/**
 * CREAR REQUISICIÓN DE MATERIAL
 *
 * Formulario real conectado al dataAdapter.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { Obra, CreateRequisicionDTO } from '@/core/data/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Plus, Trash2, Loader2, Save } from 'lucide-react';

interface ItemForm { descripcion: string; cantidad: number; unidad: string; }

const UNIDADES = ['PZA', 'KG', 'M2', 'M3', 'ML', 'LT', 'TON', 'JGO', 'LTE', 'SVC'];

export default function RequisicionCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [obraId, setObraId] = useState('');
  const [urgencia, setUrgencia] = useState<'urgente' | 'normal' | 'planeado'>('normal');
  const [fechaEntregaRequerida, setFechaEntregaRequerida] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ItemForm[]>([{ descripcion: '', cantidad: 1, unidad: 'PZA' }]);

  useEffect(() => {
    dataAdapter.listObras({ estatus: 'activa' }).then(res => {
      if (res.status === 'success') setObras(res.data);
      setLoading(false);
    });
  }, []);

  function addItem() { setItems(prev => [...prev, { descripcion: '', cantidad: 1, unidad: 'PZA' }]); }
  function removeItem(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof ItemForm, value: string | number) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!obraId) { setError('Selecciona una obra'); return; }
    if (items.some(i => !i.descripcion || i.cantidad <= 0)) { setError('Todos los ítems requieren descripción y cantidad'); return; }

    setSaving(true);
    const dto: CreateRequisicionDTO = {
      obra_id: obraId,
      residente_nombre: user?.nombre || 'Residente',
      urgencia,
      fecha_entrega_requerida: fechaEntregaRequerida || undefined,
      observaciones: observaciones || undefined,
      items: items.map(i => ({ descripcion: i.descripcion, cantidad: i.cantidad, unidad: i.unidad })),
    };

    const res = await dataAdapter.createRequisicion(dto);
    setSaving(false);

    if (res.status === 'error') { setError(res.error || 'Error al crear'); return; }
    navigate('/requisiciones');
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/requisiciones')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Nueva Requisición</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Urgencia</label>
              <select value={urgencia} onChange={e => setUrgencia(e.target.value as typeof urgencia)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="normal">Normal</option>
                <option value="urgente">Urgente</option>
                <option value="planeado">Planeado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de entrega requerida</label>
              <input type="date" value={fechaEntregaRequerida} onChange={e => setFechaEntregaRequerida(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solicitado por</label>
              <input value={user?.nombre || ''} disabled
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
              <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} rows={2}
                placeholder="Instrucciones adicionales..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Materiales solicitados</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                <Plus className="w-4 h-4" />Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-6">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Descripción</label>}
                    <input value={item.descripcion} onChange={e => updateItem(i, 'descripcion', e.target.value)}
                      placeholder="Material o insumo..." required
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Cantidad</label>}
                    <input type="number" min="0.01" step="0.01" value={item.cantidad}
                      onChange={e => updateItem(i, 'cantidad', parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500" />
                  </div>
                  <div className="col-span-3">
                    {i === 0 && <label className="block text-xs text-slate-500 mb-1">Unidad</label>}
                    <select value={item.unidad} onChange={e => updateItem(i, 'unidad', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500">
                      {UNIDADES.map(u => <option key={u}>{u}</option>)}
                    </select>
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
          </CardContent>
        </Card>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/requisiciones')}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Crear Requisición</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
