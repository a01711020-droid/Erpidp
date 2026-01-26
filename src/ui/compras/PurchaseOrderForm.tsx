import { useMemo, useState } from "react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { X, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export interface PurchaseOrderItemInput {
  id: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface PurchaseOrderFormValues {
  numeroOrden?: string;
  obraId: string;
  proveedorId: string;
  compradorNombre: string;
  fechaEntrega: string;
  tipoEntrega: "en_obra" | "bodega" | "recoger" | "";
  hasIva: boolean;
  descuento: number;
  observaciones: string;
  items: PurchaseOrderItemInput[];
}

export interface PurchaseOrderWorkOption {
  id: string;
  codigo: string;
  nombre: string;
  cliente: string;
  numeroContrato: string;
  residente?: string | null;
  direccion?: string | null;
}

export interface PurchaseOrderSupplierOption {
  id: string;
  razonSocial: string;
  aliasProveedor?: string | null;
  contactoPrincipal?: string | null;
  rfc?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  banco?: string | null;
  numeroCuenta?: string | null;
  clabe?: string | null;
}

interface PurchaseOrderFormProps {
  onClose: () => void;
  onSave: (order: PurchaseOrderFormValues) => void;
  editOrder?: PurchaseOrderFormValues | null;
  works: PurchaseOrderWorkOption[];
  suppliers: PurchaseOrderSupplierOption[];
}

