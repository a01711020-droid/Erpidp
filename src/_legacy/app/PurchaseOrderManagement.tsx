import { useState } from "react";
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
} from "lucide-react";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

// Mock data for orders
const mockOrders: PurchaseOrder[] = [
  {
    id: "1",
    orderNumber: "227-A01GM-CEMEX",
    workCode: "227",
    workName: "CASTELLO E",
    client: "Desarrolladora Inmobiliaria del Centro",
    supplier: "CEMEX",
    supplierFullName: "CEMEX México S.A. de C.V.",
    supplierContact: "Ing. Roberto Martínez - (55) 5555-1234",
    buyer: "Gabriela Mendoza",
    deliveryDate: "2025-01-20",
    deliveryType: "Entrega",
    hasIVA: true,
    discount: 0,
    observations: "Entrega en obra, horario de 8am a 2pm",
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
    discountAmount: 0,
    total: 40078,
    createdDate: "2025-01-05",
    status: "Aprobada",
  },
  {
    id: "2",
    orderNumber: "227-A02RS-LEVINSON",
    workCode: "227",
    workName: "CASTELLO E",
    client: "Desarrolladora Inmobiliaria del Centro",
    supplier: "LEVINSON",
    supplierFullName: "Aceros Levinson",
    supplierContact: "Ing. Carlos Pérez - (55) 5555-3456",
    buyer: "Ricardo Sánchez",
    deliveryDate: "2025-01-22",
    deliveryType: "Recolección",
    hasIVA: true,
    discount: 5,
    observations: "Recoger en almacén principal",
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
    iva: 5452,
    discountAmount: 1850,
    total: 40602,
    createdDate: "2025-01-06",
    status: "Entregada",
  },
  {
    id: "3",
    orderNumber: "228-A01JR-INTERCERAMIC",
    workCode: "228",
    workName: "CASTELLO F",
    client: "Grupo Constructor Metropolitano",
    supplier: "INTERCERAMIC",
    supplierFullName: "Interceramic",
    supplierContact: "Arq. Ana García - (55) 5555-5678",
    buyer: "Juan Reyes",
    deliveryDate: "2025-01-25",
    deliveryType: "Entrega",
    hasIVA: true,
    discount: 0,
    observations: "",
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
    discountAmount: 0,
    total: 40368,
    createdDate: "2025-01-07",
    status: "Pendiente",
  },
  {
    id: "4",
    orderNumber: "229-A01GM-BEREL",
    workCode: "229",
    workName: "CASTELLO G",
    client: "Gobierno del Estado de México",
    supplier: "BEREL",
    supplierFullName: "Pinturas Berel",
    supplierContact: "Lic. Sofia Vargas - (55) 5555-9012",
    buyer: "Gabriela Mendoza",
    deliveryDate: "2025-01-18",
    deliveryType: "Entrega",
    hasIVA: false,
    discount: 10,
    observations: "Gobierno - Sin IVA",
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
    iva: 0,
    discountAmount: 1680,
    total: 15120,
    createdDate: "2025-01-08",
    status: "Aprobada",
  },
  {
    id: "5",
    orderNumber: "231-A01RS-CEMEX",
    workCode: "231",
    workName: "DOZA A",
    client: "Constructora Doza SA",
    supplier: "CEMEX",
    supplierFullName: "CEMEX México S.A. de C.V.",
    supplierContact: "Ing. Roberto Martínez - (55) 5555-1234",
    buyer: "Ricardo Sánchez",
    deliveryDate: "2025-01-28",
    deliveryType: "Entrega",
    hasIVA: true,
    discount: 0,
    observations: "Entrega urgente para inicio de obra",
    items: [
      {
        id: "1",
        description: "Cemento gris CPC 30R",
        quantity: 150,
        unitPrice: 185.5,
        total: 27825,
      },
    ],
    subtotal: 27825,
    iva: 4452,
    discountAmount: 0,
    total: 32277,
    createdDate: "2025-01-10",
    status: "Pendiente",
  },
  {
    id: "6",
    orderNumber: "232-A01JR-HIERROS",
    workCode: "232",
    workName: "BALVANERA",
    client: "Desarrollos Balvanera",
    supplier: "HIERROS",
    supplierFullName: "Hierros y Materiales SA",
    supplierContact: "Sr. Juan Hernández - (55) 5555-4567",
    buyer: "Juan Reyes",
    deliveryDate: "2025-01-30",
    deliveryType: "Entrega",
    hasIVA: true,
    discount: 3,
    observations: "",
    items: [
      {
        id: "1",
        description: "Varilla corrugada 1/2",
        quantity: 300,
        unitPrice: 225,
        total: 67500,
      },
    ],
    subtotal: 67500,
    iva: 10530.6,
    discountAmount: 2025,
    total: 76005.6,
    createdDate: "2025-01-11",
    status: "Aprobada",
  },
];

