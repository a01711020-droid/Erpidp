import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";
import DestajosTable from "./components/DestajosTable";

export default function DestajosModule() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4229] to-[#1a5f3d] p-8">
      {/* Header con botón de regreso */}
      <div className="max-w-7xl mx-auto mb-6">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>
      </div>

      {/* Tabla de Destajos */}
      <DestajosTable />
    </div>
  );
}
