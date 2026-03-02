// Layout para el Módulo Personal / RH
import { Outlet, Link, useLocation } from 'react-router';
import { Users, UserPlus, Calendar, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function PersonalLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/personal', label: 'Empleados', icon: Users, exact: true },
    { to: '/personal/nuevo', label: 'Nuevo Empleado', icon: UserPlus },
    { to: '/personal/asistencia', label: 'Asistencia', icon: Calendar },
    { to: '/personal/nomina', label: 'Nómina', icon: DollarSign },
  ];

  function isActive(to: string, exact?: boolean) {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-violet-600" />
              <h1 className="text-xl font-bold text-slate-900">Personal</h1>
            </div>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-sm text-slate-600">Recursos Humanos</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.nombre}</span>
            <button onClick={logout} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(to, exact)
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-700 hover:bg-violet-50 hover:text-violet-700'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
