export interface Obra {
  id: string;
  codigo: string;
  nombre: string;
  cliente: string;
  numero_contrato: string;
  monto_contrato: number;
  anticipo_porcentaje: number;
  retencion_porcentaje: number;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  residente_nombre: string;
  residente_iniciales: string;
  estado: "Activa" | "Archivada";
  balance_actual?: number | null;
  total_estimaciones?: number | null;
  total_gastos?: number | null;
}

export interface Proveedor {
  id: string;
  nombre_comercial: string;
  razon_social: string;
  rfc: string;
  direccion?: string | null;
  ciudad?: string | null;
  codigo_postal?: string | null;
  telefono?: string | null;
  email?: string | null;
  contacto_principal?: string | null;
  banco?: string | null;
  numero_cuenta?: string | null;
  clabe?: string | null;
  tipo_proveedor?: "material" | "servicio" | "renta" | "mixto" | null;
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
}

export interface OrdenCompraItem {
  id: string;
  orden_compra_id: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
}

export interface OrdenCompra {
  id: string;
  folio: string;
  obra_id: string;
  obra_codigo: string;
  obra_nombre: string;
  cliente: string;
  proveedor_id: string;
  proveedor_nombre: string;
  proveedor_razon_social: string;
  proveedor_contacto?: string | null;
  proveedor_rfc?: string | null;
  proveedor_direccion?: string | null;
  proveedor_telefono?: string | null;
  proveedor_banco?: string | null;
  proveedor_cuenta?: string | null;
  proveedor_clabe?: string | null;
  comprador: string;
  fecha_entrega: string;
  tipo_entrega: "Entrega" | "Recolección";
  incluye_iva: boolean;
  descuento: number;
  descuento_monto: number;
  observaciones?: string | null;
  subtotal: number;
  iva: number;
  total: number;
  fecha_creacion: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "Entregada";
  items: OrdenCompraItem[];
}

export interface Pago {
  id: string;
  orden_compra_id: string;
  referencia: string;
  monto: number;
  fecha_pago: string;
  metodo: string;
  folio_factura?: string | null;
  fecha_factura?: string | null;
  monto_factura?: number | null;
}

export interface RequisicionItem {
  id: string;
  requisicion_id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
}

export interface RequisicionComentario {
  id: string;
  requisicion_id: string;
  autor: string;
  rol: "Residente" | "Compras";
  mensaje: string;
  fecha: string;
}

export interface Requisicion {
  id: string;
  folio: string;
  obra_id: string;
  obra_codigo: string;
  obra_nombre: string;
  residente_nombre: string;
  estado: "En Revisión" | "Comprado";
  fecha_creacion: string;
  urgencia: "Urgente" | "Normal" | "Planeado";
  fecha_entrega: string;
  items: RequisicionItem[];
  comentarios: RequisicionComentario[];
}
