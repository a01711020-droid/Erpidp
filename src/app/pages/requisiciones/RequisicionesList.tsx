import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus, ClipboardList, Eye, Zap } from 'lucide-react';

interface Req {
  requisicion_id: string;
  numero_requisicion: string;
  obra_nombre: string;
  residente_nombre: string;
  urgencia: string;
  estatus: string;
  fecha_creacion: string;
  fecha_entrega_requerida: string | null;
}

interface ReqRes { data: Req[]; total: number; }

const URGENCIA_COLOR: Record<string, string> = {
  urgente:  'bg-red-50 text-red-700 border-red-300',
  normal:   'bg-blue-50 text-blue-700 border-blue-300',
  planeado: 'bg-gray-50 text-gray-700 border-gray-300',
};

const ESTATUS_COLOR: Record<string, string> = {
  pendiente:     'bg-yellow-50 text-yellow-700 border-yellow-300',
  en_revision:   'bg-orange-50 text-orange-700 border-orange-300',
  aprobada:      'bg-green-50 text-green-700 border-green-300',
  rechazada:     'bg-red-50 text-red-700 border-red-300',
  convertida_oc: 'bg-blue-50 text-blue-700 border-blue-300',
};

export default function RequisicionesList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<ReqRes>(EP.requisiciones, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando requisiciones..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={ClipboardList}
      titulo="Sin requisiciones"
      descripcion="Aún no hay requisiciones registradas. Crea la primera solicitud de material o servicio para una obra."
      ctaLabel="Nueva Requisición"
      onCta={() => navigate('/requisiciones/nueva')}
      iconBg="bg-amber-100" iconColor="text-amber-500"
    />
  );

  const urgentes = data!.data.filter(r => r.urgencia === 'urgente' && r.estatus !== 'convertida_oc').length;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg"><ClipboardList className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold">Requisiciones</h1>
            <p className="text-sm text-muted-foreground">{data!.total} requisiciones</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {urgentes > 0 && (
            <Badge className="bg-red-500 gap-1">
              <Zap className="h-3 w-3" /> {urgentes} urgentes
            </Badge>
          )}
          <Button onClick={() => navigate('/requisiciones/nueva')} className="gap-2 bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4" /> Nueva Requisición
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Requisiciones</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Número','Obra','Residente','Urgencia','Estado','Fecha','Entrega req.',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(r => (
                <tr key={r.requisicion_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold">{r.numero_requisicion}</td>
                  <td className="px-4 py-3">{r.obra_nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.residente_nombre}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={URGENCIA_COLOR[r.urgencia] ?? ''}>{r.urgencia}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={ESTATUS_COLOR[r.estatus] ?? ''}>{r.estatus.replace('_',' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">{new Date(r.fecha_creacion).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3">{r.fecha_entrega_requerida ? new Date(r.fecha_entrega_requerida).toLocaleDateString('es-MX') : '—'}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/requisiciones/${r.requisicion_id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
