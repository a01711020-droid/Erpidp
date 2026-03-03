import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { UserCog, Plus } from 'lucide-react';

interface Empleado {
  empleado_id: string;
  nombre_completo: string;
  puesto: string;
  departamento: string;
  obra_asignada: string | null;
  estatus: string;
}

interface EmpRes { data: Empleado[]; total: number; }

export default function PersonalDirectorio() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<EmpRes>(EP.empleados, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando directorio..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={UserCog}
      titulo="Sin empleados registrados"
      descripcion="Registra el personal de la empresa para llevar el control de nómina, asignaciones a obra y distribución de indirectos."
      ctaLabel="Nuevo Empleado"
      onCta={() => navigate('/personal/nuevo')}
      iconBg="bg-gray-100" iconColor="text-gray-500"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-700 rounded-lg"><UserCog className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold">Directorio de Personal</h1>
            <p className="text-sm text-muted-foreground">{data!.total} empleados</p>
          </div>
        </div>
        <Button onClick={() => navigate('/personal/nuevo')} className="gap-2 bg-gray-700 hover:bg-gray-800">
          <Plus className="h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Personal</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Nombre','Puesto','Departamento','Obra Asignada','Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(e => (
                <tr key={e.empleado_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{e.nombre_completo}</td>
                  <td className="px-4 py-3">{e.puesto}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.departamento}</td>
                  <td className="px-4 py-3">{e.obra_asignada ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={e.estatus === 'activo' ? 'text-green-700 border-green-300' : 'text-gray-600'}>{e.estatus}</Badge>
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
