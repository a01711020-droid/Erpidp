/**
 * HOME — Selector de módulos
 * UI 100% fiel a Figma: header navy, fondo beige, círculos de colores, fuente Caveat
 */
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, ClipboardList, ShoppingCart, CreditCard,
  HardHat, Warehouse, UserCog,
} from 'lucide-react';

const MODULES = [
  { id: 'dashboard',     label: 'Panel General',  Icon: LayoutDashboard, from: '#64748b', to: '#475569', path: '/dashboard' },
  { id: 'requisitions',  label: 'Requisiciones',  Icon: ClipboardList,   from: '#eab308', to: '#f97316', path: '/requisiciones' },
  { id: 'purchases',     label: 'Compras',        Icon: ShoppingCart,    from: '#3b82f6', to: '#1d4ed8', path: '/compras' },
  { id: 'payments',      label: 'Pagos',          Icon: CreditCard,      from: '#22c55e', to: '#16a34a', path: '/pagos' },
  { id: 'destajos',      label: 'Destajos',       Icon: HardHat,         from: '#d97706', to: '#92400e', path: '/destajos' },
  { id: 'warehouse',     label: 'Almacén',        Icon: Warehouse,       from: '#f97316', to: '#ea580c', path: '/almacen' },
  { id: 'personal',      label: 'Personal',       Icon: UserCog,         from: '#374151', to: '#111827', path: '/personal' },
];

export default function Home() {
  const navigate = useNavigate();
  const top = MODULES.slice(0, 4);
  const bottom = MODULES.slice(4);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)' }}>
      {/* Hero navy */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo-idp-normal.svg" alt="IDP" className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
            Sistema de Gestión Empresarial
          </h1>
          <p className="text-xl text-slate-300" style={{ fontFamily: "'Caveat', cursive" }}>
            IDP Construcción, Consultoría y Diseño
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full mt-4">
            <span className="text-slate-200" style={{ fontFamily: "'Caveat', cursive" }}>
              Bienvenido, <span className="font-semibold text-white">Sistema de Gestión</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300" style={{ fontFamily: "'Caveat', cursive" }}>Administrador</span>
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Caveat', cursive" }}>Selecciona un Módulo</h2>
          <p className="text-xl text-gray-600" style={{ fontFamily: "'Caveat', cursive" }}>Elige el área del sistema que deseas gestionar</p>
        </div>

        {/* Fila 1 — 4 círculos */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {top.map(({ id, label, Icon, from, to, path }) => (
            <div key={id} className="flex flex-col items-center cursor-pointer" onClick={() => navigate(path)}>
              <div
                className="w-28 h-28 rounded-full hover:scale-110 transition-all duration-300 shadow-lg flex items-center justify-center group"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <Icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 text-center max-w-[140px]" style={{ fontFamily: "'Caveat', cursive" }}>
                {label}
              </h3>
            </div>
          ))}
        </div>

        {/* Fila 2 — 3 círculos */}
        <div className="flex justify-center gap-8 flex-wrap">
          {bottom.map(({ id, label, Icon, from, to, path }) => (
            <div key={id} className="flex flex-col items-center cursor-pointer" onClick={() => navigate(path)}>
              <div
                className="w-28 h-28 rounded-full hover:scale-110 transition-all duration-300 shadow-lg flex items-center justify-center group"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <Icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 text-center max-w-[140px]" style={{ fontFamily: "'Caveat', cursive" }}>
                {label}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-idp-normal.svg" alt="IDP" className="h-12 w-auto" />
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-white">IDP Construcción, Consultoría y Diseño</p>
              <p>Sistema de Gestión Empresarial v1.0</p>
            </div>
          </div>
          <div className="text-sm text-slate-300">© 2025 Todos los derechos reservados</div>
        </div>
      </footer>
    </div>
  );
}
