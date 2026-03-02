/**
 * LISTA DE PROVEEDORES
 *
 * Carga proveedores reales desde el dataAdapter.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { Proveedor } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Plus, Loader2, AlertCircle, Users, RefreshCw, Search } from 'lucide-react';

export default function ProveedoresList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function cargar() {
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.listProveedores({ activo: true });
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setProveedores(res.data);
      setStatus(res.data.length === 0 ? 'empty' : 'data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, []);

  const filtrados = proveedores.filter(p =>
    p.alias_proveedor.toLowerCase().includes(search.toLowerCase()) ||
    p.razon_social.toLowerCase().includes(search.toLowerCase()) ||
    p.rfc.toLowerCase().includes(search.toLowerCase())
  );

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
        <Users className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">No hay proveedores registrados</p>
        <Button asChild size="sm"><Link to="/compras/proveedores/nuevo"><Plus className="w-4 h-4 mr-2" />Nuevo Proveedor</Link></Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Proveedores</h2>
          <p className="text-slate-500 text-sm mt-1">{filtrados.length} de {proveedores.length} proveedores</p>
        </div>
        <Button asChild><Link to="/compras/proveedores/nuevo"><Plus className="w-4 h-4 mr-2" />Nuevo Proveedor</Link></Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por alias, razón social o RFC..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['Alias', 'Razón Social', 'RFC', 'Tipo', 'Teléfono', 'Activo', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrados.map(p => (
                  <tr key={p.proveedor_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{p.alias_proveedor}</td>
                    <td className="px-4 py-3">{p.razon_social}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.rfc}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{p.tipo_proveedor || '—'}</Badge>
                    </td>
                    <td className="px-4 py-3">{p.telefono || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={p.activo ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/compras/proveedores/${p.proveedor_id}`}>Ver</Link>
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
