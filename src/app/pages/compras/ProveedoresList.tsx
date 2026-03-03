import { useNavigate } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus, Users, Eye } from 'lucide-react';

interface Proveedor {
  proveedor_id: string;
  alias_proveedor: string;
  razon_social: string;
  rfc: string;
  contacto_principal: string | null;
  tipo_proveedor: string | null;
  dias_credito: number;
  activo: boolean;
}

interface ProvRes { data: Proveedor[]; total: number; }

export default function ProveedoresList() {
  const navigate = useNavigate();
  const { status, data, error, reload } = useApi<ProvRes>(EP.proveedores, d => d.data.length === 0);

  if (status === 'loading') return <PageLoading mensaje="Cargando proveedores..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty') return (
    <PageEmpty
      icon={Users}
      titulo="Sin proveedores registrados"
      descripcion="Registra tu primer proveedor para poder generar órdenes de compra."
      ctaLabel="Nuevo Proveedor"
      onCta={() => navigate('/compras/proveedores/nuevo')}
      iconBg="bg-green-100" iconColor="text-green-500"
    />
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg"><Users className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold">Proveedores</h1>
            <p className="text-sm text-muted-foreground">{data!.total} proveedores</p>
          </div>
        </div>
        <Button onClick={() => navigate('/compras/proveedores/nuevo')} className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" /> Nuevo Proveedor
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Catálogo de Proveedores</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Alias','Razón Social','RFC','Contacto','Tipo','Crédito (días)','Estado',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data!.data.map(p => (
                <tr key={p.proveedor_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{p.alias_proveedor}</td>
                  <td className="px-4 py-3">{p.razon_social}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.rfc}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.contacto_principal ?? '—'}</td>
                  <td className="px-4 py-3">{p.tipo_proveedor ?? '—'}</td>
                  <td className="px-4 py-3">{p.dias_credito}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={p.activo ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/compras/proveedores/${p.proveedor_id}`)}>
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
