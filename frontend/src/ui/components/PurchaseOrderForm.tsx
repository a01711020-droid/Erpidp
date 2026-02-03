import { useMemo, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  generatePurchaseOrderNumber,
  getNextSequentialCode,
  parsePurchaseOrderNumber,
} from "../utils/codeGenerators";
import { Obra, Proveedor } from "../../core/api/types";

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
  workCode: string;
  workName: string;
  client: string;
  supplier: string;
  supplierFullName: string;
  supplierContact: string;
  supplierRFC?: string;
  supplierAddress?: string;
  supplierPhone?: string;
  supplierBank?: string;
  supplierAccount?: string;
  supplierCLABE?: string;
  buyer: string;
  deliveryDate: string;
  deliveryType: "Entrega" | "Recolección";
  hasIVA: boolean;
  discount: number;
  discountAmount: number;
  observations: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  createdDate: string;
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Entregada";
}

interface Buyer {
  name: string;
  initials: string;
}

interface PurchaseOrderFormProps {
  onClose: () => void;
  onSave: (order: PurchaseOrder) => void;
  editOrder?: PurchaseOrder | null;
  requisitionData?: {
    workCode: string;
    workName: string;
    items: Array<{ description: string; quantity: number; unit: string }>;
  } | null;
  obras: Obra[];
  proveedores: Proveedor[];
  buyers: Buyer[];
  existingOrders: PurchaseOrder[];
}

