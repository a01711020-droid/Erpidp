/**
 * TIPOS UNIFICADOS - FRONTEND
 * Versión: 2.0 - Alineados con backend models.py y schema_unificado.sql
 * 
 * IMPORTANTE: Estos tipos deben coincidir EXACTAMENTE con los modelos Pydantic del backend
 */

// ==========================================
// TIPOS BASE Y UTILITARIOS
// ==========================================

export type UUID = string; // UUIDs representados como strings en frontend

// ==========================================
// ENUMS
// ==========================================

export type EstadoObra = 
  | 'Activa' 
  | 'Pausada' 
  | 'Finalizada' 
  | 'Cancelada' 
  | 'Archivada';

export type UrgenciaRequisicion = 
  | 'Urgente' 
  | 'Normal' 
  | 'Planeado';

export type EstadoRequisicion = 
  | 'Pendiente' 
  | 'En Revisión' 
  | 'Aprobada' 
  | 'Rechazada' 
  | 'En Proceso'
  | 'Convertida a OC'
  | 'Completada' 
  | 'Cancelada';

export type TipoEntrega = 
  | 'Entrega' 
  | 'Recolección';

export type EstadoOrdenCompra = 
  | 'Borrador'
  | 'Pendiente' 
  | 'Aprobada' 
  | 'Rechazada'
  | 'En Tránsito'
  | 'Entregada'
  | 'Parcialmente Pagada'
  | 'Pagada' 
  | 'Cancelada';

export type EstadoPago = 
  | 'Pendiente' 
  | 'Parcial' 
  | 'Pagada' 
  | 'Vencida';

export type TipoPago = 
  | 'Transferencia' 
  | 'Cheque' 
  | 'Efectivo' 
  | 'Tarjeta';

export type EstadoPagoRegistro = 
  | 'Pendiente' 
  | 'Procesado' 
  | 'Aplicado' 
  | 'Rechazado' 
  | 'Cancelado';

export type EstadoDestajo = 
  | 'Pendiente' 
  | 'Aprobado' 
  | 'Rechazado' 
  | 'Pagado' 
  | 'Cancelado';

export type RolUsuario = 
  | 'Admin' 
  | 'Residente' 
  | 'Compras' 
  | 'Pagos' 
  | 'Visualizador';

// ==========================================
// OBRAS
// ==========================================

export interface Obra {
  // Identificación
  id: UUID;
  codigo: string;
  nombre: string;
  
  // Cliente y contrato
  cliente?: string;
  numero_contrato?: string;
  monto_contrato: number;
  
  // Ubicación
  direccion?: string;
  
  // Fechas
  fecha_inicio?: string; // ISO date string
  fecha_fin_estimada?: string;
  fecha_fin_real?: string;
  
  // Residente
  residente?: string;
  residente_iniciales?: string;
  residente_password?: string; // Solo para acceso simple
  residente_telefono?: string;
  residente_email?: string;
  
  // Porcentajes
  porcentaje_anticipo: number;
  porcentaje_retencion: number;
  
  // Montos y balances
  balance_actual: number;
  total_estimaciones: number;
  total_gastos: number;
  total_gastos_oc: number;
  total_gastos_destajos: number;
  
  // Estado
  estado: EstadoObra;
  
  // Metadata
  observaciones?: string;
  metadata: Record<string, any>;
  created_at: string; // ISO datetime string
  updated_at: string;
}

export interface ObraCreate {
  codigo: string;
  nombre: string;
  cliente?: string;
  numero_contrato?: string;
  monto_contrato?: number;
  direccion?: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  residente?: string;
  residente_iniciales?: string;
  residente_password?: string;
  residente_telefono?: string;
  residente_email?: string;
  porcentaje_anticipo?: number;
  porcentaje_retencion?: number;
  estado?: EstadoObra;
  observaciones?: string;
  metadata?: Record<string, any>;
}

