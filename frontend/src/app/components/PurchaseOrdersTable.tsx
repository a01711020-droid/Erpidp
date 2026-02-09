import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Fragment } from "react";

interface PurchaseOrderItem {
  code: string;
  importe: number;
  montoPago: number;
  balance: number;
}

interface PurchaseOrderGroup {
  proveedor: string;
  items: PurchaseOrderItem[];
  totalImporte: number;
  totalMontoPago: number;
  totalBalance: number;
}

export function PurchaseOrdersTable() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024-01");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [periodData, setPeriodData] = useState<Record<string, PurchaseOrderGroup[]>>({});

  useEffect(() => {
    setPeriodData({});
  }, []);

  const currentData = periodData[selectedPeriod] || [];

  const toggleGroup = (proveedor: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(proveedor)) {
      newExpanded.delete(proveedor);
    } else {
      newExpanded.add(proveedor);
    }
    setExpandedGroups(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Órdenes de Compra</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Meses (Fecha)</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">Enero 2024</SelectItem>
                <SelectItem value="2024-02">Febrero 2024</SelectItem>
                <SelectItem value="2024-03">Marzo 2024</SelectItem>
                <SelectItem value="2024-04">Abril 2024</SelectItem>
                <SelectItem value="2024-05">Mayo 2024</SelectItem>
                <SelectItem value="2024-06">Junio 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Suma de Importe_OC</TableHead>
              <TableHead className="text-right">Suma de Monto_Pago</TableHead>
              <TableHead className="text-right">Suma de Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((group) => (
              <Fragment key={group.proveedor}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleGroup(group.proveedor)}
                >
                  <TableCell>
                    {expandedGroups.has(group.proveedor) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.proveedor}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalImporte)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalMontoPago)}
                  </TableCell>
                  <TableCell className="text-right">
                    {group.totalBalance === 0
                      ? "—"
                      : formatCurrency(group.totalBalance)}
                  </TableCell>
                </TableRow>
                {expandedGroups.has(group.proveedor) &&
                  group.items.map((item) => (
                    <TableRow key={item.code} className="bg-muted/20">
                      <TableCell></TableCell>
                      <TableCell className="pl-8 text-sm">
                        {item.code}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.importe)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.montoPago)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {item.balance === 0 ? "—" : formatCurrency(item.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay datos disponibles para este período
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