export function PurchaseOrderForm({
  onClose,
  onSave,
  editOrder,
  requisitionData,
  obras,
  proveedores,
  buyers,
  existingOrders,
}: PurchaseOrderFormProps) {
  const [workCode, setWorkCode] = useState(
    editOrder?.workCode || requisitionData?.workCode || ""
  );
  const [supplier, setSupplier] = useState(editOrder?.supplier || "");
  const [buyer, setBuyer] = useState(editOrder?.buyer || "");
  const [orderNumber, setOrderNumber] = useState(editOrder?.orderNumber || "");

  const workInfo = useMemo(() => {
    const obra = obras.find((item) => item.codigo === workCode);
    if (!obra) return null;
    return {
      name: obra.nombre,
      client: obra.cliente,
      contractNumber: obra.numero_contrato,
    };
  }, [obras, workCode]);

  const supplierInfo = useMemo(() => {
    const proveedor = proveedores.find((item) => item.nombre_comercial === supplier);
    if (!proveedor) return null;
    return {
      fullName: proveedor.razon_social,
      contact: proveedor.contacto_principal || "",
      rfc: proveedor.rfc,
      address: proveedor.direccion || "",
      phone: proveedor.telefono || "",
      bank: proveedor.banco || "",
      account: proveedor.numero_cuenta || "",
      clabe: proveedor.clabe || "",
    };
  }, [proveedores, supplier]);

  const getDefaultDeliveryDate = () => {
    if (editOrder?.deliveryDate) {
      return editOrder.deliveryDate;
    }
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split("T")[0];
  };

  const [deliveryDate, setDeliveryDate] = useState(getDefaultDeliveryDate());
  const [deliveryType, setDeliveryType] = useState<"Entrega" | "Recolección">(
    editOrder?.deliveryType || "Entrega"
  );
  const [hasIVA, setHasIVA] = useState(editOrder?.hasIVA ?? true);
  const [discountAmount, setDiscountAmount] = useState(editOrder?.discountAmount || 0);
  const [observations, setObservations] = useState(editOrder?.observations || "");
  const [items, setItems] = useState<PurchaseOrderItem[]>(() => {
    if (editOrder?.items) {
      return editOrder.items;
    }
    if (requisitionData?.items) {
      return requisitionData.items.map((item) => ({
        id: generateId(),
        description: `${item.description} (${item.unit})`,
        quantity: item.quantity,
        unitPrice: 0,
        total: 0,
      }));
    }
    return [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ];
  });

  const [isWorkInfoExpanded, setIsWorkInfoExpanded] = useState(false);
  const [isSupplierInfoExpanded, setIsSupplierInfoExpanded] = useState(false);

  useEffect(() => {
    if (!editOrder && workCode && buyer && supplier) {
      const buyerData = buyers.find((b) => b.name === buyer);
      const buyerInitials = buyerData?.initials || "";
      const workOrders = existingOrders.filter((order) => order.workCode === workCode);
      const lastOrder = workOrders[workOrders.length - 1];
      const parsed = lastOrder ? parsePurchaseOrderNumber(lastOrder.orderNumber) : null;
      const nextSequential = getNextSequentialCode(parsed?.sequential || "");
      const generatedNumber = generatePurchaseOrderNumber(
        workCode,
        nextSequential,
        buyerInitials,
        supplier
      );
      setOrderNumber(generatedNumber);
    }
  }, [workCode, buyer, supplier, editOrder, buyers, existingOrders]);

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
  const subtotalAfterDiscount = subtotal - discountAmount;
  const iva = hasIVA ? subtotalAfterDiscount * 0.16 : 0;
  const total = subtotalAfterDiscount + iva;

  const handleSave = () => {
    const order: PurchaseOrder = {
      id: editOrder?.id || generateId(),
      orderNumber,
      workCode,
      workName: workInfo?.name || "",
      client: workInfo?.client || "",
      supplier,
      supplierFullName: supplierInfo?.fullName || "",
      supplierContact: supplierInfo?.contact || "",
      supplierRFC: supplierInfo?.rfc,
      supplierAddress: supplierInfo?.address,
      supplierPhone: supplierInfo?.phone,
      supplierBank: supplierInfo?.bank,
      supplierAccount: supplierInfo?.account,
      supplierCLABE: supplierInfo?.clabe,
      buyer,
      deliveryDate,
      deliveryType,
      hasIVA,
      discount: subtotal === 0 ? 0 : (discountAmount / subtotal) * 100,
      discountAmount,
      observations,
      items,
      subtotal,
      iva,
      total,
      createdDate: editOrder?.createdDate || new Date().toISOString().split("T")[0],
      status: editOrder?.status || "Pendiente",
    };
    onSave(order);
    onClose();
  };

  const isValid =
    workCode &&
    supplier &&
    buyer &&
    orderNumber &&
    deliveryDate &&
    items.length > 0 &&
    items.every((item) => item.description && item.quantity > 0 && item.unitPrice >= 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editOrder ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Complete los datos para generar la orden de compra
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Obra *</Label>
              <Select value={workCode} onValueChange={setWorkCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar obra" />
                </SelectTrigger>
                <SelectContent>
                  {obras.map((work) => (
                    <SelectItem key={work.id} value={work.codigo}>
                      {work.codigo} - {work.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Proveedor *</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((provider) => (
                    <SelectItem key={provider.id} value={provider.nombre_comercial}>
                      {provider.nombre_comercial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comprador *</Label>
              <Select value={buyer} onValueChange={setBuyer}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar comprador" />
                </SelectTrigger>
                <SelectContent>
                  {buyers.map((buyerItem) => (
                    <SelectItem key={buyerItem.name} value={buyerItem.name}>
                      {buyerItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Folio de Orden *</Label>
              <Input value={orderNumber} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Entrega *</Label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Entrega</Label>
              <Select value={deliveryType} onValueChange={(value) => setDeliveryType(value as "Entrega" | "Recolección")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrega">Entrega</SelectItem>
                  <SelectItem value="Recolección">Recolección</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descuento</Label>
              <Input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsWorkInfoExpanded(!isWorkInfoExpanded)}
            >
              <h3 className="font-semibold text-lg">Información de la Obra</h3>
              {isWorkInfoExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
            {isWorkInfoExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nombre</p>
                  <p className="font-medium">{workInfo?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{workInfo?.client || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contrato</p>
                  <p className="font-medium">{workInfo?.contractNumber || "-"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsSupplierInfoExpanded(!isSupplierInfoExpanded)}
            >
              <h3 className="font-semibold text-lg">Información del Proveedor</h3>
              {isSupplierInfoExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
            {isSupplierInfoExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Razón Social</p>
                  <p className="font-medium">{supplierInfo?.fullName || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contacto</p>
                  <p className="font-medium">{supplierInfo?.contact || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RFC</p>
                  <p className="font-medium">{supplierInfo?.rfc || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Banco</p>
                  <p className="font-medium">{supplierInfo?.bank || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cuenta</p>
                  <p className="font-medium">{supplierInfo?.account || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CLABE</p>
                  <p className="font-medium">{supplierInfo?.clabe || "-"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Detalle de Items</h3>
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
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
                  <Label>Precio Unitario</Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input value={item.total.toFixed(2)} readOnly className="bg-gray-50" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Input
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>IVA</Label>
              <Select
                value={hasIVA ? "si" : "no"}
                onValueChange={(value) => setHasIVA(value === "si")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Incluye IVA</SelectItem>
                  <SelectItem value="no">Sin IVA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-MX")}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento</span>
              <span>${discountAmount.toLocaleString("es-MX")}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>${iva.toLocaleString("es-MX")}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toLocaleString("es-MX")}</span>
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {editOrder ? "Guardar Cambios" : "Crear Orden"}
          </Button>
        </div>
      </div>
    </div>
  );
}
