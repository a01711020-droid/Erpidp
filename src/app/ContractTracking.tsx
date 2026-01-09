import { ContractHeader } from "./components/ContractHeader";
import { EstimationsTable } from "./components/EstimationsTable";
import { WeeklyExpenses } from "./components/WeeklyExpenses";
import { HardHat } from "lucide-react";

export default function ContractTracking() {
  // Datos del contrato
  const contractInfo = {
    contractNumber: "CONT-2025-078",
    contractAmount: 5800000,
    client: "Gobierno del Estado de México",
    projectName: "Construcción de Centro Educativo Nivel Secundaria",
    startDate: "15 Sep 2025",
    endDate: "15 Jun 2026",
    advancePercentage: 30,
    guaranteeFundPercentage: 10,
  };

  // Datos de estimaciones
  const estimations = [
    {
      no: 1,
      date: "15 Oct 2025",
      description: "Estimación 1 - Trabajos preliminares y cimentación",
      amount: 580000,
      advanceAmortization: 174000,
      guaranteeFund: 58000,
      advanceBalance: 1566000,
      paid: 348000,
      balanceToPay: 0,
      contractPending: 5220000,
    },
    {
      no: 2,
      date: "15 Nov 2025",
      description: "Estimación 2 - Estructura y muros",
      amount: 820000,
      advanceAmortization: 246000,
      guaranteeFund: 82000,
      advanceBalance: 1320000,
      paid: 492000,
      balanceToPay: 0,
      contractPending: 4400000,
    },
    {
      no: 3,
      date: "15 Dic 2025",
      description: "Estimación 3 - Instalaciones hidráulicas y sanitarias",
      amount: 650000,
      advanceAmortization: 195000,
      guaranteeFund: 65000,
      advanceBalance: 1125000,
      paid: 390000,
      balanceToPay: 0,
      contractPending: 3750000,
    },
    {
      no: 4,
      date: "15 Ene 2026",
      description: "Estimación 4 - Instalaciones eléctricas",
      amount: 720000,
      advanceAmortization: 216000,
      guaranteeFund: 72000,
      advanceBalance: 909000,
      paid: 432000,
      balanceToPay: 0,
      contractPending: 3030000,
    },
    {
      no: 5,
      date: "09 Ene 2026",
      description: "Estimación 5 - Acabados generales (En proceso)",
      amount: 890000,
      advanceAmortization: 267000,
      guaranteeFund: 89000,
      advanceBalance: 642000,
      paid: 0,
      balanceToPay: 534000,
      contractPending: 2140000,
    },
  ];

  // Datos de salidas semanales
  const weeklyExpenses = [
    { week: "Semana 1", purchaseOrders: 125000, payroll: 85000, total: 210000 },
    { week: "Semana 2", purchaseOrders: 180000, payroll: 85000, total: 265000 },
    { week: "Semana 3", purchaseOrders: 95000, payroll: 85000, total: 180000 },
    { week: "Semana 4", purchaseOrders: 220000, payroll: 90000, total: 310000 },
    { week: "Semana 5", purchaseOrders: 145000, payroll: 90000, total: 235000 },
    { week: "Semana 6", purchaseOrders: 198000, payroll: 90000, total: 288000 },
    { week: "Semana 7", purchaseOrders: 175000, payroll: 95000, total: 270000 },
    { week: "Semana 8", purchaseOrders: 210000, payroll: 95000, total: 305000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Seguimiento Físico de Contrato</h2>
              <p className="text-sm text-gray-500">Control de obra y flujo financiero</p>
            </div>
          </div>

          {/* Contract Information */}
          <ContractHeader contract={contractInfo} />

          {/* Estimations Table */}
          <EstimationsTable estimations={estimations} />

          {/* Weekly Expenses */}
          <WeeklyExpenses expenses={weeklyExpenses} />
        </div>
      </main>
    </div>
  );
}