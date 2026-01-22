import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const modules = [
  {
    title: "Dashboard Empresarial",
    description: "Seguimiento global de obras y KPIs clave.",
    to: "/dashboard",
  },
  {
    title: "Compras",
    description: "Órdenes de compra, proveedores y requisiciones.",
    to: "/compras",
  },
  {
    title: "Pagos",
    description: "Pagos por OC, conciliación y saldos.",
    to: "/pagos",
  },
];

export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {modules.map((module) => (
        <Link to={module.to} key={module.to}>
          <Card className="h-full transition hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
