// Work codes and directory
export const worksDirectory = {
  "227": {
    code: "227",
    name: "CASTELLO E",
    client: "Desarrolladora Inmobiliaria del Centro",
    contractNumber: "CONT-2025-045",
    resident: "Ing. Miguel Ángel Torres",
    residentInitials: "MAT",
  },
  "228": {
    code: "228",
    name: "CASTELLO F",
    client: "Grupo Constructor Metropolitano",
    contractNumber: "CONT-2025-052",
    resident: "Arq. Laura Martínez",
    residentInitials: "LM",
  },
  "229": {
    code: "229",
    name: "CASTELLO G",
    client: "Gobierno del Estado de México",
    contractNumber: "CONT-2025-078",
    resident: "Ing. Roberto Sánchez",
    residentInitials: "RS",
  },
  "230": {
    code: "230",
    name: "CASTELLO H",
    client: "Inversiones Urbanas SA de CV",
    contractNumber: "CONT-2024-089",
    resident: "Ing. Patricia Gómez",
    residentInitials: "PG",
  },
  "231": {
    code: "231",
    name: "DOZA A",
    client: "Constructora Doza SA",
    contractNumber: "CONT-2025-012",
    resident: "Ing. Carlos Ramírez",
    residentInitials: "CR",
  },
  "232": {
    code: "232",
    name: "BALVANERA",
    client: "Desarrollos Balvanera",
    contractNumber: "CONT-2025-023",
    resident: "Arq. Sofia Vargas",
    residentInitials: "SV",
  },
  "233": {
    code: "233",
    name: "DOZA C",
    client: "Constructora Doza SA",
    contractNumber: "CONT-2025-034",
    resident: "Ing. Fernando López",
    residentInitials: "FL",
  },
};

// Suppliers directory
export const suppliersDirectory = {
  CEMEX: {
    fullName: "CEMEX México S.A. de C.V.",
    contact: "Ing. Roberto Martínez - (55) 5555-1234",
  },
  GCC: {
    fullName: "Grupo Cementos de Chihuahua",
    contact: "Lic. María López - (55) 5555-2345",
  },
  LEVINSON: {
    fullName: "Aceros Levinson",
    contact: "Ing. Carlos Pérez - (55) 5555-3456",
  },
  HIERROS: {
    fullName: "Hierros y Materiales SA",
    contact: "Sr. Juan Hernández - (55) 5555-4567",
  },
  INTERCERAMIC: {
    fullName: "Interceramic",
    contact: "Arq. Ana García - (55) 5555-5678",
  },
  MATERIALES: {
    fullName: "Materiales Pérez",
    contact: "Ing. Pedro Ramírez - (55) 5555-6789",
  },
  FERRETERIA: {
    fullName: "Ferretería Industrial del Norte",
    contact: "Sr. Luis González - (55) 5555-7890",
  },
  CONCRETO: {
    fullName: "Distribuidora de Concreto",
    contact: "Ing. Miguel Torres - (55) 5555-8901",
  },
  BEREL: {
    fullName: "Pinturas Berel",
    contact: "Lic. Sofia Vargas - (55) 5555-9012",
  },
  "HOME DEPOT": {
    fullName: "Home Depot México",
    contact: "Atención a Clientes - (55) 5555-0123",
  },
};

// Buyers in purchasing department
export const buyers = [
  { name: "Gabriela Mendoza", initials: "GM" },
  { name: "Ricardo Sánchez", initials: "RS" },
  { name: "Juan Reyes", initials: "JR" },
];

/**
 * Generates the next sequential code for a work
 * Format: [letter][number] where A01-A99, then B01-B99, etc.
 */
export function getNextSequentialCode(lastCode: string): string {
  if (!lastCode) return "A01";

  const letter = lastCode.charAt(0);
  const number = parseInt(lastCode.substring(1), 10);

  if (number < 99) {
    // Increment number
    return `${letter}${String(number + 1).padStart(2, "0")}`;
  } else {
    // Move to next letter
    const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
    return `${nextLetter}01`;
  }
}

/**
 * Generates purchase order number
 * Format: [workCode]-[sequential][buyerInitials]-[supplier]
 * Example: 230-A01JR-CEMEX
 */
export function generatePurchaseOrderNumber(
  workCode: string,
  sequential: string,
  buyerInitials: string,
  supplierCode: string
): string {
  return `${workCode}-${sequential}${buyerInitials}-${supplierCode}`;
}

/**
 * Generates requisition number
 * Format: REQ[workCode]-[number][residentInitials]
 * Example: REQ227-001MAT
 */
export function generateRequisitionNumber(
  workCode: string,
  sequentialNumber: number,
  residentInitials: string
): string {
  const formattedNumber = String(sequentialNumber).padStart(3, "0");
  return `REQ${workCode}-${formattedNumber}${residentInitials}`;
}

/**
 * Get the latest sequential code for a work
 * This would typically query a database, but for now we'll track it in memory
 */
const workSequentials: Record<string, string> = {};

export function getNextSequentialForWork(workCode: string): string {
  const lastSequential = workSequentials[workCode] || "";
  const nextSequential = getNextSequentialCode(lastSequential);
  workSequentials[workCode] = nextSequential;
  return nextSequential;
}

/**
 * Reset sequential for a work (for testing purposes)
 */
export function resetSequentialForWork(workCode: string): void {
  delete workSequentials[workCode];
}

/**
 * Parse purchase order number to extract components
 */
export function parsePurchaseOrderNumber(orderNumber: string): {
  workCode: string;
  sequential: string;
  buyerInitials: string;
  supplier: string;
} | null {
  // Format: 230-A01JR-CEMEX
  const match = orderNumber.match(/^(\d{3})-([A-Z]\d{2})([A-Z]{2,3})-(.+)$/);
  
  if (!match) return null;

  return {
    workCode: match[1],
    sequential: match[2],
    buyerInitials: match[3],
    supplier: match[4],
  };
}

/**
 * Parse requisition number to extract components
 */
export function parseRequisitionNumber(reqNumber: string): {
  workCode: string;
  sequential: number;
  residentInitials: string;
} | null {
  // Format: REQ227-001MAT
  const match = reqNumber.match(/^REQ(\d{3})-(\d{3})([A-Z]{2,3})$/);
  
  if (!match) return null;

  return {
    workCode: match[1],
    sequential: parseInt(match[2], 10),
    residentInitials: match[3],
  };
}
