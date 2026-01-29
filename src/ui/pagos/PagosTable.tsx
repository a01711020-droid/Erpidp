import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card";
import { Button } from "../primitives/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../primitives/table";
import { Badge } from "../primitives/badge";
import { Pencil, Trash2 } from "lucide-react";

export interface PagoRow {
  id: string;
  numeroPago: string;
  obraNombre: string;
  proveedorNombre: string;
  ordenCompra: string;
  monto: number;
  estado: string;
  fechaProgramada: string;
}

interface PagosTableProps {
  pagos: PagoRow[];
  onEdit: (pagoId: string) => void;
  onDelete: (pagoId: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);

export function PagosTable({ pagos, onEdit, onDelete }: PagosTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pago</TableHead>
              <TableHead>Obra</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>OC</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Programado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell className="font-medium">{pago.numeroPago}</TableCell>
                <TableCell>{pago.obraNombre}</TableCell>
                <TableCell>{pago.proveedorNombre}</TableCell>
                <TableCell>{pago.ordenCompra}</TableCell>
                <TableCell>{formatCurrency(pago.monto)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {pago.estado}
                  </Badge>
                </TableCell>
                <TableCell>{pago.fechaProgramada}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(pago.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(pago.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pagos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay pagos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
