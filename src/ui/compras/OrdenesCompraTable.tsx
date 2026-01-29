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
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface OrdenCompraRow {
  id: string;
  numeroOrden: string;
  obraNombre: string;
  proveedorNombre: string;
  estado: string;
  total: number;
  fechaEntrega: string;
}

interface OrdenesCompraTableProps {
  ordenes: OrdenCompraRow[];
  onEdit: (ordenId: string) => void;
  onDelete: (ordenId: string) => void;
  onPreview: (ordenId: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);

export function OrdenesCompraTable({
  ordenes,
  onEdit,
  onDelete,
  onPreview,
}: OrdenesCompraTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes de Compra</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OC</TableHead>
              <TableHead>Obra</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell className="font-medium">{orden.numeroOrden}</TableCell>
                <TableCell>{orden.obraNombre}</TableCell>
                <TableCell>{orden.proveedorNombre}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {orden.estado}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(orden.total)}</TableCell>
                <TableCell>{orden.fechaEntrega}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onPreview(orden.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(orden.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(orden.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {ordenes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay órdenes de compra registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
