export interface ObraDto {
  id: string;
  codigo: string;
  nombre: string;
}

export interface ProveedorDto {
  id: string;
  proveedor: string;
  razonSocial: string;
}

export interface RequisicionDto {
  id: string;
  requisitionNumber: string;
  workName: string;
  status: string;
}

export interface OrdenCompraDto {
  id: string;
  orderNumber: string;
  workName: string;
  supplierName: string;
  status: string;
}

export interface PagoDto {
  id: string;
  provider: string;
  obra: string;
  monto: number;
  estado: string;
}

export interface DestajoItemDto {
  id: string;
  concepto: string;
  cantidad: number;
}

export interface DestajoSemanaDto {
  id: string;
  semana: string;
  obra: string;
  items: DestajoItemDto[];
}

export interface DestajistaDto {
  id: string;
  nombre: string;
  iniciales: string;
}
