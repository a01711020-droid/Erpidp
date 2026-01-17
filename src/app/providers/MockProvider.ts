/**
 * MOCK PROVIDER
 * Implementación del DataProvider usando datos en memoria
 * Simula operaciones asíncronas y persistencia temporal
 */

import type { IDataProvider } from "./DataProvider.interface";
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

import { MOCK_DATA } from "./mockData";

// ============================================================================
// UTILIDADES
// ============================================================================

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function paginate<T>(data: T[], params?: ListParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  let filteredData = [...data];

  // Aplicar filtros si existen
  if (params?.filters) {
    filteredData = filteredData.filter((item: any) => {
      for (const [key, value] of Object.entries(params.filters!)) {
        if (value && item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  // Aplicar ordenamiento
  if (params?.sortBy) {
    filteredData.sort((a: any, b: any) => {
      const aVal = a[params.sortBy!];
      const bVal = b[params.sortBy!];
      const order = params.sortOrder === "desc" ? -1 : 1;

      if (typeof aVal === "string") {
        return aVal.localeCompare(bVal) * order;
      }
      return (aVal - bVal) * order;
    });
  }

  return {
    data: filteredData.slice(start, end),
    total: filteredData.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredData.length / pageSize),
  };
}

// ============================================================================
// STORAGE EN MEMORIA (simula persistencia durante la sesión)
// ============================================================================

class InMemoryStorage {
  private data = {
    obras: [...MOCK_DATA.obras],
    proveedores: [...MOCK_DATA.proveedores],
    requisiciones: MOCK_DATA.requisiciones.map((r) => ({ ...r, items: [...r.items] })),
    requisicionItems: [...MOCK_DATA.requisicionItems],
    ordenesCompra: MOCK_DATA.ordenesCompra.map((oc) => ({ ...oc, items: [...oc.items] })),
    ordenCompraItems: [...MOCK_DATA.ordenCompraItems],
    pagos: [...MOCK_DATA.pagos],
    destajos: [...MOCK_DATA.destajos],
    usuarios: [...MOCK_DATA.usuarios],
  };

  get<K extends keyof typeof this.data>(key: K) {
    return this.data[key];
  }

  set<K extends keyof typeof this.data>(key: K, value: typeof this.data[K]) {
    this.data[key] = value;
  }
}

const storage = new InMemoryStorage();

// ============================================================================
// MOCK PROVIDER IMPLEMENTATION
// ============================================================================

export class MockProvider implements IDataProvider {
  // ========== OBRAS ==========
  obras = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Obra>> => {
      await delay();
      return paginate(storage.get("obras"), params);
    },

    getById: async (id: string): Promise<Obra> => {
      await delay();
      const obra = storage.get("obras").find((o) => o.id === id);
      if (!obra) throw new Error(`Obra con ID ${id} no encontrada`);
      return obra;
    },

    create: async (data: Omit<Obra, "id" | "createdAt" | "updatedAt">): Promise<Obra> => {
      await delay();
      const now = new Date().toISOString();
      const newObra: Obra = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("obras", [...storage.get("obras"), newObra]);
      return newObra;
    },

    update: async (id: string, data: Partial<Obra>): Promise<Obra> => {
      await delay();
      const obras = storage.get("obras");
      const index = obras.findIndex((o) => o.id === id);
      if (index === -1) throw new Error(`Obra con ID ${id} no encontrada`);

      const updatedObra = {
        ...obras[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      obras[index] = updatedObra;
      storage.set("obras", obras);
      return updatedObra;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const obras = storage.get("obras").filter((o) => o.id !== id);
      storage.set("obras", obras);
    },

    getFinancialSummary: async (id: string): Promise<ObraFinancialSummary> => {
      await delay();
      const obra = await this.obras.getById(id);
      const pagos = storage.get("pagos").filter((p) => p.obraId === id && p.status === "Completado");
      const pagosPendientes = storage.get("pagos").filter((p) => p.obraId === id && p.status === "Programado");

      const totalPaid = pagos.reduce((sum, p) => sum + p.amount, 0);
      const pendingPayments = pagosPendientes.reduce((sum, p) => sum + p.amount, 0);
      const advanceAmount = obra.contractAmount * (obra.advancePercentage / 100);
      const retentionAmount = obra.totalEstimates * (obra.retentionPercentage / 100);

      return {
        obraId: id,
        contractAmount: obra.contractAmount,
        totalEstimates: obra.totalEstimates,
        totalExpenses: obra.totalExpenses,
        actualBalance: obra.actualBalance,
        pendingPayments,
        totalPaid,
        advanceAmount,
        retentionAmount,
      };
    },

    getExpensesByCategory: async (id: string): Promise<ExpenseByCategory[]> => {
      await delay();
      // Categorías simuladas basadas en órdenes de compra
      const ordenesCompra = storage.get("ordenesCompra").filter((oc) => oc.obraId === id);
      const categories: Record<string, number> = {};

      ordenesCompra.forEach((oc) => {
        oc.items.forEach((item) => {
          // Categorizar por tipo de material
          let category = "Otros";
          if (item.description.toLowerCase().includes("cemento") || item.description.toLowerCase().includes("concreto")) {
            category = "Concreto y Cemento";
          } else if (item.description.toLowerCase().includes("varilla") || item.description.toLowerCase().includes("acero")) {
            category = "Acero";
          } else if (item.description.toLowerCase().includes("arena") || item.description.toLowerCase().includes("grava")) {
            category = "Agregados";
          } else if (item.description.toLowerCase().includes("cable") || item.description.toLowerCase().includes("eléctric")) {
            category = "Instalaciones Eléctricas";
          } else if (item.description.toLowerCase().includes("madera") || item.description.toLowerCase().includes("triplay")) {
            category = "Carpintería";
          }

          categories[category] = (categories[category] || 0) + item.subtotal;
        });
      });

      const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

      return Object.entries(categories).map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }));
    },

    getWeeklyExpenses: async (id: string): Promise<WeeklyExpense[]> => {
      await delay();
      const ordenesCompra = storage.get("ordenesCompra").filter((oc) => oc.obraId === id);

      // Agrupar por semana
      const weeklyData: Record<string, { amount: number; date: string }> = {};

      ordenesCompra.forEach((oc) => {
        const date = new Date(oc.issueDate);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Inicio de semana (domingo)
        const weekKey = weekStart.toISOString().split("T")[0];
        const weekLabel = `Semana ${weekStart.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}`;

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { amount: 0, date: weekKey };
        }
        weeklyData[weekKey].amount += oc.total;
      });

      return Object.entries(weeklyData)
        .map(([_, data]) => ({
          week: new Date(data.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
          amount: data.amount,
          date: data.date,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
  };

  // ========== PROVEEDORES ==========
  proveedores = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Proveedor>> => {
      await delay();
      return paginate(storage.get("proveedores"), params);
    },

    getById: async (id: string): Promise<Proveedor> => {
      await delay();
      const proveedor = storage.get("proveedores").find((p) => p.id === id);
      if (!proveedor) throw new Error(`Proveedor con ID ${id} no encontrado`);
      return proveedor;
    },

    create: async (data: Omit<Proveedor, "id" | "createdAt" | "updatedAt">): Promise<Proveedor> => {
      await delay();
      const now = new Date().toISOString();
      const newProveedor: Proveedor = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("proveedores", [...storage.get("proveedores"), newProveedor]);
      return newProveedor;
    },

    update: async (id: string, data: Partial<Proveedor>): Promise<Proveedor> => {
      await delay();
      const proveedores = storage.get("proveedores");
      const index = proveedores.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Proveedor con ID ${id} no encontrado`);

      const updated = {
        ...proveedores[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      proveedores[index] = updated;
      storage.set("proveedores", proveedores);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const proveedores = storage.get("proveedores").filter((p) => p.id !== id);
      storage.set("proveedores", proveedores);
    },
  };

  // ========== REQUISICIONES ==========
  requisiciones = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Requisicion>> => {
      await delay();
      return paginate(storage.get("requisiciones"), params);
    },

    getById: async (id: string): Promise<Requisicion> => {
      await delay();
      const req = storage.get("requisiciones").find((r) => r.id === id);
      if (!req) throw new Error(`Requisición con ID ${id} no encontrada`);
      return req;
    },

    create: async (data: Omit<Requisicion, "id" | "createdAt" | "updatedAt">): Promise<Requisicion> => {
      await delay();
      const now = new Date().toISOString();
      const newReq: Requisicion = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("requisiciones", [...storage.get("requisiciones"), newReq]);
      return newReq;
    },

    update: async (id: string, data: Partial<Requisicion>): Promise<Requisicion> => {
      await delay();
      const requisiciones = storage.get("requisiciones");
      const index = requisiciones.findIndex((r) => r.id === id);
      if (index === -1) throw new Error(`Requisición con ID ${id} no encontrada`);

      const updated = {
        ...requisiciones[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      requisiciones[index] = updated;
      storage.set("requisiciones", requisiciones);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const requisiciones = storage.get("requisiciones").filter((r) => r.id !== id);
      storage.set("requisiciones", requisiciones);
    },

    approve: async (id: string, approvedBy: string): Promise<Requisicion> => {
      return this.requisiciones.update(id, {
        status: "Aprobada",
        approvedBy,
        approvedAt: new Date().toISOString(),
      });
    },

    reject: async (id: string, rejectionReason: string): Promise<Requisicion> => {
      return this.requisiciones.update(id, {
        status: "Rechazada",
        rejectionReason,
      });
    },

    addItem: async (requisicionId: string, item: Omit<RequisicionItem, "id" | "requisicionId" | "createdAt">): Promise<RequisicionItem> => {
      await delay();
      const req = await this.requisiciones.getById(requisicionId);
      const newItem: RequisicionItem = {
        ...item,
        id: generateUUID(),
        requisicionId,
        createdAt: new Date().toISOString(),
      };
      req.items.push(newItem);
      await this.requisiciones.update(requisicionId, { items: req.items });
      return newItem;
    },

    updateItem: async (itemId: string, data: Partial<RequisicionItem>): Promise<RequisicionItem> => {
      await delay();
      const requisiciones = storage.get("requisiciones");
      for (const req of requisiciones) {
        const itemIndex = req.items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          req.items[itemIndex] = { ...req.items[itemIndex], ...data };
          await this.requisiciones.update(req.id, { items: req.items });
          return req.items[itemIndex];
        }
      }
      throw new Error(`Item con ID ${itemId} no encontrado`);
    },

    deleteItem: async (itemId: string): Promise<void> => {
      await delay();
      const requisiciones = storage.get("requisiciones");
      for (const req of requisiciones) {
        const itemIndex = req.items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          req.items.splice(itemIndex, 1);
          await this.requisiciones.update(req.id, { items: req.items });
          return;
        }
      }
      throw new Error(`Item con ID ${itemId} no encontrado`);
    },
  };

  // ========== ÓRDENES DE COMPRA ==========
  ordenesCompra = {
    list: async (params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> => {
      await delay();
      return paginate(storage.get("ordenesCompra"), params);
    },

    getById: async (id: string): Promise<OrdenCompra> => {
      await delay();
      const oc = storage.get("ordenesCompra").find((o) => o.id === id);
      if (!oc) throw new Error(`Orden de compra con ID ${id} no encontrada`);
      return oc;
    },

    create: async (data: Omit<OrdenCompra, "id" | "createdAt" | "updatedAt">): Promise<OrdenCompra> => {
      await delay();
      const now = new Date().toISOString();
      const newOC: OrdenCompra = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("ordenesCompra", [...storage.get("ordenesCompra"), newOC]);
      return newOC;
    },

    update: async (id: string, data: Partial<OrdenCompra>): Promise<OrdenCompra> => {
      await delay();
      const ordenesCompra = storage.get("ordenesCompra");
      const index = ordenesCompra.findIndex((o) => o.id === id);
      if (index === -1) throw new Error(`Orden de compra con ID ${id} no encontrada`);

      const updated = {
        ...ordenesCompra[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      ordenesCompra[index] = updated;
      storage.set("ordenesCompra", ordenesCompra);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const ordenesCompra = storage.get("ordenesCompra").filter((o) => o.id !== id);
      storage.set("ordenesCompra", ordenesCompra);
    },

    addItem: async (ordenCompraId: string, item: Omit<OrdenCompraItem, "id" | "ordenCompraId" | "createdAt">): Promise<OrdenCompraItem> => {
      await delay();
      const oc = await this.ordenesCompra.getById(ordenCompraId);
      const newItem: OrdenCompraItem = {
        ...item,
        id: generateUUID(),
        ordenCompraId,
        createdAt: new Date().toISOString(),
      };
      oc.items.push(newItem);
      await this.ordenesCompra.update(ordenCompraId, { items: oc.items });
      return newItem;
    },

    updateItem: async (itemId: string, data: Partial<OrdenCompraItem>): Promise<OrdenCompraItem> => {
      await delay();
      const ordenesCompra = storage.get("ordenesCompra");
      for (const oc of ordenesCompra) {
        const itemIndex = oc.items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          oc.items[itemIndex] = { ...oc.items[itemIndex], ...data };
          await this.ordenesCompra.update(oc.id, { items: oc.items });
          return oc.items[itemIndex];
        }
      }
      throw new Error(`Item con ID ${itemId} no encontrado`);
    },

    deleteItem: async (itemId: string): Promise<void> => {
      await delay();
      const ordenesCompra = storage.get("ordenesCompra");
      for (const oc of ordenesCompra) {
        const itemIndex = oc.items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          oc.items.splice(itemIndex, 1);
          await this.ordenesCompra.update(oc.id, { items: oc.items });
          return;
        }
      }
      throw new Error(`Item con ID ${itemId} no encontrado`);
    },
  };

  // ========== PAGOS ==========
  pagos = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Pago>> => {
      await delay();
      return paginate(storage.get("pagos"), params);
    },

    getById: async (id: string): Promise<Pago> => {
      await delay();
      const pago = storage.get("pagos").find((p) => p.id === id);
      if (!pago) throw new Error(`Pago con ID ${id} no encontrado`);
      return pago;
    },

    create: async (data: Omit<Pago, "id" | "createdAt" | "updatedAt">): Promise<Pago> => {
      await delay();
      const now = new Date().toISOString();
      const newPago: Pago = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("pagos", [...storage.get("pagos"), newPago]);
      return newPago;
    },

    update: async (id: string, data: Partial<Pago>): Promise<Pago> => {
      await delay();
      const pagos = storage.get("pagos");
      const index = pagos.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Pago con ID ${id} no encontrado`);

      const updated = {
        ...pagos[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      pagos[index] = updated;
      storage.set("pagos", pagos);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const pagos = storage.get("pagos").filter((p) => p.id !== id);
      storage.set("pagos", pagos);
    },

    process: async (id: string, processedBy: string): Promise<Pago> => {
      return this.pagos.update(id, {
        status: "Procesado",
        processedBy,
      });
    },

    complete: async (id: string): Promise<Pago> => {
      return this.pagos.update(id, {
        status: "Completado",
      });
    },

    cancel: async (id: string): Promise<Pago> => {
      return this.pagos.update(id, {
        status: "Cancelado",
      });
    },
  };

  // ========== DESTAJOS ==========
  destajos = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Destajo>> => {
      await delay();
      return paginate(storage.get("destajos"), params);
    },

    getById: async (id: string): Promise<Destajo> => {
      await delay();
      const destajo = storage.get("destajos").find((d) => d.id === id);
      if (!destajo) throw new Error(`Destajo con ID ${id} no encontrado`);
      return destajo;
    },

    create: async (data: Omit<Destajo, "id" | "createdAt" | "updatedAt">): Promise<Destajo> => {
      await delay();
      const now = new Date().toISOString();
      const newDestajo: Destajo = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("destajos", [...storage.get("destajos"), newDestajo]);
      return newDestajo;
    },

    update: async (id: string, data: Partial<Destajo>): Promise<Destajo> => {
      await delay();
      const destajos = storage.get("destajos");
      const index = destajos.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`Destajo con ID ${id} no encontrado`);

      const updated = {
        ...destajos[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      destajos[index] = updated;
      storage.set("destajos", destajos);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const destajos = storage.get("destajos").filter((d) => d.id !== id);
      storage.set("destajos", destajos);
    },

    updateProgress: async (id: string, advancePercentage: number): Promise<Destajo> => {
      return this.destajos.update(id, { advancePercentage });
    },
  };

  // ========== USUARIOS ==========
  usuarios = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Usuario>> => {
      await delay();
      return paginate(storage.get("usuarios"), params);
    },

    getById: async (id: string): Promise<Usuario> => {
      await delay();
      const usuario = storage.get("usuarios").find((u) => u.id === id);
      if (!usuario) throw new Error(`Usuario con ID ${id} no encontrado`);
      return usuario;
    },

    create: async (data: Omit<Usuario, "id" | "createdAt" | "updatedAt">): Promise<Usuario> => {
      await delay();
      const now = new Date().toISOString();
      const newUsuario: Usuario = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      storage.set("usuarios", [...storage.get("usuarios"), newUsuario]);
      return newUsuario;
    },

    update: async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
      await delay();
      const usuarios = storage.get("usuarios");
      const index = usuarios.findIndex((u) => u.id === id);
      if (index === -1) throw new Error(`Usuario con ID ${id} no encontrado`);

      const updated = {
        ...usuarios[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      usuarios[index] = updated;
      storage.set("usuarios", usuarios);
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      const usuarios = storage.get("usuarios").filter((u) => u.id !== id);
      storage.set("usuarios", usuarios);
    },
  };
}
