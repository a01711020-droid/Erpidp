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

export interface ObraRow {
  id: string;
  codigo: string;
  nombre: string;
  cliente: string;
  estado: string;
  montoContratado: number;
  fechaInicio: string;
  fechaFinProgramada: string;
}

interface ObrasTableProps {
  obras: ObraRow[];
  onEdit: (obraId: string) => void;
  onDelete: (obraId: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount);

export function ObrasTable({ obras, onEdit, onDelete }: ObrasTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Obras</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin Programado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obras.map((obra) => (
              <TableRow key={obra.id}>
                <TableCell className="font-medium">{obra.codigo}</TableCell>
                <TableCell>{obra.nombre}</TableCell>
                <TableCell>{obra.cliente}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {obra.estado}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(obra.montoContratado)}</TableCell>
                <TableCell>{obra.fechaInicio}</TableCell>
                <TableCell>{obra.fechaFinProgramada}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(obra.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(obra.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {obras.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay obras registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
