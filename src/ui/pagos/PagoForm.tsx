import { useMemo, useState } from "react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";
import { X } from "lucide-react";

export interface PagoFormValues {
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago: "transferencia" | "cheque" | "efectivo";
  fechaProgramada: string;
  referencia: string;
  folioFactura: string;
  montoFactura: number;
  fechaFactura: string;
  diasCredito: number;
  fechaVencimiento: string;
  observaciones: string;
  estado: "programado" | "procesando" | "completado" | "cancelado";
}

export interface PagoWorkOption {
  id: string;
  nombre: string;
  codigo: string;
}

export interface PagoSupplierOption {
  id: string;
  razonSocial: string;
  aliasProveedor?: string | null;
}

export interface PagoOrderOption {
  id: string;
  numeroOrden: string;
  obraId: string;
  proveedorId: string;
  total: number;
}

interface PagoFormProps {
  onClose: () => void;
  onSave: (values: PagoFormValues) => void;
  editPago?: PagoFormValues | null;
  initialValues?: Partial<PagoFormValues>;
  obras: PagoWorkOption[];
  proveedores: PagoSupplierOption[];
  ordenes: PagoOrderOption[];
}

export function PagoForm({
  onClose,
  onSave,
  editPago,
  initialValues,
  obras,
  proveedores,
  ordenes,
}: PagoFormProps) {
  const baseValues = editPago ?? initialValues;
  const [obraId, setObraId] = useState(baseValues?.obraId || "");
  const [proveedorId, setProveedorId] = useState(baseValues?.proveedorId || "");
  const [ordenCompraId, setOrdenCompraId] = useState(baseValues?.ordenCompraId || "");
  const [monto, setMonto] = useState(baseValues?.monto || 0);
  const [metodoPago, setMetodoPago] = useState<PagoFormValues["metodoPago"]>(
    baseValues?.metodoPago || "transferencia"
  );
  const [fechaProgramada, setFechaProgramada] = useState(
    baseValues?.fechaProgramada || new Date().toISOString().split("T")[0]
  );
  const [referencia, setReferencia] = useState(baseValues?.referencia || "");
  const [folioFactura, setFolioFactura] = useState(baseValues?.folioFactura || "");
  const [montoFactura, setMontoFactura] = useState(baseValues?.montoFactura || 0);
  const [fechaFactura, setFechaFactura] = useState(baseValues?.fechaFactura || "");
  const [diasCredito, setDiasCredito] = useState(baseValues?.diasCredito || 0);
  const [fechaVencimiento, setFechaVencimiento] = useState(baseValues?.fechaVencimiento || "");
  const [observaciones, setObservaciones] = useState(baseValues?.observaciones || "");
  const [estado, setEstado] = useState<PagoFormValues["estado"]>(
    baseValues?.estado || "programado"
  );

  const orderInfo = useMemo(
    () => ordenes.find((orden) => orden.id === ordenCompraId) || null,
    [ordenCompraId, ordenes]
  );

  const handleSave = () => {
    onSave({
      obraId,
      proveedorId,
      ordenCompraId,
      monto,
      metodoPago,
      fechaProgramada,
      referencia,
      folioFactura,
      montoFactura,
      fechaFactura,
      diasCredito,
      fechaVencimiento,
      observaciones,
      estado,
    });
    onClose();
  };

  const isValid = obraId && proveedorId && ordenCompraId && monto > 0 && fechaProgramada;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editPago ? "Editar Pago" : "Nuevo Pago"}
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              Programación y control de pagos
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-emerald-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Obra *</Label>
                <Select value={obraId} onValueChange={setObraId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar obra" />
                  </SelectTrigger>
                  <SelectContent>
                    {obras.map((obra) => (
                      <SelectItem key={obra.id} value={obra.id}>
                        {obra.codigo} - {obra.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proveedor *</Label>
                <Select value={proveedorId} onValueChange={setProveedorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor.id} value={proveedor.id}>
                        {proveedor.aliasProveedor || proveedor.razonSocial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Orden de Compra *</Label>
                <Select value={ordenCompraId} onValueChange={setOrdenCompraId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar orden" />
                  </SelectTrigger>
                  <SelectContent>
                    {ordenes.map((orden) => (
                      <SelectItem key={orden.id} value={orden.id}>
                        {orden.numeroOrden}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {orderInfo && (
                  <p className="text-xs text-muted-foreground">
                    Total OC: ${orderInfo.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a Pagar *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={metodoPago}
                  onValueChange={(value) => setMetodoPago(value as PagoFormValues["metodoPago"])}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaProgramada">Fecha Programada *</Label>
                <Input
                  id="fechaProgramada"
                  type="date"
                  value={fechaProgramada}
                  onChange={(e) => setFechaProgramada(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referencia">Referencia</Label>
                <Input
                  id="referencia"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="TRF-0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={(value) => setEstado(value as PagoFormValues["estado"])}>
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programado">Programado</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Factura</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="folioFactura">Folio Factura</Label>
                  <Input
                    id="folioFactura"
                    value={folioFactura}
                    onChange={(e) => setFolioFactura(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montoFactura">Monto Factura</Label>
                  <Input
                    id="montoFactura"
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoFactura}
                    onChange={(e) => setMontoFactura(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFactura">Fecha Factura</Label>
                  <Input
                    id="fechaFactura"
                    type="date"
                    value={fechaFactura}
                    onChange={(e) => setFechaFactura(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diasCredito">Días Crédito</Label>
                  <Input
                    id="diasCredito"
                    type="number"
                    min="0"
                    step="1"
                    value={diasCredito}
                    onChange={(e) => setDiasCredito(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaVencimiento">Fecha Vencimiento</Label>
                  <Input
                    id="fechaVencimiento"
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <textarea
                id="observaciones"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales"
              />
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
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {editPago ? "Guardar Cambios" : "Crear Pago"}
          </Button>
        </div>
      </div>
    </div>
  );
}
