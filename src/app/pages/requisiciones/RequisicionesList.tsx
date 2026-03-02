/**
 * LISTA DE REQUISICIONES
 *
 * Carga requisiciones reales desde el dataAdapter.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { RequisicionMaterial } from '@/core/data/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Plus, Loader2, AlertCircle, ClipboardList, RefreshCw } from 'lucide-react';

const URGENCIA_STYLE: Record<string, string> = {
  urgente: 'bg-red-50 text-red-700 border-red-300',
  normal: 'bg-blue-50 text-blue-700 border-blue-300',
  planeado: 'bg-slate-50 text-slate-600 border-slate-300',
};

const ESTATUS_STYLE: Record<string, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  en_revision: 'bg-blue-50 text-blue-700 border-blue-300',
  aprobada: 'bg-green-50 text-green-700 border-green-300',
  rechazada: 'bg-red-50 text-red-700 border-red-300',
  convertida_oc: 'bg-purple-50 text-purple-700 border-purple-300',
};

export default function RequisicionesList() {
  const { user } = useAuth();
  const [requisiciones, setRequisiciones] = useState<RequisicionMaterial[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [filtroEstatus, setFiltroEstatus] = useState<string>('todos');

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listRequisiciones();
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setRequisiciones(res.data);
      setStatus(res.data.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  const filtradas = filtroEstatus === 'todos'
    ? requisiciones
    : requisiciones.filter(r => r.estatus === filtroEstatus);

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
        <ClipboardList className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">No hay requisiciones</p>
        {user?.rol !== 'comprador' && (
          <Button asChild size="sm"><Link to="/requisiciones/nueva"><Plus className="w-4 h-4 mr-2" />Nueva Requisición</Link></Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Requisiciones</h2>
          <p className="text-slate-500 text-sm mt-1">{filtradas.length} de {requisiciones.length} requisiciones</p>
        </div>
        {user?.rol !== 'comprador' && (
          <Button asChild><Link to="/requisiciones/nueva"><Plus className="w-4 h-4 mr-2" />Nueva Requisición</Link></Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['todos', 'pendiente', 'en_revision', 'aprobada', 'rechazada', 'convertida_oc'].map(e => (
          <button
            key={e}
            onClick={() => setFiltroEstatus(e)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              filtroEstatus === e ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {e === 'todos' ? 'Todos' : e.replace('_', ' ')}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Número', 'Obra', 'Solicitado por', 'Urgencia', 'Estado', 'Fecha', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.map(r => (
                  <tr key={r.requisicion_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold">{r.numero_requisicion}</td>
                    <td className="px-4 py-3 text-slate-600">{r.obra_id}</td>
                    <td className="px-4 py-3">{r.residente_nombre}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={URGENCIA_STYLE[r.urgencia] || ''}>{r.urgencia}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={ESTATUS_STYLE[r.estatus] || ''}>{r.estatus.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(r.fecha_creacion).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/requisiciones/${r.requisicion_id}`}>Ver</Link>
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
