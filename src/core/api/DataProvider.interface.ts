/**
 * INTERFAZ ÚNICA DEL DATA PROVIDER
 */

import type {
  Obra,
  ObraCreate,
  ObraUpdate,
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  Requisicion,
  RequisicionCreate,
  RequisicionUpdate,
  OrdenCompra,
  OrdenCompraCreate,
  OrdenCompraUpdate,
  Pago,
  PagoCreate,
  PagoUpdate,
  BankTransaction,
  BankTransactionCreate,
  BankTransactionMatch,
  MetricasObra,
  PaginatedResponse,
  ListParams,
} from "../types/entities";

export interface IDataProvider {
  listObras(params?: ListParams): Promise<PaginatedResponse<Obra>>;
  getObra(id: string): Promise<Obra>;
  createObra(data: ObraCreate): Promise<Obra>;
  updateObra(id: string, data: ObraUpdate): Promise<Obra>;
  deleteObra(id: string): Promise<void>;

  listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>>;
  getProveedor(id: string): Promise<Proveedor>;
  createProveedor(data: ProveedorCreate): Promise<Proveedor>;
  updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor>;
  deleteProveedor(id: string): Promise<void>;

  listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>>;
  getRequisicion(id: string): Promise<Requisicion>;
  createRequisicion(data: RequisicionCreate): Promise<Requisicion>;
  updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion>;
  deleteRequisicion(id: string): Promise<void>;

  listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>>;
  getOrdenCompra(id: string): Promise<OrdenCompra>;
  createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra>;
  updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra>;
  deleteOrdenCompra(id: string): Promise<void>;

  listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>>;
  getPago(id: string): Promise<Pago>;
  createPago(data: PagoCreate): Promise<Pago>;
  updatePago(id: string, data: PagoUpdate): Promise<Pago>;
  deletePago(id: string): Promise<void>;

  listBankTransactions(matched?: boolean): Promise<BankTransaction[]>;
  importBankTransactions(data: BankTransactionCreate[]): Promise<BankTransaction[]>;
  matchBankTransaction(id: string, data: BankTransactionMatch): Promise<BankTransaction>;

  getMetricasObra(obraId: string): Promise<MetricasObra>;
}
