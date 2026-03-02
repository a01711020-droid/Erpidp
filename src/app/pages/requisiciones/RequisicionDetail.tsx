/**
 * DETALLE DE REQUISICIÓN
 *
 * Carga una requisición real por ID desde el dataAdapter.
 * Muestra datos, ítems y comentarios.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { RequisicionMaterial, RequisicionMaterialItem, RequisicionComentario } from '@/core/data/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Send } from 'lucide-react';

const ESTATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  en_revision: 'bg-blue-50 text-blue-700 border-blue-300',
  aprobada: 'bg-green-50 text-green-700 border-green-300',
  rechazada: 'bg-red-50 text-red-700 border-red-300',
  convertida_oc: 'bg-purple-50 text-purple-700 border-purple-300',
};

export default function RequisicionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [req, setReq] = useState<RequisicionMaterial | null>(null);
  const [items, setItems] = useState<RequisicionMaterialItem[]>([]);
  const [comentarios, setComentarios] = useState<RequisicionComentario[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  async function cargar() {
    if (!id) return;
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.getRequisicion(id);
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setReq(res.data!.requisicion);
      setItems(res.data!.items);
      setComentarios(res.data!.comentarios);
      setStatus('data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, [id]);

  async function handleSendComment(e: React.FormEvent) {
    e.preventDefault();
    if (!mensaje.trim() || !id || !user) return;
    setSendingMsg(true);
    const res = await dataAdapter.addComentarioRequisicion(id, user.nombre, user.rol, mensaje.trim());
    setSendingMsg(false);
    if (res.status === 'success') {
      setComentarios(prev => [...prev, res.data!]);
      setMensaje('');
    }
  }

  if (status === 'loading') return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  if (status === 'error' || !req) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/requisiciones')} className="gap-2"><ArrowLeft className="w-4 h-4" />Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/requisiciones')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Requisición {req.numero_requisicion}</h2>
        <Badge variant="outline" className={ESTATUS_STYLE[req.estatus] || ''}>{req.estatus.replace('_', ' ')}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-slate-800 mb-3">Información</h3>
            {[
              ['Número', req.numero_requisicion],
              ['Obra', req.obra_id],
              ['Solicitado por', req.residente_nombre],
              ['Urgencia', req.urgencia],
              ['Fecha creación', new Date(req.fecha_creacion).toLocaleDateString('es-MX')],
              ['Entrega requerida', req.fecha_entrega_requerida ? new Date(req.fecha_entrega_requerida).toLocaleDateString('es-MX') : '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800">{value}</span>
              </div>
            ))}
            {req.observaciones && (
              <div className="pt-2 border-t">
                <p className="text-xs text-slate-500 mb-1">Observaciones</p>
                <p className="text-sm text-slate-700">{req.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Materiales ({items.length})</h3>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.item_id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <span className="text-slate-400 w-6">{i + 1}.</span>
                  <span className="flex-1">{item.descripcion}</span>
                  <span className="text-slate-600 font-medium ml-4">{item.cantidad} {item.unidad}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comentarios */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Comentarios ({comentarios.length})</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comentarios.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Sin comentarios aún</p>
            )}
            {comentarios.map(c => (
              <div key={c.comentario_id} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.autor}</span>
                  <span className="text-xs text-slate-400">{new Date(c.fecha_comentario).toLocaleString('es-MX')}</span>
                </div>
                <p className="text-sm text-slate-700">{c.mensaje}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendComment} className="flex gap-2">
            <input value={mensaje} onChange={e => setMensaje(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
            <Button type="submit" size="sm" disabled={sendingMsg || !mensaje.trim()} className="gap-2">
              {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
