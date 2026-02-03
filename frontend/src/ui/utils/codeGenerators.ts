export function generatePurchaseOrderNumber(
  workCode: string,
  sequential: string,
  buyerInitials: string,
  supplierCode: string
): string {
  return `${workCode}-${sequential}${buyerInitials}-${supplierCode}`;
}

export function generateRequisitionNumber(
  workCode: string,
  sequentialNumber: number,
  residentInitials: string
): string {
  const formattedNumber = String(sequentialNumber).padStart(3, "0");
  return `REQ${workCode}-${formattedNumber}${residentInitials}`;
}

export function getNextSequentialCode(lastCode: string): string {
  if (!lastCode) return "A01";

  const letter = lastCode.charAt(0);
  const number = parseInt(lastCode.substring(1), 10);

  if (number < 99) {
    return `${letter}${String(number + 1).padStart(2, "0")}`;
  }

  const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
  return `${nextLetter}01`;
}

export function parsePurchaseOrderNumber(orderNumber: string): {
  workCode: string;
  sequential: string;
  buyerInitials: string;
  supplier: string;
} | null {
  const match = orderNumber.match(/^(\d{3})-([A-Z]\d{2})([A-Z]{2,3})-(.+)$/);

  if (!match) return null;

  return {
    workCode: match[1],
    sequential: match[2],
    buyerInitials: match[3],
    supplier: match[4],
  };
}

export function parseRequisitionNumber(reqNumber: string): {
  workCode: string;
  sequential: number;
  residentInitials: string;
} | null {
  const match = reqNumber.match(/^REQ(\d{3})-(\d{3})([A-Z]{2,3})$/);

  if (!match) return null;

  return {
    workCode: match[1],
    sequential: parseInt(match[2], 10),
    residentInitials: match[3],
  };
}
