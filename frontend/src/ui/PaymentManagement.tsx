import { useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Upload,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  X,
  Plus,
  Receipt,
  FileDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { OrdenCompra, Pago, Proveedor } from "../core/api/types";

interface Invoice {
  id: string;
  folioFactura: string;
  montoFactura: number;
  fechaFactura: string;
  diasCredito: number;
  fechaVencimiento: string;
  diasVencidos: number;
}

interface PaymentReference {
  id: string;
  reference: string;
  amount: number;
  date: string;
  method: string;
}

interface PurchaseOrderPayment {
  id: string;
  orderNumber: string;
  workCode: string;
  workName: string;
  supplier: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  payments: PaymentReference[];
  invoice: Invoice | null;
  hasCredit: boolean;
  creditDays: number;
  status: "paid" | "partial" | "pending" | "overdue" | "not_invoiced" | "na";
}

interface PaymentManagementProps {
  ordenesCompra: OrdenCompra[];
  pagos: Pago[];
  proveedores: Proveedor[];
  isLoading: boolean;
  error: string | null;
  onCreatePago?: (pago: Partial<Pago>) => Promise<Pago> | void;
}

const calculateDueDate = (fechaFactura: string, diasCredito: number): string => {
  const date = new Date(fechaFactura);
  date.setDate(date.getDate() + diasCredito);
  return date.toISOString().split("T")[0];
};

const calculateOverdueDays = (fechaVencimiento: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(fechaVencimiento);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const buildPayments = (pagos: Pago[]): PaymentReference[] =>
  pagos.map((pago) => ({
    id: pago.id,
    reference: pago.referencia,
    amount: pago.monto,
    date: pago.fecha_pago,
    method: pago.metodo,
  }));

const getStatus = (
  totalAmount: number,
  paidAmount: number,
  invoice: Invoice | null
): PurchaseOrderPayment["status"] => {
  if (!invoice) return "not_invoiced";
  if (paidAmount === 0) {
    return invoice.diasVencidos > 0 ? "overdue" : "pending";
  }
  if (paidAmount >= totalAmount) return "paid";
  return "partial";
};

export default function PaymentManagement({
  ordenesCompra,
  pagos,
  proveedores,
  isLoading,
  error,
  onCreatePago,
}: PaymentManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderPayment | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    reference: "",
    date: "",
    method: "Transferencia",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const orders = useMemo(() => {
    return ordenesCompra.map((order) => {
      const orderPayments = pagos.filter(
        (pago) => pago.orden_compra_id === order.id
      );
      const paidAmount = orderPayments.reduce((sum, pago) => sum + pago.monto, 0);
      const proveedor = proveedores.find((item) => item.id === order.proveedor_id);
      const creditDays = proveedor?.dias_credito ?? 0;
      const invoicePayment = orderPayments.find((pago) => pago.folio_factura);
      const invoice = invoicePayment
        ? {
            id: invoicePayment.id,
            folioFactura: invoicePayment.folio_factura || "",
            montoFactura: invoicePayment.monto_factura || order.total,
            fechaFactura: invoicePayment.fecha_factura || invoicePayment.fecha_pago,
            diasCredito: creditDays,
            fechaVencimiento: calculateDueDate(
              invoicePayment.fecha_factura || invoicePayment.fecha_pago,
              creditDays
            ),
            diasVencidos: calculateOverdueDays(
              calculateDueDate(
                invoicePayment.fecha_factura || invoicePayment.fecha_pago,
                creditDays
              )
            ),
          }
        : null;

      const status = getStatus(order.total, paidAmount, invoice);

      return {
        id: order.id,
        orderNumber: order.folio,
        workCode: order.obra_codigo,
        workName: order.obra_nombre,
        supplier: order.proveedor_nombre,
        orderDate: order.fecha_creacion,
        totalAmount: order.total,
        paidAmount,
        payments: buildPayments(orderPayments),
        invoice,
        hasCredit: creditDays > 0,
        creditDays,
        status,
      };
    });
  }, [ordenesCompra, pagos, proveedores]);

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPaymentForm = (order: PurchaseOrderPayment) => {
    setSelectedOrder(order);
    setShowPaymentForm(true);
    setPaymentForm({
      amount: "",
      reference: "",
      date: new Date().toISOString().split("T")[0],
      method: "Transferencia",
    });
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedOrder(null);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedOrder || !onCreatePago) return;

    await onCreatePago({
      orden_compra_id: selectedOrder.id,
      referencia: paymentForm.reference,
      monto: parseFloat(paymentForm.amount),
      fecha_pago: paymentForm.date,
      metodo: paymentForm.method,
    });

    closePaymentForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Pagos</h1>
            <p className="text-gray-600">
              Gestión de pagos y facturas de órdenes de compra
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendiente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${
                      orders
                        .reduce(
                          (sum, order) =>
                            sum + (order.totalAmount - order.paidAmount),
                          0
                        )
                        .toLocaleString("es-MX")
                    }
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pagado</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${
                      orders
                        .reduce((sum, order) => sum + order.paidAmount, 0)
                        .toLocaleString("es-MX")
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Órdenes Vencidas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {orders.filter((order) => order.status === "overdue").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sin Facturar</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.filter((order) => order.status === "not_invoiced").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle>Órdenes de Compra</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar orden..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[250px]"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin órdenes</h3>
                <p className="text-muted-foreground">
                  No se encontraron órdenes de compra para mostrar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {order.orderNumber}
                          </h3>
                          <Badge
                            variant={
                              order.status === "paid"
                                ? "default"
                                : order.status === "overdue"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {order.status === "paid"
                              ? "Pagada"
                              : order.status === "overdue"
                              ? "Vencida"
                              : order.status === "partial"
                              ? "Parcial"
                              : order.status === "pending"
                              ? "Pendiente"
                              : "Sin factura"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.workName} • {order.supplier}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span>
                            <strong>Monto:</strong> ${
                              order.totalAmount.toLocaleString("es-MX")
                            }
                          </span>
                          <span>
                            <strong>Pagado:</strong> ${
                              order.paidAmount.toLocaleString("es-MX")
                            }
                          </span>
                          <span>
                            <strong>Saldo:</strong> ${
                              (order.totalAmount - order.paidAmount).toLocaleString(
                                "es-MX"
                              )
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => openPaymentForm(order)}
                        >
                          <Plus className="h-4 w-4" />
                          Registrar Pago
                        </Button>
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showPaymentForm && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Registrar Pago</CardTitle>
                  <Button variant="ghost" size="icon" onClick={closePaymentForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Referencia</Label>
                  <Input
                    value={paymentForm.reference}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        reference: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select
                    value={paymentForm.method}
                    onValueChange={(value) =>
                      setPaymentForm((prev) => ({ ...prev, method: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closePaymentForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handlePaymentSubmit}>
                    <Upload className="h-4 w-4 mr-2" />
                    Guardar Pago
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
