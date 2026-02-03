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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface DestajoItem {
  id: string;
  proveedor: string;
  concepto: string;
  periodo: string;
  estimado: number;
  montoPagado: number;
  saldo: number;
}

interface DestajosTableProps {
  dataBySemana: Record<string, DestajoItem[]>;
}

export default function DestajosTable({ dataBySemana }: DestajosTableProps) {
  const semanas = useMemo(() => Object.keys(dataBySemana), [dataBySemana]);
  const [selectedWeek, setSelectedWeek] = useState<string>(semanas[0] || "");

  const currentData = dataBySemana[selectedWeek] || [];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Destajos</CardTitle>
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecciona semana" />
            </SelectTrigger>
            <SelectContent>
              {semanas.length === 0 && (
                <SelectItem value="" disabled>
                  Sin semanas
                </SelectItem>
              )}
              {semanas.map((week) => (
                <SelectItem key={week} value={week}>
                  {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Estimado</TableHead>
              <TableHead className="text-right">Pagado</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No hay destajos para la semana seleccionada.
                </TableCell>
              </TableRow>
            )}
            {currentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.proveedor}</TableCell>
                <TableCell>{item.concepto}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.estimado)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.montoPagado)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.saldo)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
