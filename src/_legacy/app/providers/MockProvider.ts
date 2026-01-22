/**
 * MOCK PROVIDER - Datos de prueba en memoria
 * 
 * REGLAS:
 * - Usa el modelo unificado (codigo, nombre, estado)
 * - Solo para desarrollo/testing
 * - Sin persistencia
 * - Activar solo con VITE_DATA_MODE=mock
 */

import type { IDataProvider } from './DataProvider.interface';
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
  PaginatedResponse,
  ListParams,
} from '../types/entities';
import { v4 as uuidv4 } from 'uuid';

/**
 * Datos mock en memoria
 */
const mockObras: Obra[] = [];
const mockProveedores: Proveedor[] = [];
const mockRequisiciones: Requisicion[] = [];
const mockOrdenesCompra: OrdenCompra[] = [];
const mockPagos: Pago[] = [];
const mockBankTransactions: BankTransaction[] = [];

/**
 * Helper para paginar resultados
 */
function paginate<T>(
  data: T[],
  params?: ListParams
): PaginatedResponse<T> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedData = data.slice(startIndex, endIndex);
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Helper para buscar por ID
 */
function findById<T extends { id: string }>(
  data: T[],
  id: string,
  entity: string
): T {
  const item = data.find(item => item.id === id);
  if (!item) {
    throw new Error(`${entity} con ID ${id} no encontrado`);
  }
  return item;
}

/**
 * Implementación del MockProvider
 */
export class MockProvider implements IDataProvider {
  // ===== OBRAS =====
  async listObras(params?: ListParams): Promise<PaginatedResponse<Obra>> {
    return paginate(mockObras, params);
  }

  async getObra(id: string): Promise<Obra> {
    return findById(mockObras, id, 'Obra');
  }

  async createObra(data: ObraCreate): Promise<Obra> {
    const newObra: Obra = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockObras.push(newObra);
    return newObra;
  }

