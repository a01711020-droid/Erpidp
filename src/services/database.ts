/**
 * SERVICIO DE BASE DE DATOS - PRODUCCIÓN
 * 
 * Este servicio es un ADAPTADOR que conecta con la API REST.
 * Reemplaza el storage local (localStorage/JSON) por llamadas HTTP reales.
 * 
 * MODO DEMO: Si la API no está disponible, cae en modo demo con localStorage.
 */

import {
  obrasAPI,
  proveedoresAPI,
  requisicionesAPI,
  ordenesCompraAPI,
  pagosAPI,
  destajosAPI,
  dashboardAPI,
  healthAPI,
} from './api';

import type {
  Obra,
  Proveedor,
  Requisicion,
  OrdenCompra,
  Pago,
  CargaSemanal,
} from '@/types';

// Datos de fallback para modo demo
import obrasDataJSON from '@/data/obras.json';
import proveedoresDataJSON from '@/data/proveedores.json';
import requisicionesDataJSON from '@/data/requisiciones.json';
import ordenesCompraDataJSON from '@/data/ordenesCompra.json';
import pagosDataJSON from '@/data/pagos.json';
import destajosDataJSON from '@/data/destajos.json';

class DatabaseService {
  private static instance: DatabaseService;
  private apiAvailable: boolean = false;
  private checkingAPI: boolean = false;

  private constructor() {
    this.init();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Inicializar y verificar disponibilidad de API
   */
  private async init() {
    await this.checkAPIHealth();
  }

  /**
   * Verificar si la API está disponible
   */
  async checkAPIHealth(): Promise<boolean> {
    if (this.checkingAPI) return this.apiAvailable;
    
    this.checkingAPI = true;
    try {
      this.apiAvailable = await healthAPI.check();
      console.log(this.apiAvailable ? '✅ API conectada' : '⚠️ API no disponible - usando modo DEMO');
    } catch {
      this.apiAvailable = false;
      console.warn('⚠️ API no disponible - usando modo DEMO con localStorage');
    } finally {
      this.checkingAPI = false;
    }
    
    return this.apiAvailable;
  }

  /**
   * Helper para localStorage (modo demo)
   */
  private getFromLocalStorage<T>(key: string, defaultData: T[]): T[] {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  }

  private saveToLocalStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ==========================================
  // OBRAS
  // ==========================================

  async getObras(): Promise<Obra[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await obrasAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    return this.getFromLocalStorage<Obra>('obras', obrasDataJSON as Obra[]);
  }

  async getObraByCode(code: string): Promise<Obra | undefined> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await obrasAPI.getByCode(code);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const obras = this.getFromLocalStorage<Obra>('obras', obrasDataJSON as Obra[]);
    return obras.find(o => o.code === code);
  }

  async createObra(obra: Omit<Obra, 'id' | 'createdAt' | 'updatedAt'>): Promise<Obra> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await obrasAPI.create(obra);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const nuevaObra: Obra = {
      ...obra,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Obra;
    
    const obras = this.getFromLocalStorage<Obra>('obras', obrasDataJSON as Obra[]);
    obras.push(nuevaObra);
    this.saveToLocalStorage('obras', obras);
    return nuevaObra;
  }

  async updateObra(code: string, updates: Partial<Obra>): Promise<Obra | null> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await obrasAPI.update(code, updates);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const obras = this.getFromLocalStorage<Obra>('obras', obrasDataJSON as Obra[]);
    const index = obras.findIndex(o => o.code === code);
    if (index === -1) return null;
    
    obras[index] = {
      ...obras[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('obras', obras);
    return obras[index];
  }

  async deleteObra(code: string): Promise<boolean> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        await obrasAPI.delete(code);
        return true;
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const obras = this.getFromLocalStorage<Obra>('obras', obrasDataJSON as Obra[]);
    const filtered = obras.filter(o => o.code !== code);
    this.saveToLocalStorage('obras', filtered);
    return filtered.length < obras.length;
  }

  // ==========================================
  // PROVEEDORES
  // ==========================================

  async getProveedores(): Promise<Proveedor[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await proveedoresAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    return this.getFromLocalStorage<Proveedor>('proveedores', proveedoresDataJSON as Proveedor[]);
  }

