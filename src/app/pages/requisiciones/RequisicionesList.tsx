/**
 * REQUISICIONES — Vista del residente
 * UI 100% fiel a Figma: fondo beige, card naranja con info de obra, botón grande naranja,
 * tarjetas con borde izquierdo, chat de mensajes
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Package, Plus, Lock, FileText, Zap, Clock, Calendar, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';

interface ReqItem { descripcion: string; cantidad: number; unidad: string; }
interface Comentario { comentario_id: string; autor: string; rol: string; mensaje: string; fecha: string; }
interface Req {
  requisicion_id: string; numero_requisicion: string;
  obra_codigo: string; obra_nombre: string; residente_nombre: string;
  urgencia: string; estatus: string;
  fecha_creacion: string; fecha_entrega_requerida: string | null;
  items: ReqItem[]; comentarios: Comentario[];
}
interface ReqRes { data: Req[]; obra_codigo?: string; obra_nombre?: string; residente_nombre?: string; }

const ESTATUS_BADGE: Record<string, string> = {
  pendiente:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  en_revision:   'bg-blue-100 text-blue-800 border-blue-200',
  aprobada:      'bg-green-100 text-green-800 border-green-200',
  convertida_oc: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rechazada:     'bg-red-100 text-red-800 border-red-200',
};
const ESTATUS_ICON: Record<string, React.ElementType> = {
  pendiente: Clock, en_revision: AlertCircle,
  aprobada: CheckCircle, convertida_oc: CheckCircle, rechazada: AlertCircle,
};

function Urgencia({ u }: { u: string }) {
  if (u === 'urgente') return <span className="flex items-center gap-1 text-red-600 font-bold"><Zap className="h-4 w-4 fill-red-600" />Urgente</span>;
  if (u === 'normal')  return <span className="flex items-center gap-1 text-blue-600 font-semibold"><Clock className="h-4 w-4" />Normal</span>;
  return <span className="flex items-center gap-1 text-green-600 font-semibold"><Calendar className="h-4 w-4" />Planeado</span>;
}

export default function RequisicionesList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<ReqRes>(EP.requisiciones, d => !d?.data);
  const [msgs, setMsgs] = useState<Record<string, string>>({});

  if (status === 'loading') return <PageLoading mensaje="Cargando requisiciones..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const reqs = data?.data ?? [];
  const obraCodigo   = reqs[0]?.obra_codigo   ?? data?.obra_codigo   ?? '---';
  const obraNombre   = reqs[0]?.obra_nombre   ?? data?.obra_nombre   ?? 'Sin Asignar';
  const residenteNom = reqs[0]?.residente_nombre ?? data?.residente_nombre ?? 'Residente de Obra';

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8' }}>
      {/* Top bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Inicio
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Card naranja de identidad */}
        <div className="rounded-xl text-white p-5 shadow-lg" style={{ background: 'linear-gradient(135deg, #c0390c, #e05a1a)' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Requisiciones</h1>
                <p className="text-sm text-orange-200">{residenteNom}</p>
              </div>
            </div>
            <button className="text-white/60 hover:text-white"><Lock className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-orange-200">Obra</p>
              <p className="font-bold text-lg">{obraCodigo}</p>
              <p className="text-xs text-orange-100">{obraNombre}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-orange-200">Requisiciones</p>
              <p className="font-bold text-2xl">{reqs.length}</p>
            </div>
          </div>
        </div>

        {/* Botón grande naranja */}
        <button
          className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
          style={{ background: '#e05a1a' }}
        >
          <Plus className="h-6 w-6" /> Nueva Requisición
        </button>

        {/* Lista */}
        <h2 className="text-lg font-bold text-gray-900">Mis Requisiciones</h2>

        {reqs.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl bg-white py-14 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No hay requisiciones</h3>
            <p className="text-sm text-gray-400 mb-4">No has creado ninguna requisición de material todavía.</p>
            <button
              className="px-5 py-2 rounded-lg text-white font-semibold flex items-center gap-2"
              style={{ background: '#e05a1a' }}
            >
              <Plus className="h-4 w-4" /> Crear Primera Requisición
            </button>
          </div>
        ) : (
          reqs.map(req => {
            const StatusIcon = ESTATUS_ICON[req.estatus] ?? Clock;
            return (
              <div key={req.requisicion_id} className="bg-white rounded-xl shadow-sm border-l-4 border-l-orange-500 overflow-hidden">
                <div className="p-5 space-y-4">
                  {/* Folio + estatus */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-gray-800">{req.numero_requisicion}</div>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mt-1 ${ESTATUS_BADGE[req.estatus] ?? ''}`}>
                        <StatusIcon className="h-3 w-3" />{req.estatus.replace('_',' ')}
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-500">{req.obra_codigo}</div>
                    </div>
                  </div>

                  {/* Urgencia */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Urgencia:</span>
                    <Urgencia u={req.urgencia} />
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Creada: </span>
                      <span className="font-medium">{new Date(req.fecha_creacion).toLocaleDateString('es-MX')}</span>
                    </div>
                    {req.fecha_entrega_requerida && (
                      <div>
                        <span className="text-gray-400">Entrega necesaria: </span>
                        <span className="font-medium">{new Date(req.fecha_entrega_requerida).toLocaleDateString('es-MX')}</span>
                      </div>
                    )}
                  </div>

                  {/* Materiales */}
                  {(req.items?.length ?? 0) > 0 && (
                    <div className="p-3 rounded-lg" style={{ background: '#fff7ed' }}>
                      <p className="text-sm font-semibold text-orange-900 mb-1">Materiales ({req.items.length})</p>
                      {req.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-sm text-orange-800">• {item.descripcion} — {item.cantidad} {item.unidad}</p>
                      ))}
                      {req.items.length > 2 && <p className="text-sm text-orange-600 font-medium">+{req.items.length - 2} más...</p>}
                    </div>
                  )}

                  {/* Mensajes */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold">Mensajes ({req.comentarios?.length ?? 0})</span>
                    </div>
                    {(req.comentarios?.length ?? 0) > 0 && (
                      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {req.comentarios.map(c => (
                          <div key={c.comentario_id} className={`p-3 rounded-lg text-sm border-l-4 ${
                            c.rol === 'residente'
                              ? 'bg-orange-50 border-l-orange-400'
                              : 'bg-blue-50 border-l-blue-400'
                          }`}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-semibold">{c.rol === 'residente' ? 'Tú' : 'Compras'}</span>
                              <span className="text-xs text-gray-400">{new Date(c.fecha).toLocaleDateString('es-MX')}</span>
                            </div>
                            <p>{c.mensaje}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        value={msgs[req.requisicion_id] ?? ''}
                        onChange={e => setMsgs(p => ({ ...p, [req.requisicion_id]: e.target.value }))}
                        placeholder="Escribir mensaje..."
                        className="bg-gray-50"
                      />
                      <Button size="icon" style={{ background: '#e05a1a' }} className="hover:opacity-90 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
