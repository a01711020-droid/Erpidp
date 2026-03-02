/**
 * DETALLE DE PROVEEDOR
 * Carga un proveedor real por ID desde el dataAdapter.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { Proveedor } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ProveedorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prov, setProv] = useState<Proveedor | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    if (!id) return;
    setStatus('loading');
    setError(null);
    try {
      const res = await dataAdapter.getProveedor(id);
      if (res.status === 'error') { setError(res.error); setStatus('error'); return; }
      setProv(res.data!);
      setStatus('data');
    } catch { setError('Error inesperado'); setStatus('error'); }
  }

  useEffect(() => { cargar(); }, [id]);

  if (status === 'loading') return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  if (status === 'error' || !prov) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
      <AlertCircle className="w-8 h-8" /><p className="text-sm">{error}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={cargar} className="gap-2"><RefreshCw className="w-4 h-4" />Reintentar</Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/compras/proveedores')} className="gap-2"><ArrowLeft className="w-4 h-4" />Volver</Button>
      </div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{value || '—'}</span>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/compras/proveedores')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">{prov.alias_proveedor}</h2>
        <Badge variant="outline" className={prov.activo ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
          {prov.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Datos Fiscales</h3>
            <Row label="Razón Social" value={prov.razon_social} />
            <Row label="RFC" value={prov.rfc} />
            <Row label="Tipo" value={prov.tipo_proveedor || ''} />
            <Row label="Ciudad" value={prov.ciudad || ''} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Contacto</h3>
            <Row label="Contacto" value={prov.contacto_principal || ''} />
            <Row label="Teléfono" value={prov.telefono || ''} />
            <Row label="Email" value={prov.email || ''} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Datos Bancarios</h3>
            <Row label="Banco" value={prov.banco || ''} />
            <Row label="CLABE" value={prov.clabe || ''} />
            <Row label="Cuenta" value={prov.numero_cuenta || ''} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Crédito</h3>
            <Row label="Días de crédito" value={`${prov.dias_credito} días`} />
            <Row label="Límite de crédito" value={`$${prov.limite_credito.toLocaleString('es-MX')}`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
