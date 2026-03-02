// Layout para el Módulo Almacén
import { Outlet, Link, useLocation } from 'react-router';
import { Warehouse, Package, ClipboardList, ArrowLeftRight, Home } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

const NAV = [
  { to: '/almacen', label: 'Inventario', icon: Package, exact: true },
  { to: '/almacen/entradas', label: 'Entradas', icon: ClipboardList },
  { to: '/almacen/salidas', label: 'Salidas', icon: ArrowLeftRight },
];

export default function AlmacenLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-amber-600" />
              <h1 className="text-xl font-bold text-slate-900">Almacén</h1>
            </div>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">Control de Inventario</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.nombre}</span>
            <button onClick={logout} className="text-xs text-slate-400 hover:text-slate-600 transition">Salir</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? location.pathname === to : location.pathname.startsWith(to);
              return (
                <Link key={to} to={to}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
