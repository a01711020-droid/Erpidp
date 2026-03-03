/**
 * REQUISICIONES — Vista de residente
 * UI fiel a Figma: mobile-first, tarjetas con chat, urgencia visual
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Plus, Package, FileText, Clock, AlertCircle, CheckCircle, Zap, Calendar,
  Send, MessageSquare, Lock,
} from 'lucide-react';

interface ReqItem { descripcion: string; cantidad: number; unidad: string; }
interface Comentario { comentario_id: string; autor: string; rol: string; mensaje: string; fecha: string; }
interface Req {
  requisicion_id: string;
  numero_requisicion: string;
  obra_codigo: string;
  obra_nombre: string;
  residente_nombre: string;
  urgencia: 'urgente' | 'normal' | 'planeado';
  estatus: string;
  fecha_creacion: string;
  fecha_entrega_requerida: string | null;
  items: ReqItem[];
  comentarios: Comentario[];
}
interface ReqRes { data: Req[]; total: number; }

const ESTATUS_BADGE: Record<string, string> = {
  pendiente:     'bg-yellow-100 text-yellow-800 border-yellow-300',
  en_revision:   'bg-blue-100 text-blue-800 border-blue-300',
  aprobada:      'bg-green-100 text-green-800 border-green-300',
  convertida_oc: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rechazada:     'bg-red-100 text-red-800 border-red-300',
};

const ESTATUS_ICON: Record<string, React.ReactNode> = {
  pendiente:     <Clock className="h-3 w-3 mr-1" />,
  en_revision:   <AlertCircle className="h-3 w-3 mr-1" />,
  aprobada:      <CheckCircle className="h-3 w-3 mr-1" />,
  convertida_oc: <CheckCircle className="h-3 w-3 mr-1" />,
  rechazada:     <AlertCircle className="h-3 w-3 mr-1" />,
};

function UrgenciaDisplay({ u }: { u: string }) {
  if (u === 'urgente')  return <div className="flex items-center gap-2 text-red-600"><Zap className="h-5 w-5 fill-red-600" /><span className="font-semibold">Urgente</span></div>;
  if (u === 'normal')   return <div className="flex items-center gap-2 text-blue-600"><Clock className="h-5 w-5" /><span className="font-semibold">Normal</span></div>;
  return <div className="flex items-center gap-2 text-green-600"><Calendar className="h-5 w-5" /><span className="font-semibold">Planeado</span></div>;
}

export default function RequisicionesList() {
  const { status, data, error, reload } = useApi<ReqRes>(EP.requisiciones, d => !d.data);
  const [nuevoComentario, setNuevoComentario] = useState<Record<string, string>>({});

  if (status === 'loading') return <PageLoading mensaje="Cargando requisiciones..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const requisiciones = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Requisiciones</h1>
              <p className="text-sm text-amber-100">Solicitudes de material por obra</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-amber-200">Total</p>
              <p className="font-bold text-3xl">{requisiciones.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-amber-200">Urgentes</p>
              <p className="font-bold text-3xl text-red-300">{requisiciones.filter(r => r.urgencia === 'urgente' && r.estatus !== 'convertida_oc').length}</p>
            </div>
          </div>
        </div>

        {/* Botón nueva */}
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 py-6 text-lg shadow-lg gap-2"
        >
          <Plus className="h-6 w-6" /> Nueva Requisición
        </Button>

        {/* Lista */}
        <h2 className="text-lg font-bold text-gray-900 px-1">Requisiciones</h2>

        {requisiciones.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-amber-700" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No hay requisiciones</p>
              <p className="text-sm text-muted-foreground mb-4">Crea la primera solicitud de material</p>
              <Button className="bg-amber-600 hover:bg-amber-700" size="lg">
                <Plus className="h-5 w-5 mr-2" /> Crear Requisición
              </Button>
            </CardContent>
          </Card>
        ) : (
          requisiciones.map(req => (
            <Card key={req.requisicion_id} className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardContent className="p-5 space-y-4">
                {/* Folio + estatus */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono font-bold text-base mb-2">{req.numero_requisicion}</div>
                    <Badge className={ESTATUS_BADGE[req.estatus] ?? ''}>
                      {ESTATUS_ICON[req.estatus]}
                      {req.estatus.replace('_',' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-right text-muted-foreground">
                    <div>{req.obra_codigo}</div>
                    <div className="text-xs">{req.obra_nombre}</div>
                  </div>
                </div>

                {/* Urgencia */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Urgencia:</span>
                  <UrgenciaDisplay u={req.urgencia} />
                </div>

                {/* Fechas */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creada:</span>
                    <span className="font-medium">{new Date(req.fecha_creacion).toLocaleDateString('es-MX')}</span>
                  </div>
                  {req.fecha_entrega_requerida && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entrega necesaria:</span>
                      <span className="font-medium">{new Date(req.fecha_entrega_requerida).toLocaleDateString('es-MX')}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                {req.items?.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-sm text-amber-900 mb-2">Materiales ({req.items.length})</h4>
                    <div className="space-y-1">
                      {req.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="text-sm text-amber-800">• {item.descripcion} — {item.cantidad} {item.unidad}</div>
                      ))}
                      {req.items.length > 2 && <div className="text-sm text-amber-700 font-medium">+{req.items.length - 2} más...</div>}
                    </div>
                  </div>
                )}

                {/* Chat */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-amber-700" />
                    <h4 className="font-semibold text-sm">Mensajes ({req.comentarios?.length ?? 0})</h4>
                  </div>
                  {req.comentarios?.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                      {req.comentarios.map(c => (
                        <div key={c.comentario_id} className={`p-3 rounded-lg text-sm ${
                          c.rol === 'residente' ? 'bg-amber-50 border-l-4 border-l-amber-500' : 'bg-blue-50 border-l-4 border-l-blue-500'
                        }`}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">{c.rol === 'residente' ? 'Tú' : 'Compras'}</span>
                            <span className="text-xs text-gray-500">{new Date(c.fecha).toLocaleDateString('es-MX')}</span>
                          </div>
                          <p>{c.mensaje}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={nuevoComentario[req.requisicion_id] ?? ''}
                      onChange={e => setNuevoComentario(prev => ({ ...prev, [req.requisicion_id]: e.target.value }))}
                      placeholder="Escribir mensaje..."
                    />
                    <Button size="icon" className="shrink-0 bg-amber-600 hover:bg-amber-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
