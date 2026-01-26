import { useNavigate } from "react-router-dom";
import HomeView, { HomeModule } from "../ui/home/HomeView";

const moduleToRoute: Record<HomeModule, string> = {
  dashboard: "/obras",
  requisitions: "/compras/ordenes-compra",
  purchases: "/compras/ordenes-compra",
  payments: "/pagos",
  deliveries: "/obras",
};

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelectModule = (module: HomeModule) => {
    const route = moduleToRoute[module];
    navigate(route);
  };

  return <HomeView onSelectModule={handleSelectModule} />;
}
