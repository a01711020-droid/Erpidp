import { useMemo, useState } from "react";
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

export interface PurchaseOrderItemRow {
  code: string;
  importe: number;
  montoPago: number;
  balance: number;
}

export interface PurchaseOrderGroup {
  proveedor: string;
  items: PurchaseOrderItemRow[];
  totalImporte: number;
  totalMontoPago: number;
  totalBalance: number;
}

interface PurchaseOrdersTableProps {
  groupsByPeriod: Record<string, PurchaseOrderGroup[]>;
}

export function PurchaseOrdersTable({ groupsByPeriod }: PurchaseOrdersTableProps) {
  const periods = useMemo(() => Object.keys(groupsByPeriod), [groupsByPeriod]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0] || "");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const currentData = groupsByPeriod[selectedPeriod] || [];

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
                <SelectValue placeholder="Selecciona un mes" />
              </SelectTrigger>
              <SelectContent>
                {periods.length === 0 && (
                  <SelectItem value="" disabled>
                    Sin periodos
                  </SelectItem>
                )}
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
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
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No hay órdenes para el periodo seleccionado.
                </TableCell>
              </TableRow>
            )}
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
                  <TableCell className="font-medium">{group.proveedor}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalImporte)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalMontoPago)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalBalance)}
                  </TableCell>
                </TableRow>
                {expandedGroups.has(group.proveedor) &&
                  group.items.map((item) => (
                    <TableRow key={item.code} className="bg-muted/30">
                      <TableCell></TableCell>
                      <TableCell className="pl-8">{item.code}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.importe)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.montoPago)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
