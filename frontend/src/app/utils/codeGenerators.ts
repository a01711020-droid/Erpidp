export interface WorkDirectoryEntry {
  name: string;
  client: string;
  contractNumber: string;
  resident: string;
}

export interface SupplierDirectoryEntry {
  fullName: string;
  contact: string;
  rfc?: string;
  address?: string;
  phone?: string;
  bank?: string;
  account?: string;
  clabe?: string;
}

export interface BuyerEntry {
  name: string;
  initials: string;
}

// FASE 1 FRONTEND: contrato neutro.
// La lógica real de folios/códigos vive en backend (fases futuras).
export const worksDirectory: Record<string, WorkDirectoryEntry> = {};
export const suppliersDirectory: Record<string, SupplierDirectoryEntry> = {};
export const buyers: BuyerEntry[] = [];

export function getNextSequentialForWork(_workCode: string): number {
  return 0;
}

export function generatePurchaseOrderNumber(
  _workCode: string,
  _sequential: number,
  _buyerInitials: string,
  _supplierCode: string,
): string {
  return "";
}
