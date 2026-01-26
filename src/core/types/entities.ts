/**
 * MODELO DE DOMINIO UNIFICADO
 * Alineado con backend FastAPI y esquema SQL
 */

export interface Obra {
  id: string;
  codigo: string;
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  residenteIniciales: string | null;
  direccion: string | null;
  montoContratado: number;
  anticipoPorcentaje: number;
  retencionPorcentaje: number;
  saldoActual: number;
  totalEstimaciones: number;
  totalGastos: number;
  avanceFisicoPorcentaje: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
  createdAt: string;
  updatedAt: string;
}

export interface ObraCreate {
  codigo: string;
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  residenteIniciales?: string | null;
  direccion?: string | null;
  montoContratado: number;
  anticipoPorcentaje?: number;
  retencionPorcentaje?: number;
  saldoActual?: number;
  totalEstimaciones?: number;
  totalGastos?: number;
  avanceFisicoPorcentaje?: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
}

export interface ObraUpdate extends Partial<ObraCreate> {}

export interface Proveedor {
  id: string;
  razonSocial: string;
  aliasProveedor: string | null;
  nombreComercial: string | null;
  rfc: string;
  direccion: string | null;
  ciudad: string | null;
  codigoPostal: string | null;
  telefono: string | null;
  email: string | null;
  contactoPrincipal: string | null;
  banco: string | null;
  numeroCuenta: string | null;
  clabe: string | null;
  tipoProveedor: "material" | "servicio" | "renta" | "mixto" | null;
  creditoDias: number;
  limiteCredito: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProveedorCreate {
  razonSocial: string;
  aliasProveedor?: string | null;
  nombreComercial?: string | null;
  rfc: string;
  direccion?: string | null;
  ciudad?: string | null;
  codigoPostal?: string | null;
  telefono?: string | null;
  email?: string | null;
  contactoPrincipal?: string | null;
  banco?: string | null;
  numeroCuenta?: string | null;
  clabe?: string | null;
  tipoProveedor?: "material" | "servicio" | "renta" | "mixto" | null;
  creditoDias?: number;
  limiteCredito?: number;
  activo?: boolean;
}

export interface ProveedorUpdate extends Partial<ProveedorCreate> {}

export interface Requisicion {
  id: string;
  numeroRequisicion: string;
  obraId: string;
  solicitadoPor: string;
  fechaSolicitud: string;
  urgencia: "normal" | "urgente" | "muy_urgente";
  estado: "pendiente" | "aprobada" | "rechazada" | "en_proceso" | "completada";
  observaciones: string | null;
  aprobadoPor: string | null;
  fechaAprobacion: string | null;
  motivoRechazo: string | null;
  items: RequisicionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RequisicionItem {
  id: string;
  requisicionId: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  createdAt: string;
}

export interface RequisicionCreate {
  obraId: string;
  solicitadoPor: string;
  urgencia: "normal" | "urgente" | "muy_urgente";
  observaciones?: string | null;
  items: Omit<RequisicionItem, "id" | "requisicionId" | "createdAt">[];
}

export interface RequisicionUpdate {
  urgencia?: "normal" | "urgente" | "muy_urgente";
  estado?: "pendiente" | "aprobada" | "rechazada" | "en_proceso" | "completada";
  observaciones?: string | null;
  aprobadoPor?: string | null;
  fechaAprobacion?: string | null;
  motivoRechazo?: string | null;
}

export interface OrdenCompra {
  id: string;
  numeroOrden: string;
  obraId: string;
  proveedorId: string;
  requisicionId: string | null;
  compradorNombre: string | null;
  fechaEmision: string;
  fechaEntrega: string;
  estado: "borrador" | "emitida" | "recibida" | "facturada" | "pagada" | "cancelada";
  tipoEntrega: "en_obra" | "bodega" | "recoger" | null;
  hasIva: boolean;
  subtotal: number;
  descuento: number;
  descuentoMonto: number;
  iva: number;
  total: number;
  observaciones: string | null;
  creadoPor: string | null;
  items: OrdenCompraItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdenCompraItem {
  id: string;
  ordenCompraId: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  precioUnitario: number;
  total: number;
  createdAt: string;
}

export interface OrdenCompraCreate {
  obraId: string;
  proveedorId: string;
  requisicionId?: string | null;
  compradorNombre?: string | null;
  fechaEntrega: string;
  tipoEntrega?: "en_obra" | "bodega" | "recoger" | null;
  hasIva?: boolean;
  descuento?: number;
  observaciones?: string | null;
  creadoPor?: string | null;
  items: Omit<OrdenCompraItem, "id" | "ordenCompraId" | "createdAt">[];
}

export interface OrdenCompraUpdate extends Partial<OrdenCompraCreate> {
  estado?: OrdenCompra["estado"];
}

export interface Pago {
  id: string;
  numeroPago: string;
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago: "transferencia" | "cheque" | "efectivo";
  fechaProgramada: string;
  fechaProcesado: string | null;
  estado: "programado" | "procesando" | "completado" | "cancelado";
  referencia: string | null;
  folioFactura: string | null;
  montoFactura: number | null;
  fechaFactura: string | null;
  diasCredito: number | null;
  fechaVencimiento: string | null;
  comprobante: string | null;
  observaciones: string | null;
  procesadoPor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagoCreate {
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago: Pago["metodoPago"];
  fechaProgramada: string;
  referencia?: string | null;
  folioFactura?: string | null;
  montoFactura?: number | null;
  fechaFactura?: string | null;
  diasCredito?: number | null;
  fechaVencimiento?: string | null;
  observaciones?: string | null;
}

export interface PagoUpdate extends Partial<PagoCreate> {
  estado?: Pago["estado"];
}

export interface BankTransaction {
  id: string;
  fecha: string;
  descripcionBanco: string;
  descripcionBancoNormalizada: string | null;
  monto: number;
  referenciaBancaria: string | null;
  ordenCompraId: string | null;
  matched: boolean;
  origen: string;
  matchConfidence: number;
  matchManual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransactionCreate {
  fecha: string;
  descripcionBanco: string;
  monto: number;
  referenciaBancaria?: string | null;
  ordenCompraId?: string | null;
  matched?: boolean;
  origen?: string;
  matchConfidence?: number;
  matchManual?: boolean;
}

export interface BankTransactionMatch {
  ordenCompraId: string | null;
  matchConfidence?: number;
  matchManual?: boolean;
}

export interface MetricasObra {
  obraId: string;
  comprometido: number;
  pagado: number;
  saldo: number;
  porcentajeEjecutado: number;
  totalEstimaciones: number;
  totalGastos: number;
  saldoActual: number;
  avanceFisicoPorcentaje: number;
}

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
  filters?: Record<string, string | number | boolean | null>;
}
