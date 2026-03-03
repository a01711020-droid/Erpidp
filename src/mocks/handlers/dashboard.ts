/**
 * MSW HANDLERS — Dashboard Métricas
 *
 * Calcula métricas agregadas desde el seed data
 * Espeja lo que haría una vista materializada en PostgreSQL
 */

import { http, HttpResponse, delay } from 'msw';
import { mockDatabase } from '@/spec/mocks/seed';

const BASE = '/api';
const DELAY_MS = 500;

export const dashboardHandlers = [

  // GET /api/dashboard/metricas — KPIs globales
  http.get(`${BASE}/dashboard/metricas`, async () => {
    await delay(DELAY_MS);
    const db = mockDatabase;

    const obrasActivas = db.obras.filter(o => o.estatus === 'activa');
    const presupuestoTotal = obrasActivas.reduce((s, o) => s + o.presupuesto_total, 0);
    const totalComprometido = db.ordenes_compra
      .filter(oc => oc.estatus !== 'cancelada')
      .reduce((s, oc) => s + oc.total, 0);
    const totalPagado = db.pagos
      .filter(p => p.estatus === 'aplicado')
      .reduce((s, p) => s + p.monto_pagado, 0);
    const requisicionesPendientes = db.requisiciones_material
      .filter(r => r.estatus === 'pendiente' || r.estatus === 'en_revision').length;
    const requisicionesUrgentes = db.requisiciones_material
      .filter(r => r.urgencia === 'urgente' && r.estatus !== 'convertida_oc').length;

    return HttpResponse.json({
      data: {
        obras_activas: obrasActivas.length,
        presupuesto_total: presupuestoTotal,
        total_comprometido: totalComprometido,
        total_pagado: totalPagado,
        saldo_disponible: presupuestoTotal - totalComprometido,
        requisiciones_pendientes: requisicionesPendientes,
        requisiciones_urgentes: requisicionesUrgentes,
      },
    });
  }),
];