// Mock data for requisitions
const mockRequisitions: MaterialRequisition[] = [
  {
    id: "1",
    requisitionNumber: "REQ227-001MAT",
    workCode: "227",
    workName: "CASTELLO E",
    residentName: "Ing. Miguel Ángel Torres",
    items: [
      {
        id: "1",
        description: "Cemento gris CPC 30R",
        quantity: 100,
        unit: "BULTO",
      },
      {
        id: "2",
        description: "Arena fina de río",
        quantity: 5,
        unit: "M3",
      },
    ],
    comments: [
      {
        id: "1",
        author: "Ing. Miguel Ángel Torres",
        role: "Residente",
        message: "Necesario para cimentación programada",
        timestamp: "2025-01-10T09:30:00",
      },
      {
        id: "2",
        author: "Departamento de Compras",
        role: "Compras",
        message: "Entendido, generando OC con CEMEX",
        timestamp: "2025-01-10T11:00:00",
      },
    ],
    status: "Convertida a OC",
    createdDate: "2025-01-10",
    urgency: "Urgente",
    deliveryNeededBy: "2025-01-17",
  },
  {
    id: "2",
    requisitionNumber: "REQ228-001LM",
    workCode: "228",
    workName: "CASTELLO F",
    residentName: "Arq. Laura Martínez",
    items: [
      {
        id: "1",
        description: "Varilla corrugada 3/8",
        quantity: 250,
        unit: "PZA",
      },
      {
        id: "2",
        description: "Alambrón",
        quantity: 50,
        unit: "KG",
      },
    ],
    comments: [],
    status: "Pendiente",
    createdDate: "2025-01-11",
    urgency: "Normal",
    deliveryNeededBy: "2025-01-20",
  },
  {
    id: "3",
    requisitionNumber: "REQ229-001RS",
    workCode: "229",
    workName: "CASTELLO G",
    residentName: "Ing. Roberto Sánchez",
    items: [
      {
        id: "1",
        description: "Piso porcelanato 60x60 cm",
        quantity: 150,
        unit: "M2",
      },
    ],
    comments: [
      {
        id: "1",
        author: "Ing. Roberto Sánchez",
        role: "Residente",
        message: "Verificar que sea el mismo tono que la muestra",
        timestamp: "2025-01-09T14:00:00",
      },
    ],
    status: "En Revisión",
    createdDate: "2025-01-09",
    urgency: "Normal",
    deliveryNeededBy: "2025-01-25",
  },
  {
    id: "4",
    requisitionNumber: "REQ231-001CR",
    workCode: "231",
    workName: "DOZA A",
    residentName: "Ing. Carlos Ramírez",
    items: [
      {
        id: "1",
        description: "Block hueco 15x20x40",
        quantity: 5000,
        unit: "PZA",
      },
      {
        id: "2",
        description: "Mortero para pegar block",
        quantity: 80,
        unit: "BULTO",
      },
    ],
    comments: [],
    status: "Pendiente",
    createdDate: "2025-01-12",
    urgency: "Urgente",
    deliveryNeededBy: "2025-01-19",
  },
  {
    id: "5",
    requisitionNumber: "REQ232-001SV",
    workCode: "232",
    workName: "BALVANERA",
    residentName: "Arq. Sofia Vargas",
    items: [
      {
        id: "1",
        description: "Tubería PVC 4 pulgadas",
        quantity: 100,
        unit: "M",
      },
    ],
    comments: [],
    status: "Aprobada",
    createdDate: "2025-01-13",
    urgency: "Planeado",
    deliveryNeededBy: "2025-01-30",
  },
];

export default function PurchaseOrderManagement() {
  const [activeTab, setActiveTab] = useState<"orders" | "requisitions">("orders");
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(mockRequisitions);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [workFilter, setWorkFilter] = useState<string>("Todos");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [pdfOrder, setPdfOrder] = useState<PurchaseOrder | null>(null);

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
    // Mark requisition as converted
    handleUpdateRequisition({ ...requisition, status: "Convertida a OC" });
    
    // Switch to orders tab
    setActiveTab("orders");
    
    // Show form with pre-filled data (in real app)
    alert(`Requisición ${requisition.requisitionNumber} lista para convertir a OC.\n\nEn producción, se abriría el formulario de OC con los datos precargados.`);
  };

  // Requisitions stats
  const reqPending = requisitions.filter((r) => r.status === "Pendiente").length;
  const reqUrgent = requisitions.filter((r) => r.urgency === "Urgente" && r.status !== "Convertida a OC").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-700 rounded-lg">
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
              {reqPending > 0 && (
                <Badge className="ml-1 bg-yellow-500">
                  {reqPending} pendientes
                </Badge>
              )}
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Descuentos
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${totalDiscount.toLocaleString("es-MX", {
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingDown className="h-6 w-6 text-orange-600" />
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
                            <Badge variant={getStatusVariant(order.status)} className="gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                                title="Ver detalle"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOrder(order)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
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
        />
      )}

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Detalle de Orden de Compra</h2>
                <p className="text-blue-100 text-sm">{selectedOrder.orderNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
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
                        <span className="text-muted-foreground">Código:</span>
                        <p className="font-medium">{selectedOrder.workCode}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Obra:</span>
                        <p className="font-medium">{selectedOrder.workName}</p>
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
                        <span className="text-muted-foreground">Código:</span>
                        <p className="font-medium">{selectedOrder.supplier}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nombre:</span>
                        <p className="font-medium">{selectedOrder.supplierFullName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contacto:</span>
                        <p className="font-medium">{selectedOrder.supplierContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Details */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Comprador</p>
                    <p className="font-medium">{selectedOrder.buyer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Entrega</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
                    <Badge variant="outline">{selectedOrder.deliveryType}</Badge>
                  </div>
                </div>

                {/* Items */}
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

                {selectedOrder.observations && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observaciones</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedOrder.observations}
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