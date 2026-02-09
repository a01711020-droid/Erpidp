import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { ViewState } from "@/app/components/states";
import {
  PurchaseOrderStateLoading,
  PurchaseOrderStateError,
  PurchaseOrderStateEmpty,
} from "@/app/components/purchase-order";
import {
  PurchaseOrderForm,
  PurchaseOrder,
} from "./components/PurchaseOrderForm";
import { PurchaseOrderPDF } from "./components/PurchaseOrderPDF";
import { MaterialRequisition } from "./components/MaterialRequisitionForm";
import { RequisitionsSection } from "./components/RequisitionsSection";
import { SupplierManagement } from "./components/SupplierManagement";
import { PasswordDialog } from "./components/PasswordDialog";
import GestionProveedores from "./components/GestionProveedores";
import { generatePurchaseOrderPDF } from "./utils/generatePurchaseOrderPDF";
import { dataProvider } from "@/app/providers";
import { getInitials, getSupplierCode } from "./utils/codeGenerators";
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
  BarChart3,
} from "lucide-react";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

// Función para regenerar el folio cuando cambian obra/comprador/proveedor
const generateOrderNumber = (
  workCode: string, 
  buyer: string, 
  supplier: string, 
  orders: PurchaseOrder[],
  currentOrderId?: string
): string => {
  if (!workCode || !buyer || !supplier) return "";
  const workOrders = orders.filter(
    (order) => order.workCode === workCode && (!currentOrderId || order.id !== currentOrderId)
  );
  const consecutive = workOrders.length + 1;
  const consecutiveStr = `A${consecutive.toString().padStart(2, "0")}`;
  const buyerInitials = getInitials(buyer);
  const supplierCode = getSupplierCode(supplier);
  return `${workCode}-${consecutiveStr}${buyerInitials}-${supplierCode}`;
};
interface PurchaseOrderManagementProps {
  onNavigateToSuppliers?: () => void;
  initialState?: ViewState;
}

