import { Card } from "@/ui/ui/card";
import { Button } from "@/ui/ui/button";
import { ArrowLeft, Users, Plus } from "lucide-react";

interface Props {
  onBack?: () => void;
  onAdd?: () => void;
}

export default function DestajistasStateEmpty({ onBack, onAdd }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gestión de Destajistas
          </h1>
          <p className="text-muted-foreground">
            Administra el catálogo de destajistas con sus especialidades y datos de contacto
          </p>
        </div>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-gray-300">
          <div className="p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gray-100 rounded-full">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sin Destajistas Registrados
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No hay destajistas en el catálogo actualmente.
              <br />
              Comienza agregando tu primer destajista para poder asignar trabajos.
            </p>
            <Button onClick={onAdd} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Agregar Primer Destajista
            </Button>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <span className="text-white text-2xl">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Registra Destajistas
                </h4>
                <p className="text-sm text-gray-600">
                  Agrega nombre, iniciales y especialidad
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <span className="text-white text-2xl">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Asigna Colores
                </h4>
                <p className="text-sm text-gray-600">
                  Identifica visualmente a cada destajista
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <span className="text-white text-2xl">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Asigna a Obras
                </h4>
                <p className="text-sm text-gray-600">
                  Usa el catálogo en trabajos y destajos
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
