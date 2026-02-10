import { useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  PurchaseOrderForm,
  PurchaseOrder,
} from "./components/PurchaseOrderForm";
import { PurchaseOrderPDF } from "./components/PurchaseOrderPDF";
import { MaterialRequisition } from "./components/MaterialRequisitionForm";
import { RequisitionsSection } from "./components/RequisitionsSection";
import GestionProveedores from "./components/GestionProveedores";
import { generatePurchaseOrderPDF } from "./utils/generatePurchaseOrderPDF";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingDown,
  CheckCircle,
  Clock,
  Download,
  MessageSquare,
  ArrowRight,
  Send,
  List,
  ShoppingCart,
  ClipboardList,
  Zap,
  AlertTriangle,
  X,
  Users,
  Ban,
} from "lucide-react";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Obra, OrdenCompra, Proveedor, Requisicion } from "../core/api/types";

interface Buyer {
  name: string;
  initials: string;
}

interface PurchaseOrderManagementProps {
  obras: Obra[];
  proveedores: Proveedor[];
  ordenesCompra: OrdenCompra[];
  requisiciones: Requisicion[];
  buyers: Buyer[];
  isLoading: boolean;
  error: string | null;
  onCreateOrdenCompra?: (order: Partial<OrdenCompra>) => Promise<OrdenCompra> | void;
  onUpdateOrdenCompra?: (id: string, order: Partial<OrdenCompra>) => Promise<OrdenCompra> | void;
  onDeleteOrdenCompra?: (id: string) => Promise<void> | void;
  onAuthenticateProveedor?: (password: string) => Promise<void> | void;
}

const mapOrdenCompraToPurchaseOrder = (order: OrdenCompra): PurchaseOrder => ({
  id: order.id,
  orderNumber: order.folio,
  workCode: order.obra_codigo,
  workName: order.obra_nombre,
  client: order.cliente,
  supplier: order.proveedor_nombre,
  supplierFullName: order.proveedor_razon_social,
  supplierContact: order.proveedor_contacto || "",
  supplierRFC: order.proveedor_rfc || "",
  supplierAddress: order.proveedor_direccion || "",
  supplierPhone: order.proveedor_telefono || "",
  supplierBank: order.proveedor_banco || "",
  supplierAccount: order.proveedor_cuenta || "",
  supplierCLABE: order.proveedor_clabe || "",
  buyer: order.comprador,
  deliveryDate: order.fecha_entrega,
  deliveryType: order.tipo_entrega,
  hasIVA: order.incluye_iva,
  discount: order.descuento,
  discountAmount: order.descuento_monto,
  observations: order.observaciones || "",
  items: order.items.map((item) => ({
    id: item.id,
    description: item.descripcion,
    quantity: item.cantidad,
    unitPrice: item.precio_unitario,
    total: item.total,
  })),
  subtotal: order.subtotal,
  iva: order.iva,
  total: order.total,
  createdDate: order.fecha_creacion,
  status: order.estado,
});

const mapPurchaseOrderToPayload = (
  order: PurchaseOrder,
  obras: Obra[],
  proveedores: Proveedor[]
): Partial<OrdenCompra> => {
  const obra = obras.find((item) => item.codigo === order.workCode);
  const proveedor = proveedores.find(
    (item) => item.nombre_comercial === order.supplier
  );

  return {
    folio: order.orderNumber,
    obra_id: obra?.id || "",
    obra_codigo: order.workCode,
    obra_nombre: order.workName,
    cliente: order.client,
    proveedor_id: proveedor?.id || "",
    proveedor_nombre: order.supplier,
    proveedor_razon_social: order.supplierFullName,
    proveedor_contacto: order.supplierContact,
    proveedor_rfc: order.supplierRFC,
    proveedor_direccion: order.supplierAddress,
    proveedor_telefono: order.supplierPhone,
    proveedor_banco: order.supplierBank,
    proveedor_cuenta: order.supplierAccount,
    proveedor_clabe: order.supplierCLABE,
    comprador: order.buyer,
    fecha_entrega: order.deliveryDate,
    tipo_entrega: order.deliveryType,
    incluye_iva: order.hasIVA,
    descuento: order.discount,
    descuento_monto: order.discountAmount,
    observaciones: order.observations,
    subtotal: order.subtotal,
    iva: order.iva,
    total: order.total,
    fecha_creacion: order.createdDate,
    estado: order.status,
    items: order.items.map((item) => ({
      id: item.id,
      descripcion: item.description,
      cantidad: item.quantity,
      precio_unitario: item.unitPrice,
      total: item.total,
    })),
  };
};

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

