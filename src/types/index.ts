/**
 * TIPOS GLOBALES DE LA APLICACIÓN
 * 
 * Todos los módulos deben importar los tipos desde aquí
 * para mantener consistencia.
 */

// Re-exportar tipos del servicio de base de datos
export type {
  Obra,
  Proveedor,
  MaterialRequisicion,
  Requisicion,
  MaterialOrdenCompra,
  OrdenCompra,
  Pago,
  DestajistaEntry,
  DestajosPorObra,
  CargaSemanal,
} from '@/services/database';

// Tipos adicionales para UI
export type UserRole = 'Admin' | 'Residente' | 'Compras' | 'Pagos';

export interface UserSession {
  role: UserRole;
  name: string;
  initials: string;
  obraCode?: string; // Solo para residentes
}

export interface NavigationState {
  currentModule: 'dashboard' | 'requisiciones' | 'ordenesCompra' | 'pagos' | 'destajos' | 'global';
  currentObra?: string;
}

// Estados comunes
export type StatusRequisicion = 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Proceso' | 'Completada';
export type StatusOrdenCompra = 'Pendiente' | 'Parcial' | 'Pagada' | 'Cancelada';
export type StatusObra = 'Activa' | 'Archivada';

// Opciones de forma de pago
export const FORMAS_PAGO = [
  'Efectivo',
  'Transferencia',
  'Cheque',
  'Crédito',
] as const;

export type FormaPago = typeof FORMAS_PAGO[number];

// Unidades comunes de construcción
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
