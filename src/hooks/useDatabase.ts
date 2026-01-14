/**
 * HOOK PERSONALIZADO PARA USAR LA BASE DE DATOS
 * 
 * Este hook facilita el uso del servicio de base de datos
 * en componentes React, manejando el estado automáticamente.
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/services/database';
import type {
  Obra,
  Requisicion,
  OrdenCompra,
  Pago,
  Proveedor,
  CargaSemanal,
} from '@/types';

/**
 * Hook para obtener todas las obras
 */
export function useObras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = db.getObras();
    setObras(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { obras, loading, reload };
}

/**
 * Hook para obtener una obra específica
 */
export function useObra(code: string) {
  const [obra, setObra] = useState<Obra | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = db.getObraByCode(code);
    setObra(data);
    setLoading(false);
  }, [code]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { obra, loading, reload };
}

/**
 * Hook para obtener requisiciones
 */
export function useRequisiciones(obraCode?: string) {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = obraCode 
      ? db.getRequisicionesByObra(obraCode)
      : db.getRequisiciones();
    setRequisiciones(data);
    setLoading(false);
  }, [obraCode]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { requisiciones, loading, reload };
}

/**
 * Hook para obtener órdenes de compra
 */
export function useOrdenesCompra(obraCode?: string) {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = obraCode 
      ? db.getOrdenesCompraByObra(obraCode)
      : db.getOrdenesCompra();
    setOrdenesCompra(data);
    setLoading(false);
  }, [obraCode]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ordenesCompra, loading, reload };
}

/**
 * Hook para obtener pagos
 */
export function usePagos(ordenCompraId?: string) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = ordenCompraId 
      ? db.getPagosByOrdenCompra(ordenCompraId)
      : db.getPagos();
    setPagos(data);
    setLoading(false);
  }, [ordenCompraId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { pagos, loading, reload };
}

/**
 * Hook para obtener proveedores
 */
export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = db.getProveedores();
    setProveedores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { proveedores, loading, reload };
}

/**
 * Hook para obtener destajos
 */
export function useDestajos() {
  const [destajos, setDestajos] = useState<CargaSemanal[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = db.getDestajos();
    setDestajos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { destajos, loading, reload };
}

/**
 * Hook para obtener estadísticas globales
 */
export function useEstadisticasGlobales() {
  const [stats, setStats] = useState({
    totalObrasActivas: 0,
    totalContratos: 0,
    totalSaldo: 0,
    totalEstimaciones: 0,
    totalGastos: 0,
    totalGastosOCs: 0,
    totalGastosDestajos: 0,
    totalRequisiciones: 0,
    totalOrdenesCompra: 0,
    totalProveedores: 0,
  });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    const data = db.getEstadisticasGlobales();
    setStats(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, loading, reload };
}

/**
 * EJEMPLO DE USO EN COMPONENTE
 * 
 * import { useObras, useRequisiciones } from '@/hooks/useDatabase';
 * 
 * export default function MiComponente() {
 *   const { obras, loading: obrasLoading, reload: reloadObras } = useObras();
 *   const { requisiciones, loading: reqsLoading, reload: reloadReqs } = useRequisiciones('227');
 * 
 *   const handleCrearRequisicion = () => {
 *     db.createRequisicion({...});
 *     reloadReqs(); // Recargar solo requisiciones
 *   };
 * 
 *   if (obrasLoading || reqsLoading) return <div>Cargando...</div>;
 * 
 *   return (
 *     <div>
 *       {obras.map(obra => <div key={obra.code}>{obra.name}</div>)}
 *       {requisiciones.map(req => <div key={req.id}>{req.codigoRequisicion}</div>)}
 *     </div>
 *   );
 * }
 */
