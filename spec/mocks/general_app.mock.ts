/**
 * MOCK DATA - OBRA CASTELLO E
 * Datos base para la inicialización del sistema y demos.
 */

import {
  Obra,
  Proveedor,
  Requisicion,
  RequisicionItem,
  OrdenCompra,
  OrdenCompraItem,
  Pago,
  Destajo,
  Usuario
} from "./types";

// ============================================================================
// OBRA PRINCIPAL - CASTELLO E (227)
// ============================================================================

export const OBRA_CASTELLO_E: Obra = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  code: "227",
  name: "CASTELLO E",
  client: "Desarrolladora Inmobiliaria del Centro",
  contractNumber: "CONT-2025-045",
  contractAmount: 5250000,
  advancePercentage: 30,
  retentionPercentage: 5,
  startDate: "2024-11-01T00:00:00.000Z",
  estimatedEndDate: "2025-06-30T00:00:00.000Z",
  resident: "Ing. Miguel Ángel Torres",
  residentInitials: "MAT",
  status: "Activa",
  actualBalance: 1575000,
  totalEstimates: 2100000,
  totalExpenses: 525000,
  createdAt: "2024-10-15T00:00:00.000Z",
  updatedAt: "2025-01-17T00:00:00.000Z",
};

// ============================================================================
// PROVEEDORES
// ============================================================================

export const MOCK_PROVEEDORES: Proveedor[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    code: "PROV-001",
    businessName: "Materiales y Agregados del Norte SA de CV",
    commercialName: "Agregados del Norte",
    rfc: "MAN850320ABC",
    address: "Av. Industrial 456, Parque Industrial",
    city: "Monterrey",
    state: "Nuevo León",
    postalCode: "64000",
    phone: "81-8356-7890",
    email: "ventas@agregatosdelnorte.com.mx",
    contactName: "Lic. Roberto Garza",
    contactPhone: "81-1234-5678",
    creditDays: 30,
    accountNumber: "0123456789",
    bank: "BBVA Bancomer",
    clabe: "012180001234567890",
    status: "Activo",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  // ... (otros proveedores simulados)
];

// ============================================================================
// MOCK DATA EXPORT
// ============================================================================

export const MOCK_DATA = {
  obras: [OBRA_CASTELLO_E],
  proveedores: MOCK_PROVEEDORES,
  // ... estructura base para uso en documentación o seeding manual
};
