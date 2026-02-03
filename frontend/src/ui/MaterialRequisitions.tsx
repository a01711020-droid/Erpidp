import { useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { MaterialRequisitionForm, MaterialRequisition } from "./components/MaterialRequisitionForm";
import { Obra, Requisicion } from "../core/api/types";
import { AlertCircle, Plus } from "lucide-react";

interface MaterialRequisitionsProps {
  obras: Obra[];
  requisiciones: Requisicion[];
  isLoading: boolean;
  error: string | null;
  onCreateRequisicion?: (req: Partial<Requisicion>) => Promise<Requisicion> | void;
  onUpdateRequisicion?: (id: string, req: Partial<Requisicion>) => Promise<Requisicion> | void;
}

const mapRequisicionToUI = (req: Requisicion): MaterialRequisition => ({
  id: req.id,
  requisitionNumber: req.folio,
  workCode: req.obra_codigo,
  workName: req.obra_nombre,
  residentName: req.residente_nombre,
  items: req.items.map((item) => ({
    id: item.id,
    description: item.descripcion,
    quantity: item.cantidad,
    unit: item.unidad,
  })),
  comments: req.comentarios.map((comment) => ({
    id: comment.id,
    author: comment.autor,
    role: comment.rol,
    message: comment.mensaje,
    timestamp: comment.fecha,
  })),
  status: req.estado,
  createdDate: req.fecha_creacion,
  urgency: req.urgencia,
  deliveryNeededBy: req.fecha_entrega,
});

const mapUIToPayload = (req: MaterialRequisition, obras: Obra[]): Partial<Requisicion> => {
  const obra = obras.find((item) => item.codigo === req.workCode);
  return {
    folio: req.requisitionNumber,
    obra_id: obra?.id || "",
    obra_codigo: req.workCode,
    obra_nombre: req.workName,
    residente_nombre: req.residentName,
    estado: req.status,
    fecha_creacion: req.createdDate,
    urgencia: req.urgency,
    fecha_entrega: req.deliveryNeededBy,
    items: req.items.map((item) => ({
      id: item.id,
      descripcion: item.description,
      cantidad: item.quantity,
      unidad: item.unit,
    })),
    comentarios: req.comments.map((comment) => ({
      id: comment.id,
      autor: comment.author,
      rol: comment.role,
      mensaje: comment.message,
      fecha: comment.timestamp,
    })),
  };
};

export default function MaterialRequisitions({
  obras,
  requisiciones,
  isLoading,
  error,
  onCreateRequisicion,
  onUpdateRequisicion,
}: MaterialRequisitionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRequisition, setEditingRequisition] = useState<MaterialRequisition | null>(null);

  const requisitionsData = useMemo(
    () => requisiciones.map(mapRequisicionToUI),
    [requisiciones]
  );

  const handleSave = async (requisition: MaterialRequisition) => {
    const payload = mapUIToPayload(requisition, obras);
    if (editingRequisition && onUpdateRequisicion) {
      await onUpdateRequisicion(requisition.id, payload);
    } else if (onCreateRequisicion) {
      await onCreateRequisicion(payload);
    }
    setEditingRequisition(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando requisiciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Requisiciones</h1>
            <p className="text-gray-600">Solicitudes de materiales</p>
          </div>
          <Button
            onClick={() => {
              setEditingRequisition(null);
              setShowForm(true);
            }}
            className="gap-2 bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Requisición
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Listado de Requisiciones</CardTitle>
          </CardHeader>
          <CardContent>
            {requisitionsData.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin requisiciones</h3>
                <p className="text-muted-foreground">
                  No hay requisiciones registradas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requisitionsData.map((req) => (
                  <div
                    key={req.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{req.requisitionNumber}</h3>
                          <Badge variant={req.status === "Comprado" ? "default" : "secondary"}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {req.workName} • {req.residentName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRequisition(req);
                            setShowForm(true);
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showForm && (
          <MaterialRequisitionForm
            onClose={() => {
              setShowForm(false);
              setEditingRequisition(null);
            }}
            onSave={handleSave}
            editRequisition={editingRequisition}
            userRole="Compras"
            obras={obras}
          />
        )}
      </div>
    </div>
  );
}
