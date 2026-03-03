/**
 * ALMACÉN — Recepciones
 * UI fiel a Figma: lista de recepciones contra OC, faltantes, evidencia
 */
import { useState } from 'react';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Warehouse, Search, PackageCheck, Plus, Eye, AlertTriangle } from 'lucide-react';

interface Recepcion {
  recepcion_id: string;
  numero_recepcion: string;
  numero_oc: string;
  proveedor_alias: string;
  obra_nombre: string;
  quien_recibe: string | null;
  fecha_entrega: string;
  estatus: 'parcial' | 'completa' | 'con_incidencia';
  tiene_faltantes: boolean;
  tiene_evidencia: boolean;
}

interface RecRes { data: Recepcion[]; total: number; }

const ESTATUS: Record<string, { label: string; cls: string }> = {
  parcial:        { label: 'Parcial',         cls: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  completa:       { label: 'Completa',        cls: 'bg-green-50 text-green-700 border-green-300' },
  con_incidencia: { label: 'Con incidencia',  cls: 'bg-red-50 text-red-700 border-red-300' },
};

export default function AlmacenInventario() {
  const { status, data, error, reload } = useApi<RecRes>(EP.recepciones, d => d.data.length === 0);
  const [search, setSearch] = useState('');

  if (status === 'loading') return <PageLoading mensaje="Cargando recepciones..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={Warehouse}
      titulo="Sin recepciones registradas"
      descripcion="Registra la primera recepción de material contra una orden de compra emitida."
      ctaLabel="Nueva Recepción"
      onCta={() => {}}
      iconBg="bg-orange-100" iconColor="text-orange-500"
    />
  );

  const recepciones = data!.data;
  const incidencias = recepciones.filter(r => r.estatus === 'con_incidencia').length;
  const faltantes   = recepciones.filter(r => r.tiene_faltantes).length;

  const filtradas = recepciones.filter(r =>
    r.numero_recepcion.toLowerCase().includes(search.toLowerCase())
    || r.numero_oc.toLowerCase().includes(search.toLowerCase())
    || r.proveedor_alias.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-lg"><Warehouse className="h-8 w-8 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Almacén</h1>
              <p className="text-muted-foreground">Recepción de material y control de inventario</p>
            </div>
          </div>
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4" /> Nueva Recepción
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Recepciones</p><p className="text-2xl font-bold">{recepciones.length}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Completas</p><p className="text-2xl font-bold text-green-600">{recepciones.filter(r=>r.estatus==='completa').length}</p></CardContent></Card>
          <Card className={incidencias > 0 ? 'border-red-300' : ''}><CardContent className="p-5"><p className="text-sm text-muted-foreground">Con incidencia</p><p className={`text-2xl font-bold ${incidencias>0?'text-red-600':''}`}>{incidencias}</p></CardContent></Card>
          <Card className={faltantes > 0 ? 'border-orange-300' : ''}><CardContent className="p-5"><p className="text-sm text-muted-foreground">Con faltantes</p><p className={`text-2xl font-bold ${faltantes>0?'text-orange-600':''}`}>{faltantes}</p></CardContent></Card>
        </div>

        {/* Buscador */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar recepción, OC o proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader><CardTitle>Historial de Recepciones</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Recepción','OC Origen','Proveedor','Obra','Recibe','Fecha','Faltantes','Evidencia','Estado',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.map(r => {
                  const est = ESTATUS[r.estatus] ?? ESTATUS.parcial;
                  return (
                    <tr key={r.recepcion_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-semibold">{r.numero_recepcion}</td>
                      <td className="px-4 py-3 font-medium">{r.numero_oc}</td>
                      <td className="px-4 py-3">{r.proveedor_alias}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.obra_nombre}</td>
                      <td className="px-4 py-3">{r.quien_recibe ?? '—'}</td>
                      <td className="px-4 py-3">{new Date(r.fecha_entrega).toLocaleDateString('es-MX')}</td>
                      <td className="px-4 py-3">{r.tiene_faltantes ? <AlertTriangle className="h-4 w-4 text-orange-500" /> : <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3">{r.tiene_evidencia ? <PackageCheck className="h-4 w-4 text-green-500" /> : <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={est.cls}>{est.label}</Badge></td>
                      <td className="px-4 py-3"><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtradas.length === 0 && (
              <div className="text-center py-12">
                <Warehouse className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay recepciones con ese filtro</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
