import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { HardHat, Plus } from 'lucide-react';

interface Destajista {
  destajista_id: string;
  nombre: string;
  habilidad: string;
  obra_nombre: string | null;
  estatus: string;
}

interface DestRes { data: Destajista[]; total: number; }

export default function DestajistasCatalogo() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<DestRes>(EP.destajistas, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando destajistas..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={HardHat}
      titulo="Sin destajistas registrados"
      descripcion="Registra destajistas para poder capturar avances semanales de mano de obra en cada obra."
      ctaLabel="Registrar Destajista"
      onCta={() => navigate('/destajos/nuevo')}
      iconBg="bg-amber-100" iconColor="text-amber-600"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg"><HardHat className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Destajistas</h1>
            <p className="text-sm text-muted-foreground">{data!.total} destajistas</p>
          </div>
        </div>
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4" /> Nuevo Destajista
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Destajistas</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Nombre','Habilidad','Obra Actual','Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(d => (
                <tr key={d.destajista_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.habilidad}</td>
                  <td className="px-4 py-3">{d.obra_nombre ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={d.estatus === 'activo' ? 'text-green-700 border-green-300' : 'text-gray-600'}>{d.estatus}</Badge>
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
