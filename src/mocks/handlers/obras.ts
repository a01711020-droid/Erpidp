/**
 * MSW HANDLERS — Obras
 *
 * Intercepta peticiones HTTP a /api/obras
 * Usa el seed data existente como fuente de verdad
 * Simula comportamiento real del backend FastAPI
 */

import { http, HttpResponse, delay } from 'msw';
import { mockDatabase } from '@/spec/mocks/seed';

const BASE = '/api';
const DELAY_MS = 400; // simula latencia de red

// Base de datos mutable en memoria (se resetea al recargar)
let db = structuredClone(mockDatabase);

export const obrasHandlers = [

  // GET /api/obras — lista con filtros opcionales
  http.get(`${BASE}/obras`, async ({ request }) => {
    await delay(DELAY_MS);
    const url = new URL(request.url);
    const estatus = url.searchParams.get('estatus');

    let obras = db.obras;
    if (estatus) {
      obras = obras.filter(o => o.estatus === estatus);
    }

    return HttpResponse.json({
      data: obras,
      total: obras.length,
    });
  }),

  // GET /api/obras/:id — detalle de una obra
  http.get(`${BASE}/obras/:id`, async ({ params }) => {
    await delay(DELAY_MS);
    const obra = db.obras.find(o => o.obra_id === params.id);
    if (!obra) {
      return HttpResponse.json({ error: 'Obra no encontrada' }, { status: 404 });
    }
    return HttpResponse.json({ data: obra });
  }),

  // POST /api/obras — crear obra
  http.post(`${BASE}/obras`, async ({ request }) => {
    await delay(DELAY_MS);
    const body = await request.json() as Record<string, unknown>;
    const now = new Date().toISOString();
    const nueva = {
      obra_id: `obra_${Date.now()}`,
      codigo_obra: String(body.codigo_obra ?? ''),
      nombre_obra: String(body.nombre_obra ?? ''),
      cliente: String(body.cliente ?? ''),
      residente: body.residente ? String(body.residente) : null,
      direccion: body.direccion ? String(body.direccion) : null,
      fecha_inicio: body.fecha_inicio ? String(body.fecha_inicio) : null,
      fecha_fin_estimada: body.fecha_fin_estimada ? String(body.fecha_fin_estimada) : null,
      presupuesto_total: Number(body.presupuesto_total ?? 0),
      estatus: (body.estatus as 'activa' | 'pausada' | 'terminada' | 'cancelada') ?? 'activa',
      created_at: now,
      updated_at: now,
    };
    db.obras.push(nueva);
    return HttpResponse.json({ data: nueva }, { status: 201 });
  }),

  // PATCH /api/obras/:id — actualizar obra
  http.patch(`${BASE}/obras/:id`, async ({ params, request }) => {
    await delay(DELAY_MS);
    const idx = db.obras.findIndex(o => o.obra_id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ error: 'Obra no encontrada' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    db.obras[idx] = { ...db.obras[idx], ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json({ data: db.obras[idx] });
  }),
];