export default function PurchaseOrderManagement({
  obras,
  proveedores,
  ordenesCompra,
  requisiciones,
  buyers,
  isLoading,
  error,
  onCreateOrdenCompra,
  onUpdateOrdenCompra,
  onDeleteOrdenCompra,
  onAuthenticateProveedor,
}: PurchaseOrderManagementProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRequisitions, setShowRequisitions] = useState(false);
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<
    MaterialRequisition | null
  >(null);

  const orders = useMemo(
    () => ordenesCompra.map(mapOrdenCompraToPurchaseOrder),
    [ordenesCompra]
  );

  const handleNavigateDashboard = () => {
    window.location.assign("/dashboard");
  };

  const handleOpenSupplierManagement = () => {
    setShowSupplierManagement(true);
    setShowOrderForm(false);
  };

  const requisitionsData = useMemo(
    () => requisiciones.map(mapRequisicionToUI),
    [requisiciones]
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveOrder = async (order: PurchaseOrder) => {
    const payload = mapPurchaseOrderToPayload(order, obras, proveedores);
    if (editingOrder && onUpdateOrdenCompra) {
      await onUpdateOrdenCompra(order.id, payload);
    } else if (onCreateOrdenCompra) {
      await onCreateOrdenCompra(payload);
    }
    setEditingOrder(null);
    setShowOrderForm(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (onDeleteOrdenCompra && confirm("¿Eliminar esta orden de compra?")) {
      await onDeleteOrdenCompra(orderId);
    }
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
  };

  const handleDownloadPDF = (order: PurchaseOrder) => {
    generatePurchaseOrderPDF(order);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando órdenes de compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes de Compra</h1>
            <p className="text-gray-600">Gestión y seguimiento de órdenes</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRequisitions(!showRequisitions)}
              className="gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              Requisiciones
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSupplierManagement(true)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Proveedores
            </Button>
            <Button
              onClick={() => {
                setEditingOrder(null);
                setShowOrderForm(true);
              }}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Nueva Orden
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Órdenes</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {orders.filter((o) => o.status === "Pendiente").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aprobadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter((o) => o.status === "Aprobada").length}
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
                  <p className="text-sm text-muted-foreground">Rechazadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {orders.filter((o) => o.status === "Rechazada").length}
                  </p>
                </div>
                <Ban className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle>Listado de Órdenes</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar folio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[250px]"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                    <SelectItem value="Entregada">Entregada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                              order.status === "Aprobada"
                                ? "default"
                                : order.status === "Pendiente"
                                ? "secondary"
                                : order.status === "Entregada"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.workName} • {order.supplier}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span>
                            <strong>Monto:</strong> ${
                              order.total.toLocaleString("es-MX")
                            }
                          </span>
                          <span>
                            <strong>Entrega:</strong> {order.deliveryDate}
                          </span>
                          <span>
                            <strong>Comprador:</strong> {order.buyer}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(order)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showRequisitions && (
          <RequisitionsSection
            requisitions={requisitionsData}
            onCreateOrder={(requisition) => {
              setSelectedRequisition(requisition);
              setShowOrderForm(true);
            }}
          />
        )}

        {showOrderForm && (
          <PurchaseOrderForm
            onClose={() => {
              setShowOrderForm(false);
              setSelectedRequisition(null);
            }}
            onSave={handleSaveOrder}
            editOrder={editingOrder}
            requisitionData={
              selectedRequisition
                ? {
                    workCode: selectedRequisition.workCode,
                    workName: selectedRequisition.workName,
                    items: selectedRequisition.items,
                  }
                : null
            }
            onNavigateDashboard={handleNavigateDashboard}
            onOpenSupplierManagement={handleOpenSupplierManagement}
            obras={obras}
            proveedores={proveedores}
            buyers={buyers}
            existingOrders={orders}
          />
        )}

        {showSupplierManagement && (
          <GestionProveedores
            proveedores={proveedores.map((provider) => ({
              id: provider.id,
              nombre_comercial: provider.nombre_comercial,
              razon_social: provider.razon_social,
              rfc: provider.rfc,
              direccion: provider.direccion || null,
              ciudad: provider.ciudad || null,
              codigo_postal: provider.codigo_postal || null,
              telefono: provider.telefono || null,
              email: provider.email || null,
              contacto_principal: provider.contacto_principal || null,
              banco: provider.banco || null,
              numero_cuenta: provider.numero_cuenta || null,
              clabe: provider.clabe || null,
              tipo_proveedor: provider.tipo_proveedor || null,
              dias_credito: provider.dias_credito,
              limite_credito: provider.limite_credito,
              activo: provider.activo,
            }))}
            onAuthenticate={onAuthenticateProveedor}
          />
        )}
      </div>
    </div>
  );
}
