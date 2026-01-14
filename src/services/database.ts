/**
 * SERVICIO DE BASE DE DATOS CENTRALIZADO
 * 
 * Este servicio maneja TODA la lógica de datos de la aplicación.
 * - Obras
 * - Requisiciones
 * - Órdenes de Compra
 * - Pagos
 * - Destajos
 * - Proveedores
 * 
 * IMPORTANTE: Todo módulo debe usar este servicio para mantener
 * la integridad referencial y actualizar totales automáticamente.
 */

import obrasData from '@/data/obras.json';
import proveedoresData from '@/data/proveedores.json';
import requisicionesData from '@/data/requisiciones.json';
import ordenesCompraData from '@/data/ordenesCompra.json';
import pagosData from '@/data/pagos.json';
import destajosData from '@/data/destajos.json';

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface Obra {
  code: string;
  name: string;
  client: string;
  contractNumber: string;
  contractAmount: number;
  advancePercentage: number;
  retentionPercentage: number;
  startDate: string;
  estimatedEndDate: string;
  resident: string;
  residentInitials: string;
  residentPassword: string;
  status: "Activa" | "Archivada";
  actualBalance: number;
  totalEstimates: number;
  totalExpenses: number;
  totalExpensesFromOCs: number;
  totalExpensesFromDestajos: number;
  createdAt: string;
  updatedAt: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  rfc: string;
  contacto: string;
  telefono: string;
  email: string;
  lineaCredito: number;
  diasCredito: number;
  vencimientoLinea: string;
  saldoPendiente: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequisicion {
  concepto: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Requisicion {
  id: string;
  codigoRequisicion: string;
  obraCode: string;
  obraNombre: string;
  residente: string;
  residenteIniciales: string;
  fecha: string;
  materiales: MaterialRequisicion[];
  total: number;
  status: "Pendiente" | "Aprobada" | "Rechazada" | "En Proceso" | "Completada";
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialOrdenCompra {
  concepto: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface OrdenCompra {
  id: string;
  codigoOC: string;
  obraCode: string;
  obraNombre: string;
  proveedor: string;
  proveedorId: string;
  comprador: string;
  compradorIniciales: string;
  fecha: string;
  fechaEntrega: string;
  materiales: MaterialOrdenCompra[];
  subtotal: number;
  iva: number;
  total: number;
  formaPago: string;
  diasCredito: number;
  status: "Pendiente" | "Parcial" | "Pagada" | "Cancelada";
  montoPagado: number;
  saldoPendiente: number;
  requisicionesVinculadas: string[];
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pago {
  id: string;
  fecha: string;
  ordenCompraId: string;
  codigoOC: string;
  proveedor: string;
  monto: number;
  metodoPago: string;
  referencia: string;
  banco?: string;
  cuentaBancaria?: string;
  notas?: string;
  createdAt: string;
}

export interface DestajistaEntry {
  inicial: string;
  nombre: string;
  importe: number;
}

export interface DestajosPorObra {
  codigoObra: string;
  nombreObra: string;
  destajistas: DestajistaEntry[];
  totalObra: number;
}

export interface CargaSemanal {
  id: string;
  fecha: string;
  semana: string;
  obras: DestajosPorObra[];
  totalGeneral: number;
  archivoNombre: string;
}

// ============================================
// CLASE DATABASE SERVICE
// ============================================

class DatabaseService {
  private static instance: DatabaseService;
  
  // Caché en memoria (simulando base de datos)
  private obras: Obra[] = [];
  private proveedores: Proveedor[] = [];
  private requisiciones: Requisicion[] = [];
  private ordenesCompra: OrdenCompra[] = [];
  private pagos: Pago[] = [];
  private destajos: CargaSemanal[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ============================================
  // CARGA Y PERSISTENCIA
  // ============================================

  private loadFromStorage() {
    // Cargar desde localStorage o usar datos iniciales de JSON
    this.obras = this.getFromLocalStorage('obras', obrasData as Obra[]);
    this.proveedores = this.getFromLocalStorage('proveedores', proveedoresData as Proveedor[]);
    this.requisiciones = this.getFromLocalStorage('requisiciones', requisicionesData as Requisicion[]);
    this.ordenesCompra = this.getFromLocalStorage('ordenesCompra', ordenesCompraData as OrdenCompra[]);
    this.pagos = this.getFromLocalStorage('pagos', pagosData as Pago[]);
    this.destajos = this.getFromLocalStorage('destajosCargas', destajosData as CargaSemanal[]);
  }

  private getFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private saveToLocalStorage<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // ============================================
  // OBRAS - CRUD
  // ============================================

  public getObras(): Obra[] {
    return [...this.obras];
  }

  public getObraByCode(code: string): Obra | undefined {
    return this.obras.find(o => o.code === code);
  }

  public createObra(obra: Omit<Obra, 'createdAt' | 'updatedAt' | 'totalExpensesFromOCs' | 'totalExpensesFromDestajos'>): Obra {
    const newObra: Obra = {
      ...obra,
      totalExpensesFromOCs: 0,
      totalExpensesFromDestajos: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.obras.push(newObra);
    this.saveToLocalStorage('obras', this.obras);
    return newObra;
  }

  public updateObra(code: string, updates: Partial<Obra>): Obra | null {
    const index = this.obras.findIndex(o => o.code === code);
    if (index === -1) return null;

    this.obras[index] = {
      ...this.obras[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('obras', this.obras);
    return this.obras[index];
  }

  public deleteObra(code: string): boolean {
    const index = this.obras.findIndex(o => o.code === code);
    if (index === -1) return false;

    this.obras.splice(index, 1);
    this.saveToLocalStorage('obras', this.obras);
    return true;
  }

  // ============================================
  // OBRAS - RECALCULAR TOTALES
  // ============================================

  public recalcularTotalesObra(obraCode: string) {
    const obra = this.getObraByCode(obraCode);
    if (!obra) return;

    // Calcular total de OCs de esta obra
    const totalOCs = this.ordenesCompra
      .filter(oc => oc.obraCode === obraCode && oc.status !== 'Cancelada')
      .reduce((sum, oc) => sum + oc.total, 0);

    // Calcular total de destajos de esta obra
    const totalDestajos = this.destajos
      .flatMap(carga => carga.obras)
      .filter(obraDestajo => obraDestajo.codigoObra === obraCode)
      .reduce((sum, obraDestajo) => sum + obraDestajo.totalObra, 0);

    // Actualizar totales
    this.updateObra(obraCode, {
      totalExpensesFromOCs: totalOCs,
      totalExpensesFromDestajos: totalDestajos,
      totalExpenses: totalOCs + totalDestajos,
    });
  }

  // ============================================
  // PROVEEDORES - CRUD
  // ============================================

  public getProveedores(): Proveedor[] {
    return [...this.proveedores];
  }

  public getProveedorById(id: string): Proveedor | undefined {
    return this.proveedores.find(p => p.id === id);
  }

  public createProveedor(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Proveedor {
    const newId = `PROV-${String(this.proveedores.length + 1).padStart(3, '0')}`;
    const newProveedor: Proveedor = {
      ...proveedor,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.proveedores.push(newProveedor);
    this.saveToLocalStorage('proveedores', this.proveedores);
    return newProveedor;
  }

  public updateProveedor(id: string, updates: Partial<Proveedor>): Proveedor | null {
    const index = this.proveedores.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.proveedores[index] = {
      ...this.proveedores[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('proveedores', this.proveedores);
    return this.proveedores[index];
  }

  public recalcularSaldoProveedor(proveedorId: string) {
    const saldoPendiente = this.ordenesCompra
      .filter(oc => oc.proveedorId === proveedorId && oc.status !== 'Cancelada')
      .reduce((sum, oc) => sum + oc.saldoPendiente, 0);

    this.updateProveedor(proveedorId, { saldoPendiente });
  }

  // ============================================
  // REQUISICIONES - CRUD
  // ============================================

  public getRequisiciones(): Requisicion[] {
    return [...this.requisiciones];
  }

  public getRequisicionesByObra(obraCode: string): Requisicion[] {
    return this.requisiciones.filter(r => r.obraCode === obraCode);
  }

  public createRequisicion(requisicion: Omit<Requisicion, 'id' | 'createdAt' | 'updatedAt'>): Requisicion {
    const newRequisicion: Requisicion = {
      ...requisicion,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.requisiciones.push(newRequisicion);
    this.saveToLocalStorage('requisiciones', this.requisiciones);
    return newRequisicion;
  }

  public updateRequisicion(id: string, updates: Partial<Requisicion>): Requisicion | null {
    const index = this.requisiciones.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.requisiciones[index] = {
      ...this.requisiciones[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('requisiciones', this.requisiciones);
    return this.requisiciones[index];
  }

  // ============================================
  // ÓRDENES DE COMPRA - CRUD
  // ============================================

  public getOrdenesCompra(): OrdenCompra[] {
    return [...this.ordenesCompra];
  }

  public getOrdenesCompraByObra(obraCode: string): OrdenCompra[] {
    return this.ordenesCompra.filter(oc => oc.obraCode === obraCode);
  }

  public createOrdenCompra(ordenCompra: Omit<OrdenCompra, 'id' | 'createdAt' | 'updatedAt'>): OrdenCompra {
    const newOrdenCompra: OrdenCompra = {
      ...ordenCompra,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ordenesCompra.push(newOrdenCompra);
    this.saveToLocalStorage('ordenesCompra', this.ordenesCompra);

    // IMPORTANTE: Recalcular totales de la obra
    this.recalcularTotalesObra(ordenCompra.obraCode);
    
    // Recalcular saldo del proveedor
    this.recalcularSaldoProveedor(ordenCompra.proveedorId);

    return newOrdenCompra;
  }

  public updateOrdenCompra(id: string, updates: Partial<OrdenCompra>): OrdenCompra | null {
    const index = this.ordenesCompra.findIndex(oc => oc.id === id);
    if (index === -1) return null;

    const obraCodeAnterior = this.ordenesCompra[index].obraCode;
    const proveedorIdAnterior = this.ordenesCompra[index].proveedorId;

    this.ordenesCompra[index] = {
      ...this.ordenesCompra[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('ordenesCompra', this.ordenesCompra);

    // Recalcular totales
    this.recalcularTotalesObra(obraCodeAnterior);
    if (updates.obraCode && updates.obraCode !== obraCodeAnterior) {
      this.recalcularTotalesObra(updates.obraCode);
    }

    // Recalcular proveedor
    this.recalcularSaldoProveedor(proveedorIdAnterior);
    if (updates.proveedorId && updates.proveedorId !== proveedorIdAnterior) {
      this.recalcularSaldoProveedor(updates.proveedorId);
    }

    return this.ordenesCompra[index];
  }

  // ============================================
  // PAGOS - CRUD
  // ============================================

  public getPagos(): Pago[] {
    return [...this.pagos];
  }

  public getPagosByOrdenCompra(ordenCompraId: string): Pago[] {
    return this.pagos.filter(p => p.ordenCompraId === ordenCompraId);
  }

  public createPago(pago: Omit<Pago, 'id' | 'createdAt'>): Pago {
    const newPago: Pago = {
      ...pago,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.pagos.push(newPago);
    this.saveToLocalStorage('pagos', this.pagos);

    // Actualizar estado de la OC
    const oc = this.ordenesCompra.find(o => o.id === pago.ordenCompraId);
    if (oc) {
      const totalPagado = this.getPagosByOrdenCompra(oc.id)
        .reduce((sum, p) => sum + p.monto, 0);
      
      const nuevoSaldo = oc.total - totalPagado;
      let nuevoStatus: OrdenCompra['status'] = 'Pendiente';
      
      if (nuevoSaldo <= 0) {
        nuevoStatus = 'Pagada';
      } else if (totalPagado > 0) {
        nuevoStatus = 'Parcial';
      }

      this.updateOrdenCompra(oc.id, {
        montoPagado: totalPagado,
        saldoPendiente: nuevoSaldo,
        status: nuevoStatus,
      });
    }

    return newPago;
  }

  // ============================================
  // DESTAJOS - CRUD
  // ============================================

  public getDestajos(): CargaSemanal[] {
    return [...this.destajos];
  }

  public createCargaDestajo(carga: CargaSemanal): CargaSemanal {
    this.destajos.unshift(carga);
    this.saveToLocalStorage('destajosCargas', this.destajos);

    // Recalcular totales de todas las obras afectadas
    carga.obras.forEach(obra => {
      this.recalcularTotalesObra(obra.codigoObra);
    });

    return carga;
  }

  // ============================================
  // ESTADÍSTICAS GLOBALES
  // ============================================

  public getEstadisticasGlobales() {
    const obrasActivas = this.obras.filter(o => o.status === 'Activa');
    
    return {
      totalObrasActivas: obrasActivas.length,
      totalContratos: obrasActivas.reduce((sum, o) => sum + o.contractAmount, 0),
      totalSaldo: obrasActivas.reduce((sum, o) => sum + o.actualBalance, 0),
      totalEstimaciones: obrasActivas.reduce((sum, o) => sum + o.totalEstimates, 0),
      totalGastos: obrasActivas.reduce((sum, o) => sum + o.totalExpenses, 0),
      totalGastosOCs: obrasActivas.reduce((sum, o) => sum + o.totalExpensesFromOCs, 0),
      totalGastosDestajos: obrasActivas.reduce((sum, o) => sum + o.totalExpensesFromDestajos, 0),
      totalRequisiciones: this.requisiciones.length,
      totalOrdenesCompra: this.ordenesCompra.length,
      totalProveedores: this.proveedores.length,
    };
  }

  // ============================================
  // UTILIDADES
  // ============================================

  public generarCodigoRequisicion(obraCode: string): string {
    const requisicionesObra = this.getRequisicionesByObra(obraCode);
    const numero = requisicionesObra.length + 1;
    const obra = this.getObraByCode(obraCode);
    const iniciales = obra?.residentInitials || 'XX';
    return `REQ${obraCode}-${numero}${iniciales}`;
  }

  public generarCodigoOC(obraCode: string, compradorIniciales: string, proveedor: string): string {
    const ocsObra = this.getOrdenesCompraByObra(obraCode);
    const numero = ocsObra.length + 1;
    const letra = String.fromCharCode(65 + Math.floor(numero / 100)); // A, B, C...
    const numCorto = numero % 100;
    const provShort = proveedor.substring(0, 3).toUpperCase();
    return `${obraCode}-${letra}${numCorto}${compradorIniciales}-${provShort}`;
  }
}

// Exportar instancia única
export const db = DatabaseService.getInstance();