export function PurchaseOrderForm({
  onClose,
  onSave,
  editOrder,
  works,
  suppliers,
}: PurchaseOrderFormProps) {
  const [obraId, setObraId] = useState(editOrder?.obraId || "");
  const [proveedorId, setProveedorId] = useState(editOrder?.proveedorId || "");
  const [compradorNombre, setCompradorNombre] = useState(editOrder?.compradorNombre || "");
  const [numeroOrden, setNumeroOrden] = useState(editOrder?.numeroOrden || "");
  const [fechaEntrega, setFechaEntrega] = useState(
    editOrder?.fechaEntrega || new Date().toISOString().split("T")[0]
  );
  const [tipoEntrega, setTipoEntrega] = useState<PurchaseOrderFormValues["tipoEntrega"]>(
    editOrder?.tipoEntrega || "en_obra"
  );
  const [hasIva, setHasIva] = useState(editOrder?.hasIva ?? true);
  const [descuento, setDescuento] = useState(editOrder?.descuento || 0);
  const [observaciones, setObservaciones] = useState(editOrder?.observaciones || "");
  const [items, setItems] = useState<PurchaseOrderItemInput[]>(
    editOrder?.items || [
      {
        id: generateId(),
        descripcion: "",
        unidad: "",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ]
  );

  const workInfo = useMemo(() => works.find((work) => work.id === obraId) || null, [works, obraId]);
  const supplierInfo = useMemo(
    () => suppliers.find((supplier) => supplier.id === proveedorId) || null,
    [suppliers, proveedorId]
  );

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        descripcion: "",
        unidad: "",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const updateItem = (
    id: string,
    field: keyof PurchaseOrderItemInput,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value } as PurchaseOrderItemInput;
          if (field === "cantidad" || field === "precioUnitario") {
            updated.total = Number(updated.cantidad) * Number(updated.precioUnitario);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const subtotalAfterDiscount = subtotal - descuento;
  const iva = hasIva ? subtotalAfterDiscount * 0.16 : 0;
  const total = subtotalAfterDiscount + iva;

  const handleSave = () => {
    onSave({
      numeroOrden: numeroOrden || undefined,
      obraId,
      proveedorId,
      compradorNombre,
      fechaEntrega,
      tipoEntrega,
      hasIva,
      descuento,
      observaciones,
      items,
    });
    onClose();
  };

  const isValid =
    obraId &&
    proveedorId &&
    compradorNombre &&
    fechaEntrega &&
    items.length > 0 &&
    items.every((item) => item.descripcion && item.cantidad > 0 && item.unidad);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editOrder ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">Departamento de Compras</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-800">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Order Number and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Número de OC</Label>
                <Input
                  id="orderNumber"
                  value={numeroOrden}
                  onChange={(e) => setNumeroOrden(e.target.value)}
                  placeholder="Se asigna al guardar"
                  className="font-mono"
                  disabled={!editOrder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdDate">Fecha de Creación</Label>
                <Input
                  id="createdDate"
                  value={new Date().toISOString().split("T")[0]}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Work Code Section */}
            <div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-900">Información de Obra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workCode">Obra *</Label>
                  <Select value={obraId} onValueChange={setObraId}>
                    <SelectTrigger id="workCode">
                      <SelectValue placeholder="Seleccionar obra" />
                    </SelectTrigger>
                    <SelectContent>
                      {works.map((work) => (
                        <SelectItem key={work.id} value={work.id}>
                          {work.codigo} - {work.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {workInfo && (
                  <>
                    <div className="space-y-2">
                      <Label>Nombre de Obra</Label>
                      <Input value={workInfo.nombre} disabled className="bg-blue-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <Input value={workInfo.cliente} disabled className="bg-blue-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrato</Label>
                      <Input value={workInfo.numeroContrato} disabled className="bg-blue-50" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Supplier Section */}
            <div className="space-y-4 p-4 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-lg text-green-900">Información de Proveedor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor *</Label>
                  <Select value={proveedorId} onValueChange={setProveedorId}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.aliasProveedor || supplier.razonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {supplierInfo && (
                  <>
                    <div className="space-y-2">
                      <Label>Razón Social</Label>
                      <Input value={supplierInfo.razonSocial} disabled className="bg-green-50" />
                    </div>
                    {supplierInfo.contactoPrincipal && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>Contacto</Label>
                        <Input value={supplierInfo.contactoPrincipal} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.rfc && (
                      <div className="space-y-2">
                        <Label>RFC</Label>
                        <Input value={supplierInfo.rfc} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.direccion && (
                      <div className="space-y-2">
                        <Label>Dirección</Label>
                        <Input value={supplierInfo.direccion} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.telefono && (
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input value={supplierInfo.telefono} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.banco && (
                      <div className="space-y-2">
                        <Label>Banco</Label>
                        <Input value={supplierInfo.banco} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.numeroCuenta && (
                      <div className="space-y-2">
                        <Label>Cuenta</Label>
                        <Input value={supplierInfo.numeroCuenta} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.clabe && (
                      <div className="space-y-2">
                        <Label>CLABE</Label>
                        <Input value={supplierInfo.clabe} disabled className="bg-green-50" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Purchase Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyer">Comprador *</Label>
                <Input
                  id="buyer"
                  value={compradorNombre}
                  onChange={(e) => setCompradorNombre(e.target.value)}
                  placeholder="Nombre del comprador"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Fecha de Entrega *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryType">Tipo de Entrega *</Label>
                <Select
                  value={tipoEntrega}
                  onValueChange={(value) => setTipoEntrega(value as PurchaseOrderFormValues["tipoEntrega"])}
                >
                  <SelectTrigger id="deliveryType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_obra">En obra</SelectItem>
                    <SelectItem value="bodega">Bodega</SelectItem>
                    <SelectItem value="recoger">Recoger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Conceptos de Compra</Label>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                          Unidad
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
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <Input
                              value={item.descripcion}
                              onChange={(e) => updateItem(item.id, "descripcion", e.target.value)}
                              placeholder="Descripción del material o servicio"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={item.unidad}
                              onChange={(e) => updateItem(item.id, "unidad", e.target.value)}
                              placeholder="pz"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.cantidad}
                              onChange={(e) =>
                                updateItem(item.id, "cantidad", parseFloat(e.target.value) || 0)
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.precioUnitario}
                              onChange={(e) =>
                                updateItem(item.id, "precioUnitario", parseFloat(e.target.value) || 0)
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

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="hasIVA">IVA *</Label>
                <Select
                  value={hasIva ? "Si" : "No"}
                  onValueChange={(value) => setHasIva(value === "Si")}
                >
                  <SelectTrigger id="hasIVA">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Si">Sí (16%)</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Descuento (Monto $)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={descuento}
                  onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-96 space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">
                    ${subtotal.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between items-center py-2 border-b text-orange-600">
                    <span className="text-sm">Descuento:</span>
                    <span className="font-semibold">
                      -${descuento.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">IVA (16%):</span>
                    <span className="font-semibold">
                      ${iva.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-t-2">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${total.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <textarea
                id="observations"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Condiciones especiales, instrucciones de entrega, etc."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
            {editOrder ? "Guardar Cambios" : "Crear Orden de Compra"}
          </Button>
        </div>
      </div>
    </div>
  );
}
