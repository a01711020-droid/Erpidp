export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 3);
}

export function getSupplierCode(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 6);
}

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