  async getProveedorById(id: string): Promise<Proveedor | undefined> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await proveedoresAPI.getById(id);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    const proveedores = this.getFromLocalStorage<Proveedor>('proveedores', proveedoresDataJSON as Proveedor[]);
    return proveedores.find(p => p.id === id);
  }

  async createProveedor(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Proveedor> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await proveedoresAPI.create(proveedor);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const nuevoProveedor: Proveedor = {
      ...proveedor,
      id: `PROV-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Proveedor;
    
    const proveedores = this.getFromLocalStorage<Proveedor>('proveedores', proveedoresDataJSON as Proveedor[]);
    proveedores.push(nuevoProveedor);
    this.saveToLocalStorage('proveedores', proveedores);
    return nuevoProveedor;
  }

  async updateProveedor(id: string, updates: Partial<Proveedor>): Promise<Proveedor | null> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await proveedoresAPI.update(id, updates);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const proveedores = this.getFromLocalStorage<Proveedor>('proveedores', proveedoresDataJSON as Proveedor[]);
    const index = proveedores.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    proveedores[index] = {
      ...proveedores[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('proveedores', proveedores);
    return proveedores[index];
  }

  // ==========================================
  // REQUISICIONES
  // ==========================================

  async getRequisiciones(): Promise<Requisicion[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await requisicionesAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    return this.getFromLocalStorage<Requisicion>('requisiciones', requisicionesDataJSON as Requisicion[]);
  }

  async getRequisicionesByObra(obraCode: string): Promise<Requisicion[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await requisicionesAPI.getByObra(obraCode);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    const requisiciones = this.getFromLocalStorage<Requisicion>('requisiciones', requisicionesDataJSON as Requisicion[]);
    return requisiciones.filter(r => r.obraCode === obraCode);
  }

  async createRequisicion(requisicion: Omit<Requisicion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Requisicion> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await requisicionesAPI.create(requisicion);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const nuevaRequisicion: Requisicion = {
      ...requisicion,
      id: `REQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Requisicion;
    
    const requisiciones = this.getFromLocalStorage<Requisicion>('requisiciones', requisicionesDataJSON as Requisicion[]);
    requisiciones.push(nuevaRequisicion);
    this.saveToLocalStorage('requisiciones', requisiciones);
    return nuevaRequisicion;
  }

  async updateRequisicion(id: string, updates: Partial<Requisicion>): Promise<Requisicion | null> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await requisicionesAPI.update(id, updates);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const requisiciones = this.getFromLocalStorage<Requisicion>('requisiciones', requisicionesDataJSON as Requisicion[]);
    const index = requisiciones.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    requisiciones[index] = {
      ...requisiciones[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('requisiciones', requisiciones);
    return requisiciones[index];
  }

  // ==========================================
  // ÓRDENES DE COMPRA
  // ==========================================

  async getOrdenesCompra(): Promise<OrdenCompra[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await ordenesCompraAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    return this.getFromLocalStorage<OrdenCompra>('ordenesCompra', ordenesCompraDataJSON as OrdenCompra[]);
  }

  async getOrdenesCompraByObra(obraCode: string): Promise<OrdenCompra[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await ordenesCompraAPI.getByObra(obraCode);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    const ordenes = this.getFromLocalStorage<OrdenCompra>('ordenesCompra', ordenesCompraDataJSON as OrdenCompra[]);
    return ordenes.filter(oc => oc.obraCode === obraCode);
  }

  async createOrdenCompra(ordenCompra: Omit<OrdenCompra, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrdenCompra> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await ordenesCompraAPI.create(ordenCompra);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const nuevaOC: OrdenCompra = {
      ...ordenCompra,
      id: `OC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as OrdenCompra;
    
    const ordenes = this.getFromLocalStorage<OrdenCompra>('ordenesCompra', ordenesCompraDataJSON as OrdenCompra[]);
    ordenes.push(nuevaOC);
    this.saveToLocalStorage('ordenesCompra', ordenes);
    return nuevaOC;
  }

  async updateOrdenCompra(id: string, updates: Partial<OrdenCompra>): Promise<OrdenCompra | null> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await ordenesCompraAPI.update(id, updates);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const ordenes = this.getFromLocalStorage<OrdenCompra>('ordenesCompra', ordenesCompraDataJSON as OrdenCompra[]);
    const index = ordenes.findIndex(oc => oc.id === id);
    if (index === -1) return null;
    
    ordenes[index] = {
      ...ordenes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('ordenesCompra', ordenes);
    return ordenes[index];
  }

  // ==========================================
  // PAGOS
  // ==========================================

  async getPagos(): Promise<Pago[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await pagosAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    return this.getFromLocalStorage<Pago>('pagos', pagosDataJSON as Pago[]);
  }

  async getPagosByOrdenCompra(ordenCompraId: string): Promise<Pago[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await pagosAPI.getByOrdenCompra(ordenCompraId);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    const pagos = this.getFromLocalStorage<Pago>('pagos', pagosDataJSON as Pago[]);
    return pagos.filter(p => p.ordenCompraId === ordenCompraId);
  }

  async createPago(pago: Omit<Pago, 'id' | 'createdAt'>): Promise<Pago> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await pagosAPI.create(pago);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const nuevoPago: Pago = {
      ...pago,
      id: `PAG-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as Pago;
    
    const pagos = this.getFromLocalStorage<Pago>('pagos', pagosDataJSON as Pago[]);
    pagos.push(nuevoPago);
    this.saveToLocalStorage('pagos', pagos);
    
    // Actualizar estado de OC
    await this.actualizarEstadoOrdenCompra(pago.ordenCompraId);
    
    return nuevoPago;
  }

  private async actualizarEstadoOrdenCompra(ordenCompraId: string) {
    const ordenes = await this.getOrdenesCompra();
    const orden = ordenes.find(oc => oc.id === ordenCompraId);
    if (!orden) return;
    
    const pagos = await this.getPagosByOrdenCompra(ordenCompraId);
    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    
    let nuevoEstado: OrdenCompra['status'];
    if (totalPagado === 0) {
      nuevoEstado = 'Pendiente';
    } else if (totalPagado < orden.total) {
      nuevoEstado = 'Parcial';
    } else {
      nuevoEstado = 'Pagada';
    }
    
    await this.updateOrdenCompra(ordenCompraId, {
      status: nuevoEstado,
      montoPagado: totalPagado,
      saldoPendiente: orden.total - totalPagado,
    });
  }

  // ==========================================
  // DESTAJOS
  // ==========================================

  async getDestajos(): Promise<CargaSemanal[]> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await destajosAPI.getAll();
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    return this.getFromLocalStorage<CargaSemanal>('destajosCargas', destajosDataJSON as CargaSemanal[]);
  }

  async createCargaDestajo(carga: CargaSemanal): Promise<CargaSemanal> {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await destajosAPI.create(carga);
      } catch (error) {
        console.error('Error API, usando modo demo:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo
    const cargas = this.getFromLocalStorage<CargaSemanal>('destajosCargas', destajosDataJSON as CargaSemanal[]);
    cargas.push(carga);
    this.saveToLocalStorage('destajosCargas', cargas);
    return carga;
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  async getEstadisticasGlobales() {
    await this.checkAPIHealth();
    
    if (this.apiAvailable) {
      try {
        return await dashboardAPI.getEstadisticasGlobales();
      } catch (error) {
        console.error('Error API, calculando estadísticas localmente:', error);
        this.apiAvailable = false;
      }
    }
    
    // Modo demo - calcular localmente
    const obras = await this.getObras();
    const ordenes = await this.getOrdenesCompra();
    const pagos = await this.getPagos();
    const requisiciones = await this.getRequisiciones();
    
    const montoTotalOrdenes = ordenes.reduce((sum, oc) => sum + oc.total, 0);
    const montoTotalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    
    return {
      totalObras: obras.length,
      obrasActivas: obras.filter(o => o.status === 'Activa').length,
      totalOrdenes: ordenes.length,
      totalRequisiciones: requisiciones.length,
      totalPagos: pagos.length,
      montoTotalOrdenes,
      montoTotalPagado,
      montoPendientePago: montoTotalOrdenes - montoTotalPagado,
    };
  }

  generarCodigoRequisicion(obraCode: string, residenteIniciales: string): string {
    const requisiciones = this.getFromLocalStorage<Requisicion>('requisiciones', requisicionesDataJSON as Requisicion[]);
    const requisicionesObra = requisiciones.filter(r => r.obraCode === obraCode);
    const numero = requisicionesObra.length + 1;
    return `REQ${obraCode}-${numero}${residenteIniciales}`;
  }

  generarCodigoOC(obraCode: string, compradorIniciales: string, proveedorNombre: string): string {
    const ordenes = this.getFromLocalStorage<OrdenCompra>('ordenesCompra', ordenesCompraDataJSON as OrdenCompra[]);
    const ordenesObra = ordenes.filter(oc => oc.obraCode === obraCode);
    const numero = ordenesObra.length + 1;
    const letra = String.fromCharCode(65 + Math.floor(numero / 100)); // A-Z
    const num = numero % 100;
    const provShort = proveedorNombre.substring(0, 3).toUpperCase();
    return `${obraCode}-${letra}${num}${compradorIniciales}-${provShort}`;
  }
}

// Exportar instancia única
export const db = DatabaseService.getInstance();
export default db;
