/**
 * CREAR PROVEEDOR
 * Formulario real conectado al dataAdapter.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { dataAdapter } from '@/core/data';
import type { CreateProveedorDTO } from '@/core/data/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function ProveedorCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    alias_proveedor: '', razon_social: '', rfc: '',
    telefono: '', email: '', contacto_principal: '',
    ciudad: '', tipo_proveedor: '' as '' | 'material' | 'servicio' | 'renta' | 'mixto',
    banco: '', clabe: '', dias_credito: 0, limite_credito: 0,
  });

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.alias_proveedor || !form.razon_social || !form.rfc) {
      setError('Alias, razón social y RFC son requeridos');
      return;
    }
    setSaving(true);
    const dto: CreateProveedorDTO = {
      alias_proveedor: form.alias_proveedor,
      razon_social: form.razon_social,
      rfc: form.rfc,
      telefono: form.telefono || undefined,
      email: form.email || undefined,
      contacto_principal: form.contacto_principal || undefined,
      ciudad: form.ciudad || undefined,
      tipo_proveedor: (form.tipo_proveedor as 'material' | 'servicio' | 'renta' | 'mixto') || undefined,
      banco: form.banco || undefined,
      clabe: form.clabe || undefined,
      dias_credito: form.dias_credito,
      limite_credito: form.limite_credito,
    };
    const res = await dataAdapter.createProveedor(dto);
    setSaving(false);
    if (res.status === 'error') { setError(res.error || 'Error al crear'); return; }
    navigate('/compras/proveedores');
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input type={type} value={(form as any)[key]} onChange={e => set(key, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/compras/proveedores')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />Volver
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Nuevo Proveedor</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Alias / Nombre comercial *', 'alias_proveedor', 'text', 'Ej: Materiales Juárez')}
            {field('Razón Social *', 'razon_social', 'text', 'Nombre legal completo')}
            {field('RFC *', 'rfc', 'text', 'Ej: XAXX010101000')}
            {field('Teléfono', 'telefono')}
            {field('Correo electrónico', 'email')}
            {field('Contacto principal', 'contacto_principal')}
            {field('Ciudad', 'ciudad')}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de proveedor</label>
              <select value={form.tipo_proveedor} onChange={e => set('tipo_proveedor', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="">Sin especificar</option>
                <option value="material">Material</option>
                <option value="servicio">Servicio</option>
                <option value="renta">Renta de equipo</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>

            {field('Banco', 'banco')}
            {field('CLABE interbancaria', 'clabe')}
            {field('Días de crédito', 'dias_credito', 'number')}
            {field('Límite de crédito ($)', 'limite_credito', 'number')}
          </CardContent>
        </Card>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/compras/proveedores')}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Crear Proveedor</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
