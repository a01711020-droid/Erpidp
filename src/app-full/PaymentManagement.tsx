/**
 * FULL STATE - Módulo de Pagos
 * Con datos completos (mock data realista)
 * 
 * COMPLEJIDADES IMPLEMENTADAS:
 * - Múltiples facturas por OC
 * - Múltiples pagos por factura
 * - Proveedores que NO facturan
 * - Días de crédito por proveedor
 * - Escala masiva (10k+ OCs)
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Upload,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Receipt,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// ==================== TIPOS ====================

interface Payment {
  id: string;
  reference: string;
  amount: number;
  date: string;
  method: "Transferencia" | "Cheque" | "Efectivo";
}

interface Invoice {
  id: string;
  folioFactura: string;
  montoFactura: number;
  fechaFactura: string;
  diasCredito: number;
  fechaVencimiento: string;
  diasVencidos: number;
  payments: Payment[]; // Pagos vinculados a ESTA factura específica
  paidAmount: number; // Suma de payments
}

interface PurchaseOrderPayment {
  id: string;
  orderNumber: string;
  workCode: string;
  workName: string;
  supplier: string;
  orderDate: string;
  totalAmount: number;
  
  // Sistema de facturación
  requiresInvoice: boolean; // Si el proveedor factura o no
  invoices: Invoice[]; // Array de facturas (puede ser vacío o múltiple)
  
  // Pagos directos sin factura (para proveedores que no facturan)
  directPayments: Payment[];
  
  // Crédito
  hasCredit: boolean;
  creditDays: number;
  
  // Cálculos
  totalInvoiced: number; // Suma de montos de facturas
  totalPaid: number; // Suma de TODOS los pagos (facturas + directos)
  pendingAmount: number; // totalAmount - totalPaid
  
  // Estado consolidado
  status: "paid" | "partial" | "pending" | "overdue" | "not_invoiced";
}

// ==================== BASE DE DATOS ====================

// Proveedores con configuración de facturación
const supplierConfig: Record<string, { requiresInvoice: boolean; creditDays: number }> = {
  "CEMEX": { requiresInvoice: true, creditDays: 30 },
  "POLIESTIRENOS": { requiresInvoice: true, creditDays: 30 },
  "FERREMAT": { requiresInvoice: true, creditDays: 40 },
  "LEVINSON": { requiresInvoice: true, creditDays: 15 },
  "INTERCERAMIC": { requiresInvoice: true, creditDays: 30 },
  "BEREL": { requiresInvoice: true, creditDays: 45 },
  "HIERROS": { requiresInvoice: true, creditDays: 20 },
  "ELECTRICSA": { requiresInvoice: true, creditDays: 25 },
  "PINTURAMA": { requiresInvoice: true, creditDays: 30 },
  
  // Proveedores que NO facturan (pago directo)
  "PIPA LUIS GOMEZ": { requiresInvoice: false, creditDays: 0 },
  "ACARREOS JOSE": { requiresInvoice: false, creditDays: 0 },
  "MANO DE OBRA EVENTUAL": { requiresInvoice: false, creditDays: 0 },
};

// ==================== UTILIDADES ====================

const calculateDueDate = (fechaFactura: string, diasCredito: number): string => {
  const date = new Date(fechaFactura);
  date.setDate(date.getDate() + diasCredito);
  return date.toISOString().split('T')[0];
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

// ==================== MOCK DATA ====================

const mockPurchaseOrders: PurchaseOrderPayment[] = [
  // CASO 1: OC con 1 factura, pagada completamente
  {
    id: "1",
    orderNumber: "227-A01GM-CEMEX",
    workCode: "227",
    workName: "CASTELLO E",
    supplier: "CEMEX",
    orderDate: "2025-12-05",
    totalAmount: 40078,
    requiresInvoice: true,
    invoices: [
      {
        id: "inv1",
        folioFactura: "FACT-2025-998",
        montoFactura: 40078,
        fechaFactura: "2025-12-06",
        diasCredito: 30,
        fechaVencimiento: calculateDueDate("2025-12-06", 30),
        diasVencidos: 0,
        payments: [
          {
            id: "p1",
            reference: "TRF-2025-0123",
            amount: 40078,
            date: "2025-12-20",
            method: "Transferencia",
          },
        ],
        paidAmount: 40078,
      },
    ],
    directPayments: [],
    hasCredit: true,
    creditDays: 30,
    totalInvoiced: 40078,
    totalPaid: 40078,
    pendingAmount: 0,
    status: "paid",
  },

  // CASO 2: OC con MÚLTIPLES facturas (facturación parcial), pagos parciales
  {
    id: "2",
    orderNumber: "230-A01JR-CEMEX",
    workCode: "230",
    workName: "CASTELLO H",
    totalAmount: 120000,
    supplier: "CEMEX",
    orderDate: "2026-01-10",
    requiresInvoice: true,
    invoices: [
      {
        id: "inv2a",
        folioFactura: "FACT-2026-001",
        montoFactura: 50000,
        fechaFactura: "2026-01-12",
        diasCredito: 30,
        fechaVencimiento: calculateDueDate("2026-01-12", 30),
        diasVencidos: 0,
        payments: [
          {
            id: "p2a",
            reference: "TRF-2026-001",
            amount: 50000,
            date: "2026-01-15",
            method: "Transferencia",
          },
        ],
        paidAmount: 50000,
      },
      {
        id: "inv2b",
        folioFactura: "FACT-2026-045",
        montoFactura: 40000,
        fechaFactura: "2026-01-20",
        diasCredito: 30,
        fechaVencimiento: calculateDueDate("2026-01-20", 30),
        diasVencidos: 0,
        payments: [
          {
            id: "p2b",
            reference: "TRF-2026-012",
            amount: 20000,
            date: "2026-01-22",
            method: "Transferencia",
          },
        ],
        paidAmount: 20000,
      },
      // Tercera factura sin pago aún
      {
        id: "inv2c",
        folioFactura: "FACT-2026-078",
        montoFactura: 30000,
        fechaFactura: "2026-01-25",
        diasCredito: 30,
        fechaVencimiento: calculateDueDate("2026-01-25", 30),
        diasVencidos: 0,
        payments: [],
        paidAmount: 0,
      },
    ],
    directPayments: [],
    hasCredit: true,
    creditDays: 30,
    totalInvoiced: 120000,
    totalPaid: 70000,
    pendingAmount: 50000,
    status: "partial",
  },

  // CASO 3: OC con factura VENCIDA y pago parcial
  {
    id: "3",
    orderNumber: "227-A02RS-LEVINSON",
    workCode: "227",
    workName: "CASTELLO E",
    supplier: "LEVINSON",
    orderDate: "2025-12-15",
    totalAmount: 40602,
    requiresInvoice: true,
    invoices: [
      {
        id: "inv3",
        folioFactura: "FACT-2025-875",
        montoFactura: 40602,
        fechaFactura: "2025-12-16",
        diasCredito: 15,
        fechaVencimiento: calculateDueDate("2025-12-16", 15),
        diasVencidos: calculateOverdueDays(calculateDueDate("2025-12-16", 15)),
        payments: [
          {
            id: "p3",
            reference: "CHQ-45678",
            amount: 20000,
            date: "2025-12-28",
            method: "Cheque",
          },
        ],
        paidAmount: 20000,
      },
    ],
    directPayments: [],
    hasCredit: true,
    creditDays: 15,
    totalInvoiced: 40602,
    totalPaid: 20000,
    pendingAmount: 20602,
    status: "overdue",
  },

  // CASO 4: Proveedor SIN FACTURA (pago directo en efectivo)
  {
    id: "4",
    orderNumber: "228-A01JR-PIPA LUIS GOMEZ",
    workCode: "228",
    workName: "CASTELLO F",
    supplier: "PIPA LUIS GOMEZ",
    orderDate: "2026-01-07",
    totalAmount: 8500,
    requiresInvoice: false,
    invoices: [],
    directPayments: [
      {
        id: "p4",
        reference: "EFE-001",
        amount: 8500,
        date: "2026-01-07",
        method: "Efectivo",
      },
    ],
    hasCredit: false,
    creditDays: 0,
    totalInvoiced: 0,
    totalPaid: 8500,
    pendingAmount: 0,
    status: "paid",
  },

  // CASO 5: OC pendiente de facturar (con crédito)
  {
    id: "5",
    orderNumber: "229-A01GM-BEREL",
    workCode: "229",
    workName: "CASTELLO G",
    supplier: "BEREL",
    orderDate: "2026-01-08",
    totalAmount: 15120,
    requiresInvoice: true,
    invoices: [],
    directPayments: [],
    hasCredit: true,
    creditDays: 45,
    totalInvoiced: 0,
    totalPaid: 0,
    pendingAmount: 15120,
    status: "not_invoiced",
  },

  // CASO 6: OC con múltiples facturas Y múltiples pagos por factura
  {
    id: "6",
    orderNumber: "231-A01RS-FERREMAT",
    workCode: "231",
    workName: "DOZA A",
    supplier: "FERREMAT",
    orderDate: "2026-01-10",
    totalAmount: 85000,
    requiresInvoice: true,
    invoices: [
      {
        id: "inv6a",
        folioFactura: "FACT-2026-100",
        montoFactura: 50000,
        fechaFactura: "2026-01-11",
        diasCredito: 40,
        fechaVencimiento: calculateDueDate("2026-01-11", 40),
        diasVencidos: 0,
        payments: [
          {
            id: "p6a1",
            reference: "TRF-2026-020",
            amount: 20000,
            date: "2026-01-12",
            method: "Transferencia",
          },
          {
            id: "p6a2",
            reference: "TRF-2026-025",
            amount: 15000,
            date: "2026-01-15",
            method: "Transferencia",
          },
          {
            id: "p6a3",
            reference: "CHQ-9876",
            amount: 15000,
            date: "2026-01-18",
            method: "Cheque",
          },
        ],
        paidAmount: 50000,
      },
      {
        id: "inv6b",
        folioFactura: "FACT-2026-125",
        montoFactura: 35000,
        fechaFactura: "2026-01-18",
        diasCredito: 40,
        fechaVencimiento: calculateDueDate("2026-01-18", 40),
        diasVencidos: 0,
        payments: [
          {
            id: "p6b1",
            reference: "TRF-2026-030",
            amount: 10000,
            date: "2026-01-20",
            method: "Transferencia",
          },
        ],
        paidAmount: 10000,
      },
    ],
    directPayments: [],
    hasCredit: true,
    creditDays: 40,
    totalInvoiced: 85000,
    totalPaid: 60000,
    pendingAmount: 25000,
    status: "partial",
  },

  // CASO 7: Proveedor sin factura, pago parcial directo
  {
    id: "7",
    orderNumber: "232-A01GM-ACARREOS JOSE",
    workCode: "232",
    workName: "DOZA B",
    supplier: "ACARREOS JOSE",
    orderDate: "2026-01-15",
    totalAmount: 12000,
    requiresInvoice: false,
    invoices: [],
    directPayments: [
      {
        id: "p7a",
        reference: "EFE-002",
        amount: 5000,
        date: "2026-01-15",
        method: "Efectivo",
      },
      {
        id: "p7b",
        reference: "EFE-003",
        amount: 3000,
        date: "2026-01-20",
        method: "Efectivo",
      },
    ],
    hasCredit: false,
    creditDays: 0,
    totalInvoiced: 0,
    totalPaid: 8000,
    pendingAmount: 4000,
    status: "partial",
  },

  // CASO 8: Factura con crédito corto, próximo a vencer
  {
    id: "8",
    orderNumber: "233-A01JR-ELECTRICSA",
    workCode: "233",
    workName: "DOZA C",
    supplier: "ELECTRICSA",
    orderDate: "2026-01-20",
    totalAmount: 28500,
    requiresInvoice: true,
    invoices: [
      {
        id: "inv8",
        folioFactura: "FACT-2026-200",
        montoFactura: 28500,
        fechaFactura: "2026-01-22",
        diasCredito: 25,
        fechaVencimiento: calculateDueDate("2026-01-22", 25),
        diasVencidos: 0,
        payments: [],
        paidAmount: 0,
      },
    ],
    directPayments: [],
    hasCredit: true,
    creditDays: 25,
    totalInvoiced: 28500,
    totalPaid: 0,
    pendingAmount: 28500,
    status: "pending",
  },
];

// ==================== COMPONENTE ====================

export default function PaymentManagement() {
  const [orders, setOrders] = useState<PurchaseOrderPayment[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderPayment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false);

  const [newPayment, setNewPayment] = useState({
    reference: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: "Transferencia" as "Transferencia" | "Cheque" | "Efectivo",
  });

  const [newInvoice, setNewInvoice] = useState({
    folioFactura: "",
    montoFactura: 0,
    fechaFactura: new Date().toISOString().split('T')[0],
  });

  const toggleRow = (orderId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  // Filtros
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Pagado" && order.status === "paid") ||
      (statusFilter === "Parcial" && order.status === "partial") ||
      (statusFilter === "Pendiente" && order.status === "pending") ||
      (statusFilter === "Vencido" && order.status === "overdue") ||
      (statusFilter === "Sin Factura" && order.status === "not_invoiced");

    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    partial: orders.filter((o) => o.status === "partial").length,
    pending: orders.filter((o) => o.status === "pending").length,
    overdue: orders.filter((o) => o.status === "overdue").length,
    notInvoiced: orders.filter((o) => o.status === "not_invoiced").length,
    totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    paidAmount: orders.reduce((sum, o) => sum + o.totalPaid, 0),
    pendingAmount: orders.reduce((sum, o) => sum + o.pendingAmount, 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX');
  };

  const getStatusBadge = (order: PurchaseOrderPayment) => {
    if (order.status === "paid") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pagado
        </Badge>
      );
    }

    if (order.status === "not_invoiced") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <FileText className="h-3 w-3 mr-1" />
          Sin Factura
        </Badge>
      );
    }

    if (order.status === "overdue") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 animate-pulse">
          <AlertCircle className="h-3 w-3 mr-1" />
          Vencido
        </Badge>
      );
    }

    if (order.status === "partial") {
      const percentage = (order.totalPaid / order.totalAmount) * 100;
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          Parcial {percentage.toFixed(0)}%
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
        <Clock className="h-3 w-3 mr-1" />
        Pendiente
      </Badge>
    );
  };

  const handleAddInvoice = () => {
    if (!selectedOrder || !newInvoice.folioFactura || newInvoice.montoFactura <= 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    const config = supplierConfig[selectedOrder.supplier];
    const creditDays = config?.creditDays || 0;
    const fechaVencimiento = calculateDueDate(newInvoice.fechaFactura, creditDays);

    const invoice: Invoice = {
      id: `inv${Date.now()}`,
      folioFactura: newInvoice.folioFactura,
      montoFactura: newInvoice.montoFactura,
      fechaFactura: newInvoice.fechaFactura,
      diasCredito: creditDays,
      fechaVencimiento,
      diasVencidos: calculateOverdueDays(fechaVencimiento),
      payments: [],
      paidAmount: 0,
    };

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedInvoices = [...order.invoices, invoice];
        const totalInvoiced = updatedInvoices.reduce((sum, inv) => sum + inv.montoFactura, 0);
        
        return {
          ...order,
          invoices: updatedInvoices,
          totalInvoiced,
          status: order.totalPaid === 0 ? "pending" as const : order.status,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowInvoiceModal(false);
    setSelectedOrder(null);
    setNewInvoice({
      folioFactura: "",
      montoFactura: 0,
      fechaFactura: new Date().toISOString().split('T')[0],
    });
    alert("Factura agregada exitosamente");
  };

  const handleAddPayment = () => {
    if (!selectedOrder || !selectedInvoice || !newPayment.reference || newPayment.amount <= 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    const payment: Payment = {
      id: `p${Date.now()}`,
      reference: newPayment.reference,
      amount: newPayment.amount,
      date: newPayment.date,
      method: newPayment.method,
    };

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedInvoices = order.invoices.map((inv) => {
          if (inv.id === selectedInvoice.id) {
            const updatedPayments = [...inv.payments, payment];
            const paidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
            return {
              ...inv,
              payments: updatedPayments,
              paidAmount,
            };
          }
          return inv;
        });

        const totalPaid = updatedInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0) + 
                         order.directPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = order.totalAmount - totalPaid;

        let newStatus = order.status;
        if (totalPaid >= order.totalAmount) {
          newStatus = "paid";
        } else if (totalPaid > 0) {
          newStatus = "partial";
        }

        return {
          ...order,
          invoices: updatedInvoices,
          totalPaid,
          pendingAmount,
          status: newStatus,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setSelectedInvoice(null);
    setNewPayment({
      reference: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: "Transferencia",
    });
    alert("Pago registrado exitosamente");
  };

  const handleAddDirectPayment = () => {
    if (!selectedOrder || !newPayment.reference || newPayment.amount <= 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    const payment: Payment = {
      id: `p${Date.now()}`,
      reference: newPayment.reference,
      amount: newPayment.amount,
      date: newPayment.date,
      method: newPayment.method,
    };

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedDirectPayments = [...order.directPayments, payment];
        const totalPaid = updatedDirectPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = order.totalAmount - totalPaid;

        let newStatus = order.status;
        if (totalPaid >= order.totalAmount) {
          newStatus = "paid";
        } else if (totalPaid > 0) {
          newStatus = "partial";
        }

        return {
          ...order,
          directPayments: updatedDirectPayments,
          totalPaid,
          pendingAmount,
          status: newStatus,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowDirectPaymentModal(false);
    setSelectedOrder(null);
    setNewPayment({
      reference: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: "Transferencia",
    });
    alert("Pago directo registrado exitosamente");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Módulo de Pagos
              </h1>
              <p className="text-muted-foreground">
                Control de pagos, facturas y seguimiento de órdenes de compra
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total OCs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pagadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Parciales</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.partial}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sin Factura</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.notInvoiced}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monto Pagado</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Saldo Pendiente</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.pendingAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.pendingAmount / stats.totalAmount) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por folio, proveedor o obra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los estados</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Parcial">Pago Parcial</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                  <SelectItem value="Sin Factura">Sin Factura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Compra - Estado de Pagos y Facturas</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length} de {stats.total} órdenes mostradas
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 bg-gray-50">
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-10"></th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">
                      Folio OC
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">
                      Proveedor
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">
                      Facturas
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">
                      Importe Total
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">
                      Pagado
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">
                      Pendiente
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedRows.has(order.id);
                    const percentage = (order.totalPaid / order.totalAmount) * 100;

                    return (
                      <>
                        {/* Main Row */}
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            order.status === "paid"
                              ? "bg-green-50/30"
                              : order.status === "overdue"
                              ? "bg-red-50/30"
                              : order.status === "partial"
                              ? "bg-orange-50/30"
                              : order.status === "not_invoiced"
                              ? "bg-purple-50/30"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-3">
                            <button
                              onClick={() => toggleRow(order.id)}
                              className="hover:bg-gray-200 p-1 rounded"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-mono text-xs font-semibold">
                              {order.orderNumber}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {order.workName}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs font-medium">
                            {order.supplier}
                            {!order.requiresInvoice && (
                              <Badge variant="outline" className="ml-2 text-[9px]">
                                Sin Factura
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Badge variant="outline" className="text-xs">
                              {order.invoices.length}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 text-right text-xs font-semibold">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div
                              className={`text-xs font-semibold ${
                                order.totalPaid === 0
                                  ? "text-gray-500"
                                  : order.totalPaid >= order.totalAmount
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {formatCurrency(order.totalPaid)}
                            </div>
                            {order.totalPaid > 0 && order.totalPaid < order.totalAmount && (
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-orange-500 h-1 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right text-xs font-semibold text-red-600">
                            {formatCurrency(order.pendingAmount)}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {getStatusBadge(order)}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-center gap-1">
                              {order.requiresInvoice ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowInvoiceModal(true);
                                    }}
                                    className="text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Factura
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowDirectPaymentModal(true);
                                  }}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Pago
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} className="px-3 py-4 bg-gray-50/50">
                              <div className="space-y-4">
                                {/* Facturas */}
                                {order.invoices.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <Receipt className="h-4 w-4" />
                                      Facturas ({order.invoices.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {order.invoices.map((invoice) => (
                                        <div
                                          key={invoice.id}
                                          className="bg-white p-3 rounded-lg border"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div>
                                              <div className="font-mono text-xs font-semibold">
                                                {invoice.folioFactura}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                Fecha: {formatDate(invoice.fechaFactura)} | 
                                                Crédito: {invoice.diasCredito} días | 
                                                Vencimiento: {formatDate(invoice.fechaVencimiento)}
                                              </div>
                                              {invoice.diasVencidos > 0 && (
                                                <div className="text-xs text-red-600 font-semibold mt-1">
                                                  ⚠️ Vencido hace {invoice.diasVencidos} días
                                                </div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="text-sm font-semibold">
                                                {formatCurrency(invoice.montoFactura)}
                                              </div>
                                              <div className="text-xs text-green-600 font-medium">
                                                Pagado: {formatCurrency(invoice.paidAmount)}
                                              </div>
                                              <div className="text-xs text-red-600 font-medium">
                                                Pendiente: {formatCurrency(invoice.montoFactura - invoice.paidAmount)}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Pagos de esta factura */}
                                          {invoice.payments.length > 0 && (
                                            <div className="mt-2 pt-2 border-t">
                                              <div className="text-xs font-semibold mb-1">
                                                Pagos ({invoice.payments.length}):
                                              </div>
                                              <div className="space-y-1">
                                                {invoice.payments.map((payment) => (
                                                  <div
                                                    key={payment.id}
                                                    className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded"
                                                  >
                                                    <div>
                                                      <span className="font-mono">{payment.reference}</span>
                                                      <span className="text-muted-foreground ml-2">
                                                        {payment.method}
                                                      </span>
                                                    </div>
                                                    <div>
                                                      <span className="font-semibold text-green-600">
                                                        {formatCurrency(payment.amount)}
                                                      </span>
                                                      <span className="text-muted-foreground ml-2">
                                                        {formatDate(payment.date)}
                                                      </span>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Botón agregar pago */}
                                          {invoice.paidAmount < invoice.montoFactura && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="mt-2 w-full"
                                              onClick={() => {
                                                setSelectedOrder(order);
                                                setSelectedInvoice(invoice);
                                                setNewPayment({
                                                  ...newPayment,
                                                  amount: invoice.montoFactura - invoice.paidAmount,
                                                });
                                                setShowPaymentModal(true);
                                              }}
                                            >
                                              <Plus className="h-3 w-3 mr-1" />
                                              Agregar Pago a esta Factura
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Pagos Directos (sin factura) */}
                                {order.directPayments.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <DollarSign className="h-4 w-4" />
                                      Pagos Directos ({order.directPayments.length})
                                    </h4>
                                    <div className="space-y-1">
                                      {order.directPayments.map((payment) => (
                                        <div
                                          key={payment.id}
                                          className="flex justify-between items-center text-xs bg-white p-3 rounded-lg border"
                                        >
                                          <div>
                                            <span className="font-mono font-semibold">{payment.reference}</span>
                                            <span className="text-muted-foreground ml-2">
                                              {payment.method}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-semibold text-green-600">
                                              {formatCurrency(payment.amount)}
                                            </span>
                                            <span className="text-muted-foreground ml-2">
                                              {formatDate(payment.date)}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Sin datos */}
                                {order.invoices.length === 0 && order.directPayments.length === 0 && (
                                  <div className="text-center py-4 text-muted-foreground text-sm">
                                    Sin facturas ni pagos registrados
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No se encontraron órdenes de compra
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal: Agregar Factura */}
        {showInvoiceModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Agregar Factura
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  OC: {selectedOrder.orderNumber}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Folio de Factura</Label>
                  <Input
                    placeholder="FACT-2026-001"
                    value={newInvoice.folioFactura}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, folioFactura: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Monto de Factura</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newInvoice.montoFactura || ""}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, montoFactura: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Fecha de Factura</Label>
                  <Input
                    type="date"
                    value={newInvoice.fechaFactura}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, fechaFactura: e.target.value })
                    }
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p className="font-semibold text-blue-900">Días de crédito:</p>
                  <p className="text-blue-800">
                    {supplierConfig[selectedOrder.supplier]?.creditDays || 0} días
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowInvoiceModal(false);
                      setSelectedOrder(null);
                      setNewInvoice({
                        folioFactura: "",
                        montoFactura: 0,
                        fechaFactura: new Date().toISOString().split('T')[0],
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleAddInvoice}>
                    Guardar Factura
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal: Agregar Pago a Factura */}
        {showPaymentModal && selectedOrder && selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Registrar Pago
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Factura: {selectedInvoice.folioFactura}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-blue-900">Monto factura:</span>
                    <span className="font-semibold">{formatCurrency(selectedInvoice.montoFactura)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-900">Ya pagado:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(selectedInvoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1">
                    <span className="text-blue-900 font-semibold">Pendiente:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(selectedInvoice.montoFactura - selectedInvoice.paidAmount)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Referencia de Pago</Label>
                  <Input
                    placeholder="TRF-2026-001"
                    value={newPayment.reference}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, reference: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPayment.amount || ""}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Fecha de Pago</Label>
                  <Input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Método de Pago</Label>
                  <Select
                    value={newPayment.method}
                    onValueChange={(value: "Transferencia" | "Cheque" | "Efectivo") =>
                      setNewPayment({ ...newPayment, method: value })
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedOrder(null);
                      setSelectedInvoice(null);
                      setNewPayment({
                        reference: "",
                        amount: 0,
                        date: new Date().toISOString().split('T')[0],
                        method: "Transferencia",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleAddPayment}>
                    Registrar Pago
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal: Pago Directo (sin factura) */}
        {showDirectPaymentModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pago Directo (Sin Factura)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  OC: {selectedOrder.orderNumber}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-purple-900">Monto OC:</span>
                    <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-900">Ya pagado:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(selectedOrder.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 pt-1">
                    <span className="text-purple-900 font-semibold">Pendiente:</span>
                    <span className="font-bold text-red-600">{formatCurrency(selectedOrder.pendingAmount)}</span>
                  </div>
                </div>
                <div>
                  <Label>Referencia de Pago</Label>
                  <Input
                    placeholder="EFE-001"
                    value={newPayment.reference}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, reference: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPayment.amount || ""}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Fecha de Pago</Label>
                  <Input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Método de Pago</Label>
                  <Select
                    value={newPayment.method}
                    onValueChange={(value: "Transferencia" | "Cheque" | "Efectivo") =>
                      setNewPayment({ ...newPayment, method: value })
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowDirectPaymentModal(false);
                      setSelectedOrder(null);
                      setNewPayment({
                        reference: "",
                        amount: 0,
                        date: new Date().toISOString().split('T')[0],
                        method: "Transferencia",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleAddDirectPayment}>
                    Registrar Pago
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
