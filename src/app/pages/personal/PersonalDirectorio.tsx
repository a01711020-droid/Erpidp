/**
 * PERSONAL — Directorio de empleados
 * UI fiel a Figma: tabla con departamento, obra asignada, acciones
 */
import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { UserCog, Plus, Building2, Users, DollarSign, Eye } from 'lucide-react';

interface Empleado {
  empleado_id: string;
  nombre_completo: string;
  puesto: string;
  departamento: string;
  obra_asignada: string | null;
  salario_mensual: number;
  estatus: string;
  tipo: 'nomina' | 'honorarios' | 'otro';
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
      descripcion="Registra el personal de oficina y obra para llevar el control de nómina y distribución de indirectos a proyectos."
      ctaLabel="Nuevo Empleado"
      onCta={() => navigate('/personal/nuevo')}
      iconBg="bg-gray-100" iconColor="text-gray-500"
    />
  );

  const empleados = data!.data;
  const activos  = empleados.filter(e => e.estatus === 'activo').length;
  const nomina   = empleados.filter(e => e.tipo === 'nomina').reduce((s, e) => s + e.salario_mensual, 0);
  const asignados = empleados.filter(e => e.obra_asignada).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-700 rounded-lg"><UserCog className="h-8 w-8 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Personal</h1>
              <p className="text-muted-foreground">Directorio de empleados y control de nómina / indirectos</p>
            </div>
          </div>
          <Button onClick={() => navigate('/personal/nuevo')} className="gap-2 bg-gray-700 hover:bg-gray-800">
            <Plus className="h-4 w-4" /> Nuevo Empleado
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Empleados activos</p><p className="text-2xl font-bold">{activos}</p></div>
            <div className="p-3 bg-gray-100 rounded-lg"><Users className="h-6 w-6 text-gray-600" /></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Nómina mensual</p><p className="text-2xl font-bold">${nomina.toLocaleString('es-MX')}</p></div>
            <div className="p-3 bg-green-100 rounded-lg"><DollarSign className="h-6 w-6 text-green-600" /></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Asignados a obra</p><p className="text-2xl font-bold">{asignados}</p></div>
            <div className="p-3 bg-blue-100 rounded-lg"><Building2 className="h-6 w-6 text-blue-600" /></div>
          </CardContent></Card>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader><CardTitle>Directorio de Personal</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Nombre','Puesto','Departamento','Tipo','Salario mensual','Obra asignada','Estado',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {empleados.map(e => (
                  <tr key={e.empleado_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{e.nombre_completo}</td>
                    <td className="px-4 py-3">{e.puesto}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.departamento}</td>
                    <td className="px-4 py-3 capitalize">
                      <Badge variant="outline" className={e.tipo==='nomina'?'text-blue-700 border-blue-300':'text-purple-700 border-purple-300'}>{e.tipo}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">${e.salario_mensual.toLocaleString('es-MX')}</td>
                    <td className="px-4 py-3">{e.obra_asignada ?? <span className="text-gray-400">—</span>}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={e.estatus==='activo'?'text-green-700 border-green-300':'text-gray-500'}>{e.estatus}</Badge>
                    </td>
                    <td className="px-4 py-3"><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
