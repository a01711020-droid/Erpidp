import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppShell, AppShellNavItem } from "../../ui/layout/AppShell";
import { Toaster } from "../../ui/primitives/sonner";

interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  navItems: Array<Omit<AppShellNavItem, "active" | "onClick"> & { path: string }>;
}

export default function ModuleLayout({ title, subtitle, navItems }: ModuleLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const matchingPaths = navItems
    .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
    .map((item) => item.path);
  const activePath = matchingPaths.sort((a, b) => b.length - a.length)[0];

  const items = navItems.map((item) => ({
    ...item,
    active: item.path === activePath,
    onClick: () => navigate(item.path),
  }));

  return (
    <AppShell title={title} subtitle={subtitle} navItems={items}>
      <Toaster />
      <Outlet />
    </AppShell>
  );
}