  async updateObra(id: string, data: ObraUpdate): Promise<Obra> {
    const index = mockObras.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Obra con ID ${id} no encontrada`);
    
    mockObras[index] = {
      ...mockObras[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockObras[index];
  }

  async deleteObra(id: string): Promise<void> {
    const index = mockObras.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Obra con ID ${id} no encontrada`);
    mockObras.splice(index, 1);
  }

  // ===== PROVEEDORES =====
  async listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>> {
    return paginate(mockProveedores, params);
  }

  async getProveedor(id: string): Promise<Proveedor> {
    return findById(mockProveedores, id, 'Proveedor');
  }

  async createProveedor(data: ProveedorCreate): Promise<Proveedor> {
    const newProveedor: Proveedor = {
      id: uuidv4(),
      nombreComercial: null,
      direccion: null,
      ciudad: null,
      codigoPostal: null,
      telefono: null,
      email: null,
      contactoPrincipal: null,
      banco: null,
      numeroCuenta: null,
      clabe: null,
      tipoProveedor: null,
      creditoDias: 0,
      limiteCredito: 0,
      activo: true,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProveedores.push(newProveedor);
    return newProveedor;
  }

  async updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor> {
    const index = mockProveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Proveedor con ID ${id} no encontrado`);
    
    mockProveedores[index] = {
      ...mockProveedores[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockProveedores[index];
  }

  async deleteProveedor(id: string): Promise<void> {
    const index = mockProveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Proveedor con ID ${id} no encontrado`);
    mockProveedores.splice(index, 1);
  }

  // ===== REQUISICIONES =====
  async listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>> {
    return paginate(mockRequisiciones, params);
  }

  async getRequisicion(id: string): Promise<Requisicion> {
    return findById(mockRequisiciones, id, 'Requisicion');
  }

  async createRequisicion(data: RequisicionCreate): Promise<Requisicion> {
    const newRequisicion: Requisicion = {
      id: uuidv4(),
      numeroRequisicion: `REQ-${new Date().getFullYear()}-LOCAL`,
      obraId: data.obraId,
      solicitadoPor: data.solicitadoPor,
      urgencia: data.urgencia,
      estado: 'pendiente',
      observaciones: data.observaciones ?? null,
      aprobadoPor: null,
      fechaAprobacion: null,
      motivoRechazo: null,
      fechaSolicitud: new Date().toISOString(),
      items: data.items.map(item => ({
        ...item,
        id: uuidv4(),
        requisicionId: '', // Se actualizará después
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Actualizar requisicionId en los items
    newRequisicion.items.forEach(item => {
      item.requisicionId = newRequisicion.id;
    });
    
    mockRequisiciones.push(newRequisicion);
    return newRequisicion;
  }

  async updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion> {
    const index = mockRequisiciones.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Requisicion con ID ${id} no encontrada`);
    
    mockRequisiciones[index] = {
      ...mockRequisiciones[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockRequisiciones[index];
  }

  async deleteRequisicion(id: string): Promise<void> {
    const index = mockRequisiciones.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Requisicion con ID ${id} no encontrada`);
    mockRequisiciones.splice(index, 1);
  }

  // ===== ÓRDENES DE COMPRA =====
  async listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> {
    return paginate(mockOrdenesCompra, params);
  }

  async getOrdenCompra(id: string): Promise<OrdenCompra> {
    return findById(mockOrdenesCompra, id, 'OrdenCompra');
  }

  async createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra> {
    const subtotal = data.items.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    const newOrdenCompra: OrdenCompra = {
      id: uuidv4(),
      numeroOrden: `OC-${new Date().getFullYear()}-LOCAL`,
      obraId: data.obraId,
      proveedorId: data.proveedorId,
      requisicionId: data.requisicionId ?? null,
      fechaEmision: new Date().toISOString(),
      fechaEntrega: data.fechaEntrega,
      estado: 'emitida',
      tipoEntrega: data.tipoEntrega ?? 'en_obra',
      subtotal,
      descuento: 0,
      descuentoMonto: 0,
      iva,
      total,
      observaciones: data.observaciones ?? null,
      creadoPor: data.creadoPor ?? null,
      items: data.items.map(item => ({
        ...item,
        id: uuidv4(),
        ordenCompraId: '', // Se actualizará después
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Actualizar ordenCompraId en los items
    newOrdenCompra.items.forEach(item => {
      item.ordenCompraId = newOrdenCompra.id;
    });
    
    mockOrdenesCompra.push(newOrdenCompra);
    return newOrdenCompra;
  }

  async updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra> {
    const index = mockOrdenesCompra.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`OrdenCompra con ID ${id} no encontrada`);
    
    mockOrdenesCompra[index] = {
      ...mockOrdenesCompra[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockOrdenesCompra[index];
  }

  async deleteOrdenCompra(id: string): Promise<void> {
    const index = mockOrdenesCompra.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`OrdenCompra con ID ${id} no encontrada`);
    mockOrdenesCompra.splice(index, 1);
  }

  // ===== PAGOS =====
  async listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>> {
    return paginate(mockPagos, params);
  }

  async getPago(id: string): Promise<Pago> {
    return findById(mockPagos, id, 'Pago');
  }

  async createPago(data: PagoCreate): Promise<Pago> {
    const newPago: Pago = {
      id: uuidv4(),
      numeroPago: `PAG-${new Date().getFullYear()}-LOCAL`,
      obraId: data.obraId,
      proveedorId: data.proveedorId,
      ordenCompraId: data.ordenCompraId,
      monto: data.monto,
      metodoPago: data.metodoPago ?? 'transferencia',
      fechaProgramada: data.fechaProgramada,
      estado: 'programado',
      referencia: data.referencia ?? null,
      comprobante: null,
      observaciones: data.observaciones ?? null,
      procesadoPor: null,
      fechaProcesado: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPagos.push(newPago);
    return newPago;
  }

  async updatePago(id: string, data: PagoUpdate): Promise<Pago> {
    const index = mockPagos.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Pago con ID ${id} no encontrado`);
    
    mockPagos[index] = {
      ...mockPagos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockPagos[index];
  }

  async deletePago(id: string): Promise<void> {
    const index = mockPagos.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Pago con ID ${id} no encontrado`);
    mockPagos.splice(index, 1);
  }

  // ===== CONCILIACIÓN BANCARIA =====
  async listBankTransactions(matched?: boolean): Promise<BankTransaction[]> {
    if (matched === undefined) return mockBankTransactions;
    return mockBankTransactions.filter((item) => item.matched === matched);
  }

  async importBankTransactions(data: BankTransactionCreate[]): Promise<BankTransaction[]> {
    const inserted = data.map((item) => ({
      id: uuidv4(),
      fecha: item.fecha,
      descripcionBanco: item.descripcionBanco,
      descripcionBancoNormalizada: item.descripcionBanco.toLowerCase(),
      monto: item.monto,
      referenciaBancaria: item.referenciaBancaria ?? null,
      ordenCompraId: null,
      matched: false,
      origen: item.origen ?? "csv",
      matchConfidence: 0,
      matchManual: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    mockBankTransactions.push(...inserted);
    return inserted;
  }

  async matchBankTransaction(id: string, data: BankTransactionMatch): Promise<BankTransaction> {
    const index = mockBankTransactions.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Transacción con ID ${id} no encontrada`);
    mockBankTransactions[index] = {
      ...mockBankTransactions[index],
      ordenCompraId: data.ordenCompraId,
      matched: true,
      matchConfidence: data.matchConfidence ?? 0,
      matchManual: data.matchManual ?? true,
      updatedAt: new Date().toISOString(),
    };
    return mockBankTransactions[index];
  }
}

/**
 * Instancia singleton del MockProvider
 */
export const mockProvider = new MockProvider();
