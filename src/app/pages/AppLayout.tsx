import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/compras", label: "Compras" },
  { to: "/pagos", label: "Pagos" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-xl">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo-idp-normal.svg"
                alt="IDP Construcción"
                className="h-12 w-auto"
              />
              <div className="h-10 w-px bg-slate-500/50"></div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Sistema de Gestión Empresarial
                </h1>
                <p className="text-xs text-slate-300">
                  ERP IDP · API-first
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-4 text-sm text-slate-100">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-white text-slate-800"
                        : "bg-white/10 hover:bg-white/20"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
