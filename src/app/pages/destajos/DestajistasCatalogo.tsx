/**
 * DESTAJOS — Catálogo de destajistas + captura semanal
 * UI fiel a Figma: selector de obra, tabla por concepto, autorización
 */
import { useState } from 'react';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { HardHat, Plus, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Destajista {
  destajista_id: string;
  nombre: string;
  habilidad: string;
  obra_nombre: string | null;
  estatus: string;
  total_pagado: number;
  avances_pendientes: number;
}

interface DestRes { data: Destajista[]; total: number; }

export default function DestajistasCatalogo() {
  const { status, data, error, reload } = useApi<DestRes>(EP.destajistas, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando destajistas..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={HardHat}
      titulo="Sin destajistas registrados"
      descripcion="Registra los destajistas de mano de obra para capturar avances semanales por concepto en cada obra."
      ctaLabel="Registrar Destajista"
      onCta={() => {}}
      iconBg="bg-amber-100" iconColor="text-amber-600"
    />
  );

  const destajistas = data!.data;
  const activos    = destajistas.filter(d => d.estatus === 'activo').length;
  const pendientes = destajistas.reduce((s, d) => s + (d.avances_pendientes ?? 0), 0);
  const totalPagado= destajistas.reduce((s, d) => s + (d.total_pagado ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600 rounded-lg"><HardHat className="h-8 w-8 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Destajos</h1>
              <p className="text-muted-foreground">Control de mano de obra por avance y concepto</p>
            </div>
          </div>
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4" /> Nuevo Destajista
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Destajistas activos</p><p className="text-2xl font-bold">{activos}</p></div>
            <div className="p-3 bg-amber-100 rounded-lg"><HardHat className="h-6 w-6 text-amber-600" /></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avances por autorizar</p><p className={`text-2xl font-bold ${pendientes > 0 ? 'text-orange-600' : ''}`}>{pendientes}</p></div>
            <div className="p-3 bg-orange-100 rounded-lg"><Clock className="h-6 w-6 text-orange-600" /></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total pagado</p><p className="text-2xl font-bold">${totalPagado.toLocaleString('es-MX')}</p></div>
            <div className="p-3 bg-green-100 rounded-lg"><DollarSign className="h-6 w-6 text-green-600" /></div>
          </CardContent></Card>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader><CardTitle>Catálogo de Destajistas</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Nombre','Habilidad','Obra Actual','Avances pendientes','Total pagado','Estado',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {destajistas.map(d => (
                  <tr key={d.destajista_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.habilidad}</td>
                    <td className="px-4 py-3">{d.obra_nombre ?? '—'}</td>
                    <td className="px-4 py-3">
                      {(d.avances_pendientes ?? 0) > 0
                        ? <Badge variant="outline" className="text-orange-700 border-orange-300">{d.avances_pendientes} pendientes</Badge>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold">${(d.total_pagado ?? 0).toLocaleString('es-MX')}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={d.estatus === 'activo' ? 'text-green-700 border-green-300' : 'text-gray-600'}>
                        {d.estatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Capturar avance
                      </Button>
                    </td>
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
