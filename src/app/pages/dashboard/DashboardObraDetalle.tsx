/**
 * DASHBOARD OBRA DETALLE — Seguimiento Físico de Contrato
 * UI 100% fiel a Figma imágenes 3 y 4
 */
import { useNavigate, useParams } from 'react-router';
import { useApi, EP } from '@/core/api';
import { PageLoading, PageError, PageEmpty } from '@/app/components/PageStates';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  ArrowLeft, Plus, FileText, TrendingUp, Calendar, Percent,
  DollarSign, User, Building2, AlertCircle,
} from 'lucide-react';

interface Movimiento {
  no: number;
  tipo: 'estimacion' | 'aditiva' | 'deductiva';
  fecha: string;
  descripcion: string;
  monto: number;
  amort_anticipo: number;
  fondo_garantia: number;
  saldo_anticipo: number;
  pagado: number;
  saldo_por_pagar: number;
  contrato_pendiente: number;
}

interface Contrato {
  numero_contrato: string;
  monto_contrato: number;
  cliente: string;
  nombre_obra: string;
  fecha_inicio: string;
  fecha_fin: string;
  pct_anticipo: number;
  pct_fondo_garantia: number;
  anticipo_calculado: number;
  movimientos: Movimiento[];
}

interface ContratoRes { data: Contrato; }

const TIPO_BADGE: Record<string, string> = {
  estimacion: 'bg-blue-50 text-blue-700 border-blue-200',
  aditiva:    'bg-green-50 text-green-700 border-green-200',
  deductiva:  'bg-red-50 text-red-700 border-red-200',
};

const TIPO_LABEL: Record<string, string> = {
  estimacion: 'Estimación',
  aditiva:    'Aditiva',
  deductiva:  'Deductiva',
};

function fmtMXN(n: number) { return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`; }

export default function DashboardObraDetalle() {
  const navigate = useNavigate();
  const { codigoObra } = useParams();
  const { status, data, error, reload } = useApi<ContratoRes>(
    codigoObra ? EP.panelObra(codigoObra) : null,
    d => !d.data,
  );

  if (status === 'loading') return <PageLoading mensaje="Cargando seguimiento de contrato..." />;
  if (status === 'error')   return <PageError mensaje={error} onRetry={reload} />;
  if (status === 'empty')   return (
    <PageEmpty
      icon={FileText}
      titulo="Sin datos de contrato"
      descripcion="Esta obra aún no tiene contrato registrado."
      ctaLabel="Agregar Contrato"
      onCta={() => {}}
    />
  );

  const c = data!.data;

  const INFO_ITEMS = [
    { icon: <FileText className="h-5 w-5" />, bg: 'bg-blue-100',   label: 'No. Contrato',        value: c.numero_contrato,                       bold: true },
    { icon: <DollarSign className="h-5 w-5" />, bg: 'bg-green-100', label: 'Monto del Contrato',  value: fmtMXN(c.monto_contrato),                bold: true },
    { icon: <User className="h-5 w-5" />,      bg: 'bg-purple-100',label: 'Cliente',              value: c.cliente,                               bold: false },
    { icon: <Building2 className="h-5 w-5" />, bg: 'bg-orange-100',label: 'Nombre de la Obra',    value: c.nombre_obra,                           bold: false },
    { icon: <Calendar className="h-5 w-5" />,  bg: 'bg-slate-100', label: 'Fecha Inicio / Fin',   value: `${c.fecha_inicio} - ${c.fecha_fin}`,    bold: false },
    { icon: <Percent className="h-5 w-5" />,   bg: 'bg-pink-100',  label: '% Anticipo',           value: `${c.pct_anticipo}%`,                    bold: true },
    { icon: <Percent className="h-5 w-5" />,   bg: 'bg-red-100',   label: '% Fondo de Garantía',  value: `${c.pct_fondo_garantia}%`,              bold: true },
    { icon: <DollarSign className="h-5 w-5" />, bg: 'bg-yellow-100',label: 'Anticipo Calculado',   value: fmtMXN(c.anticipo_calculado),            bold: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f0ece6' }}>
      {/* Barra superior */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg"><FileText className="h-6 w-6 text-white" /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seguimiento Físico de Contrato</h2>
            <p className="text-sm text-gray-500">Control de obra y flujo financiero</p>
          </div>
        </div>

        {/* Botón agregar */}
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Agregar Movimiento
        </Button>

        {/* Info del contrato — grid 4×2 con iconos de colores */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {INFO_ITEMS.map(({ icon, bg, label, value, bold }) => (
              <div key={label} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>{icon}</div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className={bold ? 'font-bold text-gray-900' : 'text-gray-700 text-sm'}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de movimientos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-bold">Movimientos del Contrato</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['No.','Tipo','Fecha','Descripción','Monto','Amort. Anticipo','Fondo Garantía','Saldo Anticipo','Pagado','Saldo p.'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {c.movimientos.map(m => (
                  <tr key={m.no} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{m.no}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`gap-1 ${TIPO_BADGE[m.tipo]}`}>
                        <FileText className="h-3 w-3" />{TIPO_LABEL[m.tipo]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.fecha}</td>
                    <td className="px-4 py-3 max-w-[260px]">{m.descripcion}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{fmtMXN(m.monto)}</td>
                    <td className="px-4 py-3 text-orange-500">{m.amort_anticipo > 0 ? fmtMXN(m.amort_anticipo) : '—'}</td>
                    <td className="px-4 py-3 text-red-500">{m.fondo_garantia > 0 ? fmtMXN(m.fondo_garantia) : '—'}</td>
                    <td className="px-4 py-3">{fmtMXN(m.saldo_anticipo)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">{fmtMXN(m.pagado)}</td>
                    <td className="px-4 py-3">{fmtMXN(m.saldo_por_pagar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