export interface ObraUpdate {
  codigo?: string;
  nombre?: string;
  cliente?: string;
  numero_contrato?: string;
  monto_contrato?: number;
  direccion?: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  fecha_fin_real?: string;
  residente?: string;
  residente_iniciales?: string;
  residente_telefono?: string;
  residente_email?: string;
  porcentaje_anticipo?: number;
  porcentaje_retencion?: number;
  balance_actual?: number;
  estado?: EstadoObra;
  observaciones?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// PROVEEDORES
// ==========================================

export interface Proveedor {
  // Identificación
  id: UUID;
  codigo?: string;
  
  // Nombres
  nombre: string;
  razon_social?: string;
  nombre_corto?: string;
  
  // Datos fiscales
  rfc?: string;
  direccion?: string;
  
  // Contacto
  contacto?: string;
  vendedor?: string;
  telefono?: string;
  email?: string;
  
  // Crédito
  linea_credito: number;
  linea_credito_usada: number;
  dias_credito: number;
  vencimiento_linea?: string; // ISO date string
  
  // Estado
  activo: boolean;
  
  // Metadata
  observaciones?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProveedorCreate {
  codigo?: string;
  nombre: string;
  razon_social?: string;
  nombre_corto?: string;
  rfc?: string;
  direccion?: string;
  contacto?: string;
  vendedor?: string;
  telefono?: string;
  email?: string;
  linea_credito?: number;
  dias_credito?: number;
  vencimiento_linea?: string;
  activo?: boolean;
  observaciones?: string;
  metadata?: Record<string, any>;
}

export interface ProveedorUpdate {
  nombre?: string;
  razon_social?: string;
  rfc?: string;
  direccion?: string;
  contacto?: string;
  vendedor?: string;
  telefono?: string;
  email?: string;
  linea_credito?: number;
  dias_credito?: number;
  vencimiento_linea?: string;
  activo?: boolean;
  observaciones?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// REQUISICIONES
// ==========================================

export interface RequisicionItem {
  id: UUID;
  requisicion_id: UUID;
  descripcion: string;
  especificaciones?: string;
  cantidad: number;
  unidad: string;
  precio_unitario_estimado?: number;
  total_estimado?: number;
  orden: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface RequisicionItemCreate {
  descripcion: string;
  especificaciones?: string;
  cantidad: number;
  unidad: string;
  precio_unitario_estimado?: number;
  total_estimado?: number;
  orden?: number;
  metadata?: Record<string, any>;
}

export interface Requisicion {
  id: UUID;
  numero_requisicion: string;
  obra_id: UUID;
  residente_id?: UUID;
  residente?: string;
  residente_iniciales?: string;
  fecha_solicitud: string; // ISO date string
  fecha_necesaria?: string;
  urgencia: UrgenciaRequisicion;
  prioridad: number; // 1-10
  estado: EstadoRequisicion;
  total: number;
  observaciones?: string;
  observaciones_rechazo?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  items: RequisicionItem[];
}

export interface RequisicionCreate {
  numero_requisicion: string;
  obra_id: UUID;
  residente_id?: UUID;
  residente?: string;
  residente_iniciales?: string;
  fecha_solicitud?: string;
  fecha_necesaria?: string;
  urgencia?: UrgenciaRequisicion;
  prioridad?: number;
  estado?: EstadoRequisicion;
  observaciones?: string;
  metadata?: Record<string, any>;
  items: RequisicionItemCreate[];
}

export interface RequisicionUpdate {
  urgencia?: UrgenciaRequisicion;
  fecha_necesaria?: string;
  prioridad?: number;
  estado?: EstadoRequisicion;
  observaciones?: string;
  observaciones_rechazo?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// ÓRDENES DE COMPRA
// ==========================================

export interface OrdenCompraItem {
  id: UUID;
  orden_compra_id: UUID;
  descripcion: string;
  especificaciones?: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal: number;
  descuento: number;
  total: number;
  cantidad_entregada: number;
  orden: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface OrdenCompraItemCreate {
  descripcion: string;
  especificaciones?: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal: number;
  descuento?: number;
  total: number;
  cantidad_entregada?: number;
  orden?: number;
  metadata?: Record<string, any>;
}

export interface OrdenCompra {
  id: UUID;
  numero_orden: string;
  obra_id: UUID;
  proveedor_id: UUID;
  comprador_id?: UUID;
  requisicion_id?: UUID;
  comprador?: string;
  comprador_iniciales?: string;
  fecha_orden: string; // ISO date string
  fecha_entrega_programada?: string;
  fecha_entrega_real?: string;
  tipo_entrega: TipoEntrega;
  subtotal: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  tiene_iva: boolean;
  iva: number;
  total: number;
  forma_pago: string;
  dias_credito: number;
  fecha_vencimiento_pago?: string;
  monto_pagado: number;
  saldo_pendiente: number;
  estado: EstadoOrdenCompra;
  estado_pago: EstadoPago;
  observaciones?: string;
  observaciones_entrega?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  items: OrdenCompraItem[];
}

export interface OrdenCompraCreate {
  numero_orden: string;
  obra_id: UUID;
  proveedor_id: UUID;
  comprador_id?: UUID;
  requisicion_id?: UUID;
  comprador?: string;
  comprador_iniciales?: string;
  fecha_orden?: string;
  fecha_entrega_programada?: string;
  tipo_entrega?: TipoEntrega;
  subtotal?: number;
  descuento_porcentaje?: number;
  descuento_monto?: number;
  tiene_iva?: boolean;
  iva?: number;
  total?: number;
  forma_pago?: string;
  dias_credito?: number;
  fecha_vencimiento_pago?: string;
  estado?: EstadoOrdenCompra;
  observaciones?: string;
  metadata?: Record<string, any>;
  items: OrdenCompraItemCreate[];
}

export interface OrdenCompraUpdate {
  fecha_entrega_programada?: string;
  fecha_entrega_real?: string;
  tipo_entrega?: TipoEntrega;
  descuento_porcentaje?: number;
  descuento_monto?: number;
  tiene_iva?: boolean;
  dias_credito?: number;
  estado?: EstadoOrdenCompra;
  observaciones?: string;
  observaciones_entrega?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// PAGOS
// ==========================================

export interface Pago {
  id: UUID;
  numero_pago: string;
  orden_compra_id: UUID;
  proveedor_id: UUID;
  obra_id: UUID;
  monto: number;
  tipo_pago: TipoPago;
  referencia_bancaria?: string;
  banco?: string;
  cuenta_bancaria?: string;
  fecha_pago: string; // ISO date string
  fecha_aplicacion?: string;
  estado: EstadoPagoRegistro;
  observaciones?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PagoCreate {
  numero_pago: string;
  orden_compra_id: UUID;
  proveedor_id: UUID;
  obra_id: UUID;
  monto: number;
  tipo_pago: TipoPago;
  referencia_bancaria?: string;
  banco?: string;
  cuenta_bancaria?: string;
  fecha_pago: string;
  fecha_aplicacion?: string;
  estado?: EstadoPagoRegistro;
  observaciones?: string;
  metadata?: Record<string, any>;
}

export interface PagoUpdate {
  fecha_aplicacion?: string;
  estado?: EstadoPagoRegistro;
  observaciones?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// DESTAJOS
// ==========================================

export interface Destajo {
  id: UUID;
  obra_id: UUID;
  destajista: string;
  destajista_rfc?: string;
  destajista_telefono?: string;
  concepto: string;
  categoria?: string;
  semana: string;
  fecha_inicio?: string; // ISO date string
  fecha_fin?: string;
  cantidad?: number;
  unidad?: string;
  precio_unitario?: number;
  total: number;
  estado: EstadoDestajo;
  fecha_pago?: string;
  metodo_pago?: string;
  referencia_pago?: string;
  observaciones?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DestajoCreate {
  obra_id: UUID;
  destajista: string;
  destajista_rfc?: string;
  destajista_telefono?: string;
  concepto: string;
  categoria?: string;
  semana: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  cantidad?: number;
  unidad?: string;
  precio_unitario?: number;
  total: number;
  estado?: EstadoDestajo;
  observaciones?: string;
  metadata?: Record<string, any>;
}

export interface DestajoUpdate {
  estado?: EstadoDestajo;
  fecha_pago?: string;
  metodo_pago?: string;
  referencia_pago?: string;
  observaciones?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// USUARIOS (Opcional - para futuro)
// ==========================================

export interface Usuario {
  id: UUID;
  email: string;
  nombre_completo: string;
  iniciales?: string;
  rol: RolUsuario;
  obra_id?: UUID;
  activo: boolean;
  telefono?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ==========================================
// MODELOS DE RESPUESTA AGREGADOS
// ==========================================

export interface ObraResumen {
  obra: Obra;
  total_ordenes_compra: number;
  monto_total_oc: number;
  saldo_pendiente_oc: number;
  total_requisiciones: number;
  total_destajos: number;
}

export interface OrdenCompraCompleta {
  orden: OrdenCompra;
  obra_codigo: string;
  obra_nombre: string;
  proveedor_nombre: string;
  proveedor_rfc?: string;
  estado_vencimiento: 'VENCIDO' | 'POR_VENCER' | 'VIGENTE';
}

// ==========================================
// RESPUESTAS GENÉRICAS
// ==========================================

export interface MessageResponse {
  message: string;
  success: boolean;
  data?: Record<string, any>;
}

export interface ErrorResponse {
  detail: string;
  error_code?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ==========================================
// UTILIDADES Y CONSTANTES
// ==========================================

export const UNIDADES_COMUNES = [
  'pza',
  'kg',
  'ton',
  'm',
  'm2',
  'm3',
  'bulto',
  'lote',
  'caja',
  'rollo',
  'litro',
  'galon',
  'costal',
  'viaje',
] as const;

export type UnidadMedida = typeof UNIDADES_COMUNES[number];

export const FORMAS_PAGO = [
  'Efectivo',
  'Transferencia',
  'Cheque',
  'Crédito',
  'Tarjeta',
] as const;

export type FormaPago = typeof FORMAS_PAGO[number];

// ==========================================
// TIPOS LEGACY (Para compatibilidad temporal)
// ==========================================

// Alias para mantener compatibilidad con código existente
export type StatusRequisicion = EstadoRequisicion;
export type StatusOrdenCompra = EstadoOrdenCompra;
export type StatusObra = EstadoObra;

// Tipo legacy de carga semanal (destajos)
export type CargaSemanal = Destajo;

// Material de requisición (legacy - ahora es RequisicionItem)
export type MaterialRequisicion = RequisicionItem;

// Material de orden de compra (legacy - ahora es OrdenCompraItem)
export type MaterialOrdenCompra = OrdenCompraItem;

// ==========================================
// TYPE GUARDS
// ==========================================

export function isUUID(value: any): value is UUID {
  return typeof value === 'string' && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function isObra(value: any): value is Obra {
  return value && 
    typeof value === 'object' && 
    'codigo' in value && 
    'nombre' in value;
}

export function isProveedor(value: any): value is Proveedor {
  return value && 
    typeof value === 'object' && 
    'nombre' in value;
}

// ==========================================
// HELPERS DE CONVERSIÓN
// ==========================================

/**
 * Convierte un número a formato de moneda mexicana
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

/**
 * Convierte una fecha ISO string a formato legible
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Convierte una fecha ISO string a formato corto
 */
export function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-MX');
}

/**
 * Calcula días restantes desde hoy
 */
export function diasRestantes(fechaFutura: string): number {
  const hoy = new Date();
  const fecha = new Date(fechaFutura);
  const diff = fecha.getTime() - hoy.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
