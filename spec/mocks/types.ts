/**
 * TIPOS DE DATOS PARA MOCKS
 * Copia de las entidades del sistema para referencia en spec/
 */

export interface Obra {
  id: string;
  code: string;
  name: string;
  client: string;
  contractNumber: string;
  contractAmount: number;
  advancePercentage: number;
  retentionPercentage: number;
  startDate: string;
  estimatedEndDate: string;
  resident: string;
  residentInitials: string;
  status: string;
  actualBalance: number;
  totalEstimates: number;
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
}

export interface Proveedor {
  id: string;
  code: string;
  businessName: string;
  commercialName: string;
  rfc: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  contactName: string;
  contactPhone: string;
  creditDays: number;
  accountNumber: string;
  bank: string;
  clabe: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequisicionItem {
  id: string;
  requisicionId: string;
  description: string;
  unit: string;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  createdAt: string;
}

export interface Requisicion {
  id: string;
  code: string;
  obraId: string;
  requestedBy: string;
  requestedAt: string;
  urgency: "Normal" | "Urgente" | "Muy Urgente";
  status: "Pendiente" | "Aprobada" | "Completada" | "Rechazada";
  notes: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  items: RequisicionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdenCompraItem {
  id: string;
  ordenCompraId: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
}

export interface OrdenCompra {
  id: string;
  code: string;
  obraId: string;
  proveedorId: string;
  requisicionId: string;
  issueDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  paymentConditions: string;
  subtotal: number;
  iva: number;
  total: number;
  status: "Borrador" | "Enviada" | "Entregada" | "Facturada" | "Pagada" | "Cancelada";
  notes: string;
  authorizedBy: string;
  items: OrdenCompraItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Pago {
  id: string;
  code: string;
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  status: "Programado" | "Procesando" | "Completado" | "Cancelado";
  notes: string;
  processedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destajo {
  id: string;
  code: string;
  obraId: string;
  contractorName: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  startDate: string;
  endDate: string;
  status: "Pendiente" | "En Proceso" | "Completado";
  advancePercentage: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// NUEVOS TIPOS PARA PERSONAL
export interface Employee {
  id: string;
  nombre: string;
  puesto: string;
  obraAsignada: string;
  nombreObra: string;
  salarioDia: number;
  diasSemana: number;
  numeroCuenta?: string;
  banco?: string;
  observaciones?: string;
}

export interface WeeklyRecord {
  empleadoId: string;
  semana: number;
  year: number;
  obraAsignada: string;
  nombreObra: string;
  diasTrabajados: number;
  salarioDia: number;
  salarioPagado: number;
  observaciones: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface DestajistaSemanal {
  inicial: string;
  nombre: string;
  importe: number;
}
