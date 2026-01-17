/**
 * INTERFACE DEL DATA PROVIDER
 * Define el contrato CRUD para todas las entidades del sistema
 */

import type {
  Obra,
  Proveedor,
  Requisicion,
  RequisicionItem,
  OrdenCompra,
  OrdenCompraItem,
  Pago,
  Destajo,
  Usuario,
  PaginatedResponse,
  ListParams,
  ObraFinancialSummary,
  ExpenseByCategory,
  WeeklyExpense,
} from "@/app/types/entities";

// ============================================================================
// INTERFACE PRINCIPAL DEL DATA PROVIDER
// ============================================================================

export interface IDataProvider {
  // ========== OBRAS ==========
  obras: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Obra>>;
    getById: (id: string) => Promise<Obra>;
    create: (data: Omit<Obra, "id" | "createdAt" | "updatedAt">) => Promise<Obra>;
    update: (id: string, data: Partial<Obra>) => Promise<Obra>;
    delete: (id: string) => Promise<void>;
    getFinancialSummary: (id: string) => Promise<ObraFinancialSummary>;
    getExpensesByCategory: (id: string) => Promise<ExpenseByCategory[]>;
    getWeeklyExpenses: (id: string) => Promise<WeeklyExpense[]>;
  };

  // ========== PROVEEDORES ==========
  proveedores: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Proveedor>>;
    getById: (id: string) => Promise<Proveedor>;
    create: (data: Omit<Proveedor, "id" | "createdAt" | "updatedAt">) => Promise<Proveedor>;
    update: (id: string, data: Partial<Proveedor>) => Promise<Proveedor>;
    delete: (id: string) => Promise<void>;
  };

  // ========== REQUISICIONES ==========
  requisiciones: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Requisicion>>;
    getById: (id: string) => Promise<Requisicion>;
    create: (data: Omit<Requisicion, "id" | "createdAt" | "updatedAt">) => Promise<Requisicion>;
    update: (id: string, data: Partial<Requisicion>) => Promise<Requisicion>;
    delete: (id: string) => Promise<void>;
    approve: (id: string, approvedBy: string) => Promise<Requisicion>;
    reject: (id: string, rejectionReason: string) => Promise<Requisicion>;
    // Items de requisición
    addItem: (requisicionId: string, item: Omit<RequisicionItem, "id" | "requisicionId" | "createdAt">) => Promise<RequisicionItem>;
    updateItem: (itemId: string, data: Partial<RequisicionItem>) => Promise<RequisicionItem>;
    deleteItem: (itemId: string) => Promise<void>;
  };

  // ========== ÓRDENES DE COMPRA ==========
  ordenesCompra: {
    list: (params?: ListParams) => Promise<PaginatedResponse<OrdenCompra>>;
    getById: (id: string) => Promise<OrdenCompra>;
    create: (data: Omit<OrdenCompra, "id" | "createdAt" | "updatedAt">) => Promise<OrdenCompra>;
    update: (id: string, data: Partial<OrdenCompra>) => Promise<OrdenCompra>;
    delete: (id: string) => Promise<void>;
    // Items de orden de compra
    addItem: (ordenCompraId: string, item: Omit<OrdenCompraItem, "id" | "ordenCompraId" | "createdAt">) => Promise<OrdenCompraItem>;
    updateItem: (itemId: string, data: Partial<OrdenCompraItem>) => Promise<OrdenCompraItem>;
    deleteItem: (itemId: string) => Promise<void>;
  };

  // ========== PAGOS ==========
  pagos: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Pago>>;
    getById: (id: string) => Promise<Pago>;
    create: (data: Omit<Pago, "id" | "createdAt" | "updatedAt">) => Promise<Pago>;
    update: (id: string, data: Partial<Pago>) => Promise<Pago>;
    delete: (id: string) => Promise<void>;
    process: (id: string, processedBy: string) => Promise<Pago>;
    complete: (id: string) => Promise<Pago>;
    cancel: (id: string) => Promise<Pago>;
  };

  // ========== DESTAJOS ==========
  destajos: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Destajo>>;
    getById: (id: string) => Promise<Destajo>;
    create: (data: Omit<Destajo, "id" | "createdAt" | "updatedAt">) => Promise<Destajo>;
    update: (id: string, data: Partial<Destajo>) => Promise<Destajo>;
    delete: (id: string) => Promise<void>;
    updateProgress: (id: string, advancePercentage: number) => Promise<Destajo>;
  };

  // ========== USUARIOS ==========
  usuarios: {
    list: (params?: ListParams) => Promise<PaginatedResponse<Usuario>>;
    getById: (id: string) => Promise<Usuario>;
    create: (data: Omit<Usuario, "id" | "createdAt" | "updatedAt">) => Promise<Usuario>;
    update: (id: string, data: Partial<Usuario>) => Promise<Usuario>;
    delete: (id: string) => Promise<void>;
  };
}
