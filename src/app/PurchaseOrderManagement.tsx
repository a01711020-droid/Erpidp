import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { PurchaseOrderForm, PurchaseOrder } from "./components/PurchaseOrderForm";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Edit,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

const mockOrders: PurchaseOrder[] = [
  {
    id: "1",
    orderNumber: "OC-2025-001",
    supplier: "CEMEX México",
    date: "2025-01-05",
    status: "Aprobada",
    project: "CASTELLO E",
    items: [
      {
        id: "1",
        description: "Cemento gris CPC 30R",
        quantity: 100,
        unitPrice: 185.5,
        total: 18550,
      },
      {
        id: "2",
        description: "Arena fina de río",
        quantity: 50,
        unitPrice: 320,
        total: 16000,
      },
    ],
    subtotal: 34550,
    iva: 5528,
    total: 40078,
    notes: "Entrega en obra, pago a 30 días",
  },
  {
    id: "2",
    orderNumber: "OC-2025-002",
    supplier: "Aceros Levinson",
    date: "2025-01-06",
    status: "Recibida",
    project: "CASTELLO E",
    items: [
      {
        id: "1",
        description: "Varilla corrugada 3/8",
        quantity: 200,
        unitPrice: 185,
        total: 37000,
      },
    ],
    subtotal: 37000,
    iva: 5920,
    total: 42920,
    notes: "Material certificado",
  },
  {
    id: "3",
    orderNumber: "OC-2025-003",
    supplier: "Interceramic",
    date: "2025-01-07",
    status: "Enviada",
    project: "CASTELLO E",
    items: [
      {
        id: "1",
        description: "Piso porcelanato 60x60 cm",
        quantity: 120,
        unitPrice: 245,
        total: 29400,
      },
      {
        id: "2",
        description: "Adhesivo para porcelanato",
        quantity: 30,
        unitPrice: 180,
        total: 5400,
      },
    ],
    subtotal: 34800,
    iva: 5568,
    total: 40368,
    notes: "",
  },
  {
    id: "4",
    orderNumber: "OC-2025-004",
    supplier: "Pinturas Berel",
    date: "2025-01-08",
    status: "Borrador",
    project: "CASTELLO E",
    items: [
      {
        id: "1",
        description: "Pintura vinílica blanco 19L",
        quantity: 40,
        unitPrice: 420,
        total: 16800,
      },
    ],
    subtotal: 16800,
    iva: 2688,
    total: 19488,
    notes: "Pendiente de aprobación",
  },
];

export default function PurchaseOrderManagement() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const handleSaveOrder = (order: PurchaseOrder) => {
    if (editingOrder) {
      setOrders(orders.map((o) => (o.id === order.id ? order : o)));
    } else {
      setOrders([order, ...orders]);
    }
    setEditingOrder(null);
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta orden de compra?")) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (
    status: PurchaseOrder["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Aprobada":
        return "default";
      case "Recibida":
        return "default";
      case "Enviada":
        return "secondary";
      case "Borrador":
        return "outline";
      case "Cancelada":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Órdenes de Compra
          </h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de órdenes de compra del proyecto
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total OCs
                  </p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Monto Total
                  </p>
                  <p className="text-2xl font-bold">
                    ${totalAmount.toLocaleString("es-MX", {
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Aprobadas
                  </p>
                  <p className="text-3xl font-bold">
                    {orders.filter((o) => o.status === "Aprobada").length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Pendientes
                  </p>
                  <p className="text-3xl font-bold">
                    {orders.filter((o) => o.status === "Borrador").length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-3 flex-1 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por número de OC o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los estados</SelectItem>
                    <SelectItem value="Borrador">Borrador</SelectItem>
                    <SelectItem value="Enviada">Enviada</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Recibida">Recibida</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowForm(true)} className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Nueva Orden de Compra
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Listado de Órdenes de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Número OC
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Proveedor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Conceptos
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium">{order.orderNumber}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          {new Date(order.date).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">{order.supplier}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} concepto(s)
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">
                          ${order.total.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron órdenes de compra</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PurchaseOrderForm
          onClose={handleCloseForm}
          onSave={handleSaveOrder}
          editOrder={editingOrder}
          projectName="CASTELLO E"
        />
      )}

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Detalle de Orden de Compra</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Número de OC</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.date).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{selectedOrder.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge variant={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Conceptos</h3>
                  <table className="w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Descripción</th>
                        <th className="px-4 py-2 text-left text-sm">Cantidad</th>
                        <th className="px-4 py-2 text-left text-sm">P. Unitario</th>
                        <th className="px-4 py-2 text-left text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm">{item.description}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">
                            ${item.unitPrice.toLocaleString("es-MX")}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium">
                            ${item.total.toLocaleString("es-MX")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 max-w-xs ml-auto">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal:</span>
                      <span className="font-medium">
                        ${selectedOrder.subtotal.toLocaleString("es-MX")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">IVA:</span>
                      <span className="font-medium">
                        ${selectedOrder.iva.toLocaleString("es-MX")}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ${selectedOrder.total.toLocaleString("es-MX")}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Observaciones
                    </p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
