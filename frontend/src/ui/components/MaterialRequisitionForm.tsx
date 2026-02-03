import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2, MessageSquare, Zap, Clock, Calendar, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Obra } from "../../core/api/types";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface RequisitionItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Comment {
  id: string;
  author: string;
  role: "Residente" | "Compras";
  message: string;
  timestamp: string;
}

export interface MaterialRequisition {
  id: string;
  requisitionNumber: string;
  workCode: string;
  workName: string;
  residentName: string;
  items: RequisitionItem[];
  comments: Comment[];
  status: "En Revisión" | "Comprado";
  createdDate: string;
  urgency: "Urgente" | "Normal" | "Planeado";
  deliveryNeededBy: string;
}

interface MaterialRequisitionFormProps {
  onClose: () => void;
  onSave: (requisition: MaterialRequisition) => void;
  editRequisition?: MaterialRequisition | null;
  userRole: "Residente" | "Compras";
  userWorkCode?: string;
  obras: Obra[];
}

const units = [
  "PZA",
  "M",
  "M2",
  "M3",
  "KG",
  "TON",
  "LT",
  "BULTO",
  "CAJA",
  "COSTAL",
  "ROLLO",
  "JUEGO",
  "LOTE",
];

export function MaterialRequisitionForm({
  onClose,
  onSave,
  editRequisition,
  userRole,
  userWorkCode,
  obras,
}: MaterialRequisitionFormProps) {
  const [requisitionNumber, setRequisitionNumber] = useState(
    editRequisition?.requisitionNumber ||
      `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
  );
  const [workCode, setWorkCode] = useState(
    editRequisition?.workCode || userWorkCode || ""
  );
  const [workInfo, setWorkInfo] = useState<{
    name: string;
    resident: string;
  } | null>(null);
  const [urgency, setUrgency] = useState<MaterialRequisition["urgency"]>(
    editRequisition?.urgency || "Normal"
  );
  const [deliveryNeededBy, setDeliveryNeededBy] = useState(
    editRequisition?.deliveryNeededBy || ""
  );
  const [items, setItems] = useState<RequisitionItem[]>(
    editRequisition?.items || [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unit: "PZA",
      },
    ]
  );
  const [comments, setComments] = useState<Comment[]>(
    editRequisition?.comments || []
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const obra = obras.find((item) => item.codigo === workCode);
    if (obra) {
      setWorkInfo({
        name: obra.nombre,
        resident: obra.residente_nombre,
      });
    } else {
      setWorkInfo(null);
    }
  }, [workCode, obras]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unit: "PZA",
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof RequisitionItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: generateId(),
        author:
          userRole === "Residente"
            ? workInfo?.resident || "Residente"
            : "Departamento de Compras",
        role: userRole,
        message: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleSave = () => {
    const requisition: MaterialRequisition = {
      id: editRequisition?.id || generateId(),
      requisitionNumber,
      workCode,
      workName: workInfo?.name || "",
      residentName: workInfo?.resident || "",
      items,
      comments,
      status: editRequisition?.status || "En Revisión",
      createdDate:
        editRequisition?.createdDate || new Date().toISOString().split("T")[0],
      urgency,
      deliveryNeededBy,
    };
    onSave(requisition);
    onClose();
  };

  const isValid =
    requisitionNumber &&
    workCode &&
    workInfo &&
    deliveryNeededBy &&
    items.length > 0 &&
    items.every((item) => item.description && item.quantity > 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-700 to-orange-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editRequisition
                ? "Editar Requisición"
                : "Nueva Requisición de Material"}
            </h2>
            <p className="text-amber-100 text-sm mt-1">
              Registro de materiales y comentarios
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-amber-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Folio *</Label>
              <Input value={requisitionNumber} onChange={(e) => setRequisitionNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Obra *</Label>
              <Select value={workCode} onValueChange={setWorkCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona obra" />
                </SelectTrigger>
                <SelectContent>
                  {obras.map((obra) => (
                    <SelectItem key={obra.id} value={obra.codigo}>
                      {obra.codigo} - {obra.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Urgencia</Label>
              <Select value={urgency} onValueChange={(value) => setUrgency(value as MaterialRequisition["urgency"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Planeado">Planeado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha requerida</Label>
              <Input
                type="date"
                value={deliveryNeededBy}
                onChange={(e) => setDeliveryNeededBy(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Materiales</h3>
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2 space-y-2">
                  <Label>Descripción</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Select value={item.unit} onValueChange={(value) => updateItem(item.id, "unit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-end">
                  {index > 0 && (
                    <Button variant="outline" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Item
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Comentarios</h3>
            <div className="space-y-2">
              <Input
                placeholder="Agregar comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="outline" onClick={addComment} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Agregar Comentario
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {editRequisition ? "Guardar Cambios" : "Crear Requisición"}
          </Button>
        </div>
      </div>
    </div>
  );
}