export default function PurchaseOrderManagement({ 
  onNavigateToSuppliers,
  initialState = "data" 
}: PurchaseOrderManagementProps = {}) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [activeTab, setActiveTab] = useState<"orders" | "requisitions">("orders");
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>([]);
  const [works, setWorks] = useState<Array<{ code: string; name: string; client: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ code: string; fullName: string; contact: string }>>([]);
  const [buyers, setBuyers] = useState<Array<{ name: string; initials: string }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [workFilter, setWorkFilter] = useState<string>("Todos");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [originalOrder, setOriginalOrder] = useState<PurchaseOrder | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [requisitionToConvert, setRequisitionToConvert] = useState<MaterialRequisition | null>(null);
  const [pdfOrder, setPdfOrder] = useState<PurchaseOrder | null>(null);
  const [showEditPasswordDialog, setShowEditPasswordDialog] = useState(false);
  const [showCancelPasswordDialog, setShowCancelPasswordDialog] = useState(false);
  const [pendingOrderChanges, setPendingOrderChanges] = useState<PurchaseOrder | null>(null);
  const [pendingCancelOrder, setPendingCancelOrder] = useState<PurchaseOrder | null>(null);
  
  // Estados para gestión de proveedores
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setViewState("loading");
      try {
        const [ordenesResponse, requisicionesResponse, obrasResponse, proveedoresResponse] =
          await Promise.all([
            dataProvider.listOrdenesCompra(),
            dataProvider.listRequisiciones(),
            dataProvider.listObras(),
            dataProvider.listProveedores(),
          ]);

        const obraIndex = new Map(obrasResponse.data.map((obra) => [obra.id, obra]));
        const proveedorIndex = new Map(
          proveedoresResponse.data.map((proveedor) => [proveedor.id, proveedor])
        );

        const mappedOrders = ordenesResponse.data.map((orden) => {
          const obra = obraIndex.get(orden.obraId);
          const proveedor = proveedorIndex.get(orden.proveedorId);
          const estadoMap: Record<string, PurchaseOrder["status"]> = {
            borrador: "Pendiente",
            emitida: "Aprobada",
            recibida: "Entregada",
            facturada: "Pendiente",
            pagada: "Entregada",
            cancelada: "Rechazada",
          };

          return {
            id: orden.id,
            orderNumber: orden.numeroOrden,
            workCode: obra?.codigo || "",
            workName: obra?.nombre || "",
            client: obra?.cliente || "",
            supplier: proveedor?.nombreComercial || proveedor?.razonSocial || "",
            supplierFullName: proveedor?.razonSocial || "",
            supplierContact: proveedor?.contactoPrincipal || "",
            buyer: orden.creadoPor || "",
            deliveryDate: orden.fechaEntrega,
            deliveryType: orden.tipoEntrega === "recoger" ? "Recolección" : "Entrega",
            hasIVA: orden.iva > 0,
            discount: orden.descuento,
            observations: orden.observaciones || "",
            items: orden.items.map((item) => ({
              id: item.id,
              description: item.descripcion,
              quantity: item.cantidad,
              unitPrice: item.precioUnitario,
              total: item.total,
            })),
            subtotal: orden.subtotal,
            iva: orden.iva,
            discountAmount: orden.descuentoMonto,
            total: orden.total,
            createdDate: orden.fechaEmision,
            status: estadoMap[orden.estado] || "Pendiente",
          } as PurchaseOrder;
        });

        const mappedRequisitions = requisicionesResponse.data.map((requisicion) => {
          const obra = obraIndex.get(requisicion.obraId);
          return {
            id: requisicion.id,
            requisitionNumber: requisicion.numeroRequisicion,
            workCode: obra?.codigo || "",
            workName: obra?.nombre || "",
            residentName: requisicion.solicitadoPor,
            items: requisicion.items.map((item) => ({
              id: item.id,
              description: item.descripcion,
              quantity: item.cantidad,
              unit: item.unidad,
            })),
            comments: [],
            status: requisicion.estado === "aprobada" ? "Comprado" : "En Revisión",
            createdDate: requisicion.fechaSolicitud.split("T")[0],
            urgency:
              requisicion.urgencia === "urgente" || requisicion.urgencia === "muy_urgente"
                ? "Urgente"
                : "Normal",
            deliveryNeededBy: requisicion.fechaSolicitud.split("T")[0],
          } as MaterialRequisition;
        });

        setWorks(
          obrasResponse.data.map((obra) => ({
            code: obra.codigo,
            name: obra.nombre,
            client: obra.cliente,
          }))
        );
        setSuppliers(
          proveedoresResponse.data.map((proveedor) => ({
            code: proveedor.nombreComercial || getSupplierCode(proveedor.razonSocial),
            fullName: proveedor.razonSocial,
            contact: proveedor.contactoPrincipal || "",
          }))
        );
        setBuyers(
          Array.from(
            new Set(mappedOrders.map((order) => order.buyer).filter(Boolean))
          ).map((name) => ({
            name,
            initials: getInitials(name),
          }))
        );

        setOrders(mappedOrders);
        setRequisitions(mappedRequisitions);
        const hasData = mappedOrders.length > 0 || mappedRequisitions.length > 0;
        setViewState(hasData ? "data" : "empty");
      } catch (error) {
        console.error("Error loading purchase data:", error);
        setViewState("error");
      }
    };

    loadData();
  }, []);

  // Handler para el botón secreto (click en el icono)
  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    
    // Después de 5 clicks, mostrar diálogo de contraseña
    if (newCount >= 5) {
      setShowPasswordDialog(true);
      setSecretClickCount(0); // Reset counter
    }
  };

  // Handler cuando se ingresa contraseña correcta
  const handlePasswordSuccess = () => {
    setShowSupplierManagement(true);
  };

  // Handler cuando se verifica la contraseña para guardar cambios
  const handleEditPasswordSuccess = async () => {
    if (pendingOrderChanges) {
      setOrders(orders.map((o) => (o.id === pendingOrderChanges.id ? pendingOrderChanges : o)));
      setPendingOrderChanges(null);
      setSelectedOrder(null);
      setOriginalOrder(null);
      setIsEditMode(false);
      
      const { toast } = await import("sonner");
      toast.success("Orden actualizada exitosamente");
    }
  };

  // Handler cuando se verifica la contraseña para cancelar orden
  const handleCancelPasswordSuccess = async () => {
    if (pendingCancelOrder) {
      const updatedOrder = { ...pendingCancelOrder, status: "Cancelada" as PurchaseOrder["status"] };
      setOrders(orders.map((o) => (o.id === pendingCancelOrder.id ? updatedOrder : o)));
      setPendingCancelOrder(null);
      
      const { toast } = await import("sonner");
      toast.success(`Orden ${pendingCancelOrder.orderNumber} cancelada exitosamente`);
    }
  };

  // Función para detectar si hubo cambios
  const hasChanges = (original: PurchaseOrder, current: PurchaseOrder) => {
    return JSON.stringify(original) !== JSON.stringify(current);
  };

  // Handler para abrir modal de vista/edición
  const handleViewEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder({ ...order });
    setOriginalOrder({ ...order });
    setIsEditMode(false);
  };

  // Handler para activar modo edición
  const handleEnableEdit = () => {
    setIsEditMode(true);
  };

  // Handler para guardar cambios (con validación de contraseña)
  const handleSaveChanges = () => {
    if (selectedOrder && originalOrder) {
      if (hasChanges(originalOrder, selectedOrder)) {
        // Hay cambios, solicitar contraseña
        setPendingOrderChanges(selectedOrder);
        setShowEditPasswordDialog(true);
      } else {
        // No hay cambios, cerrar sin contraseña
        setSelectedOrder(null);
        setOriginalOrder(null);
        setIsEditMode(false);
      }
    }
  };

  // Handler para cancelar orden
  const handleCancelOrder = async (order: PurchaseOrder) => {
    if (confirm(`¿Está seguro de CANCELAR la orden ${order.orderNumber}?\n\nLa orden será marcada como cancelada. El folio ya fue quemado y no se puede reutilizar.`)) {
      setPendingCancelOrder(order);
      setShowCancelPasswordDialog(true);
    }
  };

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

  const handleDownloadPDF = async (order: PurchaseOrder) => {
    try {
      // Importar toast
      const { toast } = await import("sonner");
      
      // Transformar datos al formato esperado con nuevos campos
      const pdfData = {
        orderNumber: order.orderNumber,
        createdDate: order.createdDate,
        workCode: order.workCode,
        workName: order.workName,
        client: order.client,
        buyer: order.buyer,
        supplier: order.supplier,
        supplierFullName: order.supplierFullName || order.supplier,
        supplierContact: order.supplierContact || "N/A",
        supplierAddress: "", // Agregar si está disponible en el futuro
        workResident: "Por asignar", // Agregar si está disponible en el futuro
        workPhone: "N/A", // Agregar si está disponible en el futuro
        workAddress: order.client || "Dirección no especificada",
        deliveryType: order.deliveryType === "Entrega" ? "En Obra" : "Recoger",
        deliveryDate: order.deliveryDate,
        items: order.items.map(item => ({
          quantity: item.quantity,
          unit: "Cub", // Unidad por defecto
          description: item.description,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: order.subtotal,
        iva: order.iva,
        total: order.total,
        observations: order.observations
      };

      const doc = await generatePurchaseOrderPDF(pdfData);
      doc.save(`OC-${order.orderNumber}.pdf`);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      const { toast } = await import("sonner");
      toast.error("Error al generar el PDF");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
    setRequisitionToConvert(null);
  };

  const uniqueWorks = Array.from(new Set(orders.map((o) => o.workCode)));

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || order.status === statusFilter;
    const matchesWork =
      workFilter === "Todos" || order.workCode === workFilter;
    return matchesSearch && matchesStatus && matchesWork;
  });

  const getStatusVariant = (
    status: PurchaseOrder["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Aprobada":
        return "default";
      case "Entregada":
        return "default";
      case "Pendiente":
        return "secondary";
      case "Rechazada":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "Aprobada":
        return <CheckCircle className="h-4 w-4" />;
      case "Entregada":
        return <Package className="h-4 w-4" />;
      case "Pendiente":
        return <Clock className="h-4 w-4" />;
      case "Rechazada":
        return <Trash2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const approvedOrders = filteredOrders.filter((o) => o.status === "Aprobada").length;
  const totalDiscount = filteredOrders.reduce((sum, order) => sum + order.discountAmount, 0);

  // Requisitions handlers
  const handleUpdateRequisition = (requisition: MaterialRequisition) => {
    setRequisitions(
      requisitions.map((r) => (r.id === requisition.id ? requisition : r))
    );
  };

  const handleConvertToOC = (requisition: MaterialRequisition) => {
    // Store requisition to convert
    setRequisitionToConvert(requisition);
    
    // Switch to orders tab
    setActiveTab("orders");
    
    // Open form with pre-filled data
    setEditingOrder(null);
    setShowForm(true);
  };

  // Requisitions stats
  const reqUrgent = requisitions.filter((r) => r.urgency === "Urgente" && r.status !== "Comprado").length;

  // Handlers placeholder
  const handleCreateOrder = () => {
    console.log("Crear nueva orden de compra");
    setShowForm(true);
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    setViewState("data");
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <PurchaseOrderStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <PurchaseOrderStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return (
      <PurchaseOrderStateEmpty
        onCreateOrder={handleCreateOrder}
        onNavigateToSuppliers={onNavigateToSuppliers}
      />
    );
  }

  // ESTADO: DATA (contenido completo original)
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors active:scale-95"
                onClick={handleSecretClick}
                title={secretClickCount > 0 ? `${secretClickCount}/5 clicks` : ""}
              >
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Departamento de Compras
                </h1>
                <p className="text-muted-foreground">
                  Gestión centralizada de órdenes de compra y requisiciones
                </p>
              </div>
            </div>
            
            {/* Botón visible de Gestión de Proveedores */}
            <Button 
              onClick={() => {
                if (onNavigateToSuppliers) {
                  onNavigateToSuppliers();
                } else {
                  setShowPasswordDialog(true);
                }
              }}
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
              size="lg"
            >
              <Users className="h-5 w-5" />
              Gestión de Proveedores
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b bg-white rounded-t-lg">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Órdenes de Compra
              <Badge variant="secondary" className="ml-2">
                {orders.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("requisitions")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                activeTab === "requisitions"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              Requisiciones Recibidas
              <Badge variant="secondary" className="ml-2">
                {requisitions.length}
              </Badge>
              {reqUrgent > 0 && (
                <Badge className="ml-1 bg-red-500">
                  <Zap className="h-3 w-3 mr-1" />
                  {reqUrgent}
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "orders" ? (
          <>
            {/* Filters and Actions */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-3 flex-1 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por número de OC, proveedor u obra..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={workFilter} onValueChange={setWorkFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todas las obras</SelectItem>
                        {uniqueWorks.map((work) => (
                          <SelectItem key={work} value={work}>
                            {work}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos los estados</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Aprobada">Aprobada</SelectItem>
                        <SelectItem value="Rechazada">Rechazada</SelectItem>
                        <SelectItem value="Entregada">Entregada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gap-2 w-full md:w-auto bg-blue-700 hover:bg-blue-800">
                    <Plus className="h-4 w-4" />
                    Nueva Orden de Compra
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Registro de Órdenes de Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          OC / Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Obra
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Proveedor
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Comprador
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          F. Entrega / Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Total
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
                            <div className="font-medium">
                              {order.orderNumber}
                              {order.status === "Cancelada" && (
                                <span className="text-red-600 font-bold ml-1">*</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdDate).toLocaleDateString("es-MX")}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-sm">{order.workCode}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.workName}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-sm">{order.supplier}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {order.supplierFullName}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">{order.buyer}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              {new Date(order.deliveryDate).toLocaleDateString("es-MX")}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {order.deliveryType}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">
                              ${order.total.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                            {!order.hasIVA && (
                              <div className="text-xs text-muted-foreground">Sin IVA</div>
                            )}
                            {order.discount > 0 && (
                              <div className="text-xs text-orange-600">
                                -{order.discount}% desc.
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewEditOrder(order)}
                                title="Ver / Editar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteOrder(order.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadPDF(order)}
                                title="Descargar PDF"
                              >
                                <Download className="h-4 w-4" />
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
          </>
        ) : (
          <RequisitionsSection
            requisitions={requisitions}
            onUpdateRequisition={handleUpdateRequisition}
            onConvertToOC={handleConvertToOC}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <PurchaseOrderForm
          onClose={handleCloseForm}
          onSave={handleSaveOrder}
          editOrder={editingOrder}
          requisitionData={requisitionToConvert}
          works={works.map((work) => ({
            code: work.code,
            name: work.name,
            client: work.client,
            contractNumber: "",
          }))}
          suppliers={suppliers.map((supplier) => ({
            id: supplier.code,
            name: supplier.fullName,
            contact: supplier.contact,
          }))}
          buyers={buyers}
        />
      )}

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditMode ? "Editando Orden de Compra" : "Detalle de Orden de Compra"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {selectedOrder.orderNumber}
                  {selectedOrder.status === "Cancelada" && (
                    <span className="text-red-400 font-bold ml-1">*</span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedOrder(null);
                  setOriginalOrder(null);
                  setIsEditMode(false);
                }}
                className="text-white hover:bg-blue-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Work and Supplier Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Información de Obra</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Obra:</span>
                        {isEditMode ? (
                          <Select
                            value={selectedOrder.workCode}
                            onValueChange={(value) => {
                              const work = works.find((w) => w.code === value);
                              if (work) {
                                const newOrderNumber = generateOrderNumber(
                                  value,
                                  selectedOrder.buyer,
                                  selectedOrder.supplier,
                                  orders,
                                  selectedOrder.id
                                );
                                setSelectedOrder({
                                  ...selectedOrder,
                                  workCode: value,
                                  workName: work.name,
                                  client: work.client,
                                  orderNumber: newOrderNumber,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {works.map((work) => (
                                <SelectItem key={work.code} value={work.code}>
                                  {work.code} - {work.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium">{selectedOrder.workCode} - {selectedOrder.workName}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cliente:</span>
                        <p className="font-medium">{selectedOrder.client}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Información de Proveedor</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Proveedor:</span>
                        {isEditMode ? (
                          <Select
                            value={selectedOrder.supplier}
                            onValueChange={(value) => {
                              const supplier = suppliers.find((s) => s.code === value);
                              if (supplier) {
                                const newOrderNumber = generateOrderNumber(
                                  selectedOrder.workCode,
                                  selectedOrder.buyer,
                                  value,
                                  orders,
                                  selectedOrder.id
                                );
                                setSelectedOrder({
                                  ...selectedOrder,
                                  supplier: value,
                                  supplierFullName: supplier.fullName,
                                  supplierContact: supplier.contact,
                                  orderNumber: newOrderNumber,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem key={supplier.code} value={supplier.code}>
                                  {supplier.code} - {supplier.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium">{selectedOrder.supplier} - {selectedOrder.supplierFullName}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contacto:</span>
                        <p className="font-medium text-xs">{selectedOrder.supplierContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Folio Update Notice */}
                {isEditMode && originalOrder && selectedOrder.orderNumber !== originalOrder.orderNumber && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900 mb-1">Actualización de Folio</h4>
                        <div className="text-sm text-amber-800 space-y-1">
                          <p>
                            <span className="font-medium">Folio anterior:</span>{" "}
                            <span className="line-through">{originalOrder.orderNumber}</span>
                          </p>
                          <p>
                            <span className="font-medium">Nuevo folio:</span>{" "}
                            <span className="font-bold text-amber-900">{selectedOrder.orderNumber}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Purchase Details */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Comprador</p>
                    {isEditMode ? (
                      <Select
                        value={selectedOrder.buyer}
                        onValueChange={(value) => {
                          const newOrderNumber = generateOrderNumber(
                            selectedOrder.workCode,
                            value,
                            selectedOrder.supplier,
                            orders,
                            selectedOrder.id
                          );
                          setSelectedOrder({
                            ...selectedOrder,
                            buyer: value,
                            orderNumber: newOrderNumber,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {buyers.map((buyer) => (
                            <SelectItem key={buyer.name} value={buyer.name}>
                              {buyer.name} ({buyer.initials})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{selectedOrder.buyer}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Entrega</p>
                    {isEditMode ? (
                      <Input
                        type="date"
                        value={selectedOrder.deliveryDate}
                        onChange={(e) =>
                          setSelectedOrder({ ...selectedOrder, deliveryDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {new Date(selectedOrder.deliveryDate).toLocaleDateString("es-MX")}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo de Entrega</p>
                    {isEditMode ? (
                      <Select
                        value={selectedOrder.deliveryType}
                        onValueChange={(value: "Entrega" | "Recolección") =>
                          setSelectedOrder({ ...selectedOrder, deliveryType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entrega">Entrega</SelectItem>
                          <SelectItem value="Recolección">Recolección</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{selectedOrder.deliveryType}</Badge>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Conceptos</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm">Descripción</th>
                          <th className="px-4 py-2 text-left text-sm w-24">Cantidad</th>
                          <th className="px-4 py-2 text-left text-sm w-32">P. Unitario</th>
                          <th className="px-4 py-2 text-left text-sm w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm">
                              {isEditMode ? (
                                <Input
                                  value={item.description}
                                  onChange={(e) => {
                                    const newItems = [...selectedOrder.items];
                                    newItems[index] = {
                                      ...item,
                                      description: e.target.value,
                                    };
                                    setSelectedOrder({ ...selectedOrder, items: newItems });
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                item.description
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {isEditMode ? (
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newItems = [...selectedOrder.items];
                                    const quantity = Number(e.target.value);
                                    const total = quantity * item.unitPrice;
                                    newItems[index] = {
                                      ...item,
                                      quantity,
                                      total,
                                    };
                                    
                                    const subtotal = newItems.reduce((sum, it) => sum + it.total, 0);
                                    const discountAmount = subtotal * (selectedOrder.discount / 100);
                                    const iva = selectedOrder.hasIVA ? (subtotal - discountAmount) * 0.16 : 0;
                                    const totalOrder = subtotal - discountAmount + iva;
                                    
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      items: newItems,
                                      subtotal,
                                      discountAmount,
                                      iva,
                                      total: totalOrder,
                                    });
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                item.quantity
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {isEditMode ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) => {
                                    const newItems = [...selectedOrder.items];
                                    const unitPrice = Number(e.target.value);
                                    const total = item.quantity * unitPrice;
                                    newItems[index] = {
                                      ...item,
                                      unitPrice,
                                      total,
                                    };
                                    
                                    const subtotal = newItems.reduce((sum, it) => sum + it.total, 0);
                                    const discountAmount = subtotal * (selectedOrder.discount / 100);
                                    const iva = selectedOrder.hasIVA ? (subtotal - discountAmount) * 0.16 : 0;
                                    const totalOrder = subtotal - discountAmount + iva;
                                    
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      items: newItems,
                                      subtotal,
                                      discountAmount,
                                      iva,
                                      total: totalOrder,
                                    });
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                `$${item.unitPrice.toLocaleString("es-MX")}`
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium">
                              ${item.total.toLocaleString("es-MX")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Discount and IVA Options */}
                {isEditMode && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Descuento (%)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={selectedOrder.discount}
                        onChange={(e) => {
                          const discount = Number(e.target.value);
                          const discountAmount = selectedOrder.subtotal * (discount / 100);
                          const iva = selectedOrder.hasIVA
                            ? (selectedOrder.subtotal - discountAmount) * 0.16
                            : 0;
                          const total = selectedOrder.subtotal - discountAmount + iva;
                          
                          setSelectedOrder({
                            ...selectedOrder,
                            discount,
                            discountAmount,
                            iva,
                            total,
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedOrder.hasIVA}
                          onChange={(e) => {
                            const hasIVA = e.target.checked;
                            const iva = hasIVA
                              ? (selectedOrder.subtotal - selectedOrder.discountAmount) * 0.16
                              : 0;
                            const total = selectedOrder.subtotal - selectedOrder.discountAmount + iva;
                            
                            setSelectedOrder({
                              ...selectedOrder,
                              hasIVA,
                              iva,
                              total,
                            });
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Aplicar IVA (16%)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="space-y-2 max-w-sm ml-auto">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal:</span>
                      <span className="font-medium">
                        ${selectedOrder.subtotal.toLocaleString("es-MX")}
                      </span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span className="text-sm">Descuento ({selectedOrder.discount}%):</span>
                        <span className="font-medium">
                          -${selectedOrder.discountAmount.toLocaleString("es-MX")}
                        </span>
                      </div>
                    )}
                    {selectedOrder.hasIVA && (
                      <div className="flex justify-between">
                        <span className="text-sm">IVA (16%):</span>
                        <span className="font-medium">
                          ${selectedOrder.iva.toLocaleString("es-MX")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ${selectedOrder.total.toLocaleString("es-MX")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Observaciones</p>
                  {isEditMode ? (
                    <textarea
                      value={selectedOrder.observations}
                      onChange={(e) =>
                        setSelectedOrder({ ...selectedOrder, observations: e.target.value })
                      }
                      className="w-full border rounded-md p-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Observaciones adicionales..."
                    />
                  ) : selectedOrder.observations ? (
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.observations}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin observaciones</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => handleCancelOrder(selectedOrder)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancelar Orden
                </Button>
              </div>
              <div className="space-x-2">
                {isEditMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder({ ...originalOrder! });
                        setIsEditMode(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Deshacer Cambios
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => {
                      setSelectedOrder(null);
                      setOriginalOrder(null);
                      setIsEditMode(false);
                    }}>
                      Cerrar
                    </Button>
                    <Button onClick={handleEnableEdit} className="bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Orden
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Dialog */}
      {showPasswordDialog && (
        <PasswordDialog
          isOpen={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          onSuccess={handlePasswordSuccess}
        />
      )}

      {/* Edit Password Dialog */}
      {showEditPasswordDialog && (
        <PasswordDialog
          isOpen={showEditPasswordDialog}
          onClose={() => {
            setShowEditPasswordDialog(false);
            setPendingOrderChanges(null);
          }}
          onSuccess={handleEditPasswordSuccess}
        />
      )}

      {/* Cancel Password Dialog */}
      {showCancelPasswordDialog && (
        <PasswordDialog
          isOpen={showCancelPasswordDialog}
          onClose={() => {
            setShowCancelPasswordDialog(false);
            setPendingCancelOrder(null);
          }}
          onSuccess={handleCancelPasswordSuccess}
        />
      )}

      {/* Supplier Management */}
      {showSupplierManagement && (
        <SupplierManagement
          isOpen={showSupplierManagement}
          onClose={() => setShowSupplierManagement(false)}
        />
      )}
    </div>
  );
}
