import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";

interface Estimation {
  no: number;
  type?: "estimacion" | "aditiva" | "deductiva";
  date: string;
  description: string;
  amount: number;
  advanceAmortization: number;
  guaranteeFund: number;
  advanceBalance: number;
  paid: number;
  balanceToPay: number;
  contractPending: number;
}

interface EstimationsTableProps {
  estimations: Estimation[];
}

export function EstimationsTable({ estimations }: EstimationsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getTypeInfo = (type?: "estimacion" | "aditiva" | "deductiva") => {
    switch (type) {
      case "aditiva":
        return {
          label: "Aditiva",
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <TrendingUp className="h-3 w-3" />,
        };
      case "deductiva":
        return {
          label: "Deductiva",
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <TrendingDown className="h-3 w-3" />,
        };
      default:
        return {
          label: "Estimación",
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <FileText className="h-3 w-3" />,
        };
    }
  };

  // Calculate totals
  const totals = estimations.reduce(
    (acc, est) => ({
      amount: acc.amount + est.amount,
      advanceAmortization: acc.advanceAmortization + est.advanceAmortization,
      guaranteeFund: acc.guaranteeFund + est.guaranteeFund,
      paid: acc.paid + est.paid,
      balanceToPay: acc.balanceToPay + est.balanceToPay,
    }),
    { amount: 0, advanceAmortization: 0, guaranteeFund: 0, paid: 0, balanceToPay: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos del Contrato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead className="min-w-[100px]">Tipo</TableHead>
                <TableHead className="min-w-[100px]">Fecha</TableHead>
                <TableHead className="min-w-[200px]">Descripción</TableHead>
                <TableHead className="text-right min-w-[120px]">Monto</TableHead>
                <TableHead className="text-right min-w-[120px]">Amort. Anticipo</TableHead>
                <TableHead className="text-right min-w-[120px]">Fondo Garantía</TableHead>
                <TableHead className="text-right min-w-[120px]">Saldo Anticipo</TableHead>
                <TableHead className="text-right min-w-[120px]">Pagado</TableHead>
                <TableHead className="text-right min-w-[130px]">Saldo por Pagar</TableHead>
                <TableHead className="text-right min-w-[140px]">Pendiente Contrato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimations.map((estimation) => {
                const typeInfo = getTypeInfo(estimation.type);
                return (
                  <TableRow key={estimation.no}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{estimation.no}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${typeInfo.color} flex items-center gap-1 w-fit`}>
                        {typeInfo.icon}
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{estimation.date}</TableCell>
                    <TableCell className="text-sm">{estimation.description}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {formatCurrency(estimation.amount)}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {formatCurrency(estimation.advanceAmortization)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(estimation.guaranteeFund)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(estimation.advanceBalance)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(estimation.paid)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-amber-600">
                      {formatCurrency(estimation.balanceToPay)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(estimation.contractPending)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Totals Row */}
              <TableRow className="bg-gray-50 font-bold">
                <TableCell colSpan={4} className="text-right">TOTALES:</TableCell>
                <TableCell className="text-right text-blue-600">
                  {formatCurrency(totals.amount)}
                </TableCell>
                <TableCell className="text-right text-orange-600">
                  {formatCurrency(totals.advanceAmortization)}
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {formatCurrency(totals.guaranteeFund)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(estimations[estimations.length - 1]?.advanceBalance || 0)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(totals.paid)}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatCurrency(totals.balanceToPay)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(estimations[estimations.length - 1]?.contractPending || 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}