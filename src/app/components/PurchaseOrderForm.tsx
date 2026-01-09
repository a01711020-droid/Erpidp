import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Helper function to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  date: string;
  status: "Borrador" | "Enviada" | "Aprobada" | "Recibida" | "Cancelada";
  items: PurchaseOrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  notes: string;
  project: string;
}

interface PurchaseOrderFormProps {
  onClose: () => void;
  onSave: (order: PurchaseOrder) => void;
  editOrder?: PurchaseOrder | null;
  projectName: string;
}

export function PurchaseOrderForm({
  onClose,
  onSave,
  editOrder,
  projectName,
}: PurchaseOrderFormProps) {
  const [orderNumber, setOrderNumber] = useState(
    editOrder?.orderNumber || `OC-${Date.now()}`
  );
  const [supplier, setSupplier] = useState(editOrder?.supplier || "");
  const [date, setDate] = useState(
    editOrder?.date || new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<PurchaseOrder["status"]>(
    editOrder?.status || "Borrador"
  );
  const [notes, setNotes] = useState(editOrder?.notes || "");
  const [items, setItems] = useState<PurchaseOrderItem[]>(
    editOrder?.items || [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]
  );

  const suppliers = [
    "CEMEX México",
    "Grupo Cementos de Chihuahua",
    "Aceros Levinson",
    "Hierros y Materiales SA",
    "Interceramic",
    "Materiales Pérez",
    "Ferretería Industrial del Norte",
    "Distribuidora de Concreto",
    "Pinturas Berel",
    "Otro",
  ];

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
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
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSave = () => {
    const order: PurchaseOrder = {
      id: editOrder?.id || generateId(),
      orderNumber,
      supplier,
      date,
      status,
      items,
      subtotal,
      iva,
      total,
      notes,
      project: projectName,
    };
    onSave(order);
    onClose();
  };

  const isValid =
    orderNumber &&
    supplier &&
    date &&
    items.length > 0 &&
    items.every((item) => item.description && item.quantity > 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {editOrder ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Número de OC *</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="OC-12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor *</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as PurchaseOrder["status"])
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Borrador">Borrador</SelectItem>
                    <SelectItem value="Enviada">Enviada</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Recibida">Recibida</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Proyecto</Label>
                <Input id="project" value={projectName} disabled />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Conceptos</Label>
                <Button onClick={addItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Concepto
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Precio Unitario
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Total
                        </th>
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                updateItem(item.id, "description", e.target.value)
                              }
                              placeholder="Descripción del material o servicio"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              ${item.total.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Subtotal:
                  </span>
                  <span className="font-medium">
                    ${subtotal.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">IVA (16%):</span>
                  <span className="font-medium">
                    ${iva.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${total.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones</Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales, condiciones de pago, etc."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {editOrder ? "Guardar Cambios" : "Crear Orden de Compra"}
          </Button>
        </div>
      </div>
    </div>
  );
}