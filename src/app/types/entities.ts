/**
 * TIPOS Y DTOs DEL SISTEMA
 * Contrato único de datos compartido entre todos los módulos
 * y todos los providers (Mock y API)
 */

// ============================================================================
// OBRA (Proyecto/Contrato)
// ============================================================================
export interface Obra {
  id: string; // UUID
  code: string; // Código de obra (ej: "227")
  name: string; // Nombre de la obra
  client: string; // Cliente
  contractNumber: string; // Número de contrato
  contractAmount: number; // Monto del contrato
  advancePercentage: number; // Porcentaje de anticipo
  retentionPercentage: number; // Porcentaje de retención
  startDate: string; // Fecha de inicio (ISO)
  estimatedEndDate: string; // Fecha estimada de fin (ISO)
  resident: string; // Residente de obra
  residentInitials: string; // Iniciales del residente
  status: "Activa" | "Pausada" | "Finalizada" | "Cancelada";
  actualBalance: number; // Saldo actual
  totalEstimates: number; // Total de estimaciones
  totalExpenses: number; // Total de gastos
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

// ============================================================================
// PROVEEDOR
// ============================================================================
export interface Proveedor {
  id: string; // UUID
  code: string; // Código del proveedor
  businessName: string; // Razón social
  commercialName: string; // Nombre comercial
  rfc: string; // RFC
  address: string; // Dirección
  city: string; // Ciudad
  state: string; // Estado
  postalCode: string; // Código postal
  phone: string; // Teléfono
  email: string; // Email
  contactName: string; // Nombre de contacto
  contactPhone: string; // Teléfono de contacto
  creditDays: number; // Días de crédito
  accountNumber: string; // Número de cuenta bancaria
  bank: string; // Banco
  clabe: string; // CLABE
  status: "Activo" | "Inactivo" | "Bloqueado";
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

// ============================================================================
// REQUISICIÓN DE MATERIAL
// ============================================================================
export interface Requisicion {
  id: string; // UUID
  code: string; // Código de requisición (ej: "REQ-227-001")
  obraId: string; // ID de la obra
  requestedBy: string; // Solicitado por
  requestedAt: string; // Fecha de solicitud (ISO)
  urgency: "Normal" | "Urgente" | "Muy Urgente";
  status: "Pendiente" | "Aprobada" | "Rechazada" | "En Proceso" | "Completada";
  notes: string; // Notas/Observaciones
  approvedBy: string | null; // Aprobado por
  approvedAt: string | null; // Fecha de aprobación (ISO)
  rejectionReason: string | null; // Razón de rechazo
  items: RequisicionItem[]; // Items de la requisición
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

export interface RequisicionItem {
  id: string; // UUID
  requisicionId: string; // ID de la requisición
  description: string; // Descripción del material
  unit: string; // Unidad de medida
  quantity: number; // Cantidad solicitada
  estimatedPrice: number; // Precio estimado unitario
  notes: string; // Notas del item
  createdAt: string; // Fecha de creación (ISO)
}

// ============================================================================
// ORDEN DE COMPRA
// ============================================================================
export interface OrdenCompra {
  id: string; // UUID
  code: string; // Código de OC (ej: "OC-227-001")
  obraId: string; // ID de la obra
  proveedorId: string; // ID del proveedor
  requisicionId: string | null; // ID de la requisición relacionada
  issueDate: string; // Fecha de emisión (ISO)
  deliveryDate: string; // Fecha de entrega esperada (ISO)
  deliveryAddress: string; // Dirección de entrega
  paymentConditions: string; // Condiciones de pago
  subtotal: number; // Subtotal
  iva: number; // IVA
  total: number; // Total
  status: "Borrador" | "Enviada" | "Confirmada" | "En Tránsito" | "Entregada" | "Cancelada";
  notes: string; // Notas/Observaciones
  authorizedBy: string; // Autorizado por
  items: OrdenCompraItem[]; // Items de la OC
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

export interface OrdenCompraItem {
  id: string; // UUID
  ordenCompraId: string; // ID de la orden de compra
  description: string; // Descripción del material
  unit: string; // Unidad de medida
  quantity: number; // Cantidad
  unitPrice: number; // Precio unitario
  subtotal: number; // Subtotal (quantity * unitPrice)
  createdAt: string; // Fecha de creación (ISO)
}

// ============================================================================
// PAGO
// ============================================================================
export interface Pago {
  id: string; // UUID
  code: string; // Código de pago (ej: "PAG-227-001")
  obraId: string; // ID de la obra
  proveedorId: string; // ID del proveedor
  ordenCompraId: string | null; // ID de la OC relacionada
  amount: number; // Monto del pago
  paymentDate: string; // Fecha de pago (ISO)
  paymentMethod: "Transferencia" | "Cheque" | "Efectivo" | "Tarjeta";
  reference: string; // Referencia/Folio
  status: "Programado" | "Procesado" | "Completado" | "Cancelado";
  notes: string; // Notas/Observaciones
  processedBy: string; // Procesado por
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

// ============================================================================
// DESTAJO
// ============================================================================
export interface Destajo {
  id: string; // UUID
  code: string; // Código de destajo (ej: "DES-227-001")
  obraId: string; // ID de la obra
  contractorName: string; // Nombre del destajista
  description: string; // Descripción del trabajo
  unit: string; // Unidad de medida
  quantity: number; // Cantidad
  unitPrice: number; // Precio unitario
  total: number; // Total (quantity * unitPrice)
  startDate: string; // Fecha de inicio (ISO)
  endDate: string; // Fecha de fin (ISO)
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado";
  advancePercentage: number; // Porcentaje de avance
  notes: string; // Notas/Observaciones
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

// ============================================================================
// USUARIO
// ============================================================================
export interface Usuario {
  id: string; // UUID
  name: string; // Nombre completo
  email: string; // Email
  role: "admin" | "residente" | "compras" | "pagos";
  phone: string; // Teléfono
  status: "Activo" | "Inactivo";
  createdAt: string; // Fecha de creación (ISO)
  updatedAt: string; // Fecha de actualización (ISO)
}

// ============================================================================
// TIPOS PARA DASHBOARDS Y REPORTES
// ============================================================================

export interface ObraFinancialSummary {
  obraId: string;
  contractAmount: number;
  totalEstimates: number;
  totalExpenses: number;
  actualBalance: number;
  pendingPayments: number;
  totalPaid: number;
  advanceAmount: number;
  retentionAmount: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface WeeklyExpense {
  week: string;
  amount: number;
  date: string;
}

// ============================================================================
// TIPOS DE RESPUESTA PARA LISTADOS PAGINADOS
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}
