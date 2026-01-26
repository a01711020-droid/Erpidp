import { Button } from "../primitives/button";
import { Card } from "../primitives/card";
import type { ReactNode } from "react";

export interface AppShellNavItem {
  label: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

interface AppShellProps {
  title: string;
  subtitle?: string;
  navItems: AppShellNavItem[];
  children: ReactNode;
}

export function AppShell({ title, subtitle, navItems, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-xl">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/logo-idp-normal.svg"
                  alt="IDP Construcción"
                  className="h-14 w-auto"
                />
                <div className="h-10 w-px bg-slate-500/50"></div>
                <div>
                  <h1 className="text-lg font-bold text-white">{title}</h1>
                  {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? "secondary" : "outline"}
                    onClick={item.onClick}
                    className={
                      item.active
                        ? "bg-white text-slate-900 hover:bg-slate-200"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <Card className="bg-white/10 border border-white/20">
              <div className="px-4 py-2 text-xs text-slate-200">
                Sistema de Gestión Empresarial • IDP Construcción
              </div>
            </Card>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
