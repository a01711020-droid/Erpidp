/**
 * PERSONAL — Gestión de Personal
 * UI 100% fiel a Figma: header negro, tabs Nómina/Administración, consolidado semanal
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft, UserCog, UserPlus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Empleado {
  empleado_id: string; nombre_completo: string; puesto: string;
  departamento: string; obra_asignada: string | null;
  salario_semanal: number; tipo: 'destajista' | 'personal';
  clave: string; estatus: string;
}
interface NominaRes { data: Empleado[]; total: number; semana: number; anio: number; }

const SEMANAS = Array.from({ length: 52 }, (_, i) => `Semana ${i + 1}`);
const ANIOS = ['2024', '2025', '2026'];

export default function PersonalDirectorio() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'nomina' | 'admin'>('nomina');
  const [semana, setSemana] = useState(7);
  const [anio, setAnio] = useState('2026');

  const { status, data, error, reload } = useApi<NominaRes>(
    `${EP.empleados}?semana=${semana}&anio=${anio}`,
    d => !d?.data
  );

  if (status === 'loading') return <PageLoading mensaje="Cargando personal..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;

  const empleados = data?.data ?? [];
  const destajistas = empleados.filter(e => e.tipo === 'destajista').length;
  const personalCount = empleados.filter(e => e.tipo === 'personal').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header negro */}
      <div className="bg-slate-900 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white p-1">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="p-2 bg-slate-700 rounded-lg">
              <UserCog className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Personal</h1>
              <p className="text-sm text-gray-400">Control y administración de nómina</p>
            </div>
          </div>
          <Button className="gap-2 bg-white text-slate-900 hover:bg-gray-100">
            <UserPlus className="h-4 w-4" /> Nuevo Empleado
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="bg-gray-200 rounded-xl p-1 flex mb-6">
          <button
            onClick={() => setTab('nomina')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              tab === 'nomina' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4" /> Consolidado de Nómina
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              tab === 'admin' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCog className="h-4 w-4" /> Administración de Personal
          </button>
        </div>

        {/* Consolidado Nómina */}
        {tab === 'nomina' && (
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold">
                  Consolidado Total{empleados.length > 0 ? ` - Semana ${semana}` : ''}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-700">Año {anio}</div>
                <div className="text-xs text-gray-400">{destajistas} Destajistas + {personalCount} Personal</div>
              </div>
            </div>

            {/* Selector semana */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setSemana(s => Math.max(1, s - 1))} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <Select value={`Semana ${semana}`} onValueChange={v => setSemana(parseInt(v.replace('Semana ', '')))}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>{SEMANAS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={anio} onValueChange={setAnio}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{ANIOS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSemana(s => Math.min(52, s + 1))} className="gap-1">
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabla o empty */}
            {empleados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="font-semibold text-gray-500 mb-1">Sin Registros de Nómina</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm">
                  No hay datos de nómina para mostrar. Registre empleados y destajos para ver el consolidado.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#1e293b' }}>
                    {['Tipo','Nombre','Clave','Días','Monto de Pago S'+semana].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {empleados.map(e => (
                    <tr key={e.empleado_id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          e.tipo === 'destajista' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {e.tipo === 'destajista' ? 'Destajista' : 'Personal'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium">{e.nombre_completo}</td>
                      <td className="px-5 py-3 font-mono text-gray-500 text-xs">{e.clave}</td>
                      <td className="px-5 py-3 text-gray-500">{e.tipo === 'destajista' ? '-' : '7'}</td>
                      <td className="px-5 py-3 font-semibold text-right">${e.salario_semanal.toLocaleString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Admin de personal */}
        {tab === 'admin' && (
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Directorio de Personal</h2>
              <Button className="gap-2" onClick={() => navigate('/personal/nuevo')}>
                <UserPlus className="h-4 w-4" /> Nuevo Empleado
              </Button>
            </div>
            {empleados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <UserCog className="h-12 w-12 text-gray-200 mb-4" />
                <p className="text-gray-400">No hay empleados registrados</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {['Nombre','Puesto','Departamento','Obra','Estado'].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {empleados.map(e => (
                    <tr key={e.empleado_id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium">{e.nombre_completo}</td>
                      <td className="px-5 py-3 text-gray-600">{e.puesto}</td>
                      <td className="px-5 py-3 text-gray-500">{e.departamento}</td>
                      <td className="px-5 py-3">{e.obra_asignada ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          e.estatus === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>{e.estatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
