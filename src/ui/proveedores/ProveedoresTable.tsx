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

export interface ProveedorRow {
  id: string;
  razonSocial: string;
  rfc: string;
  contactoPrincipal: string | null;
  telefono: string | null;
  tipoProveedor: string | null;
  activo: boolean;
}

interface ProveedoresTableProps {
  proveedores: ProveedorRow[];
  onEdit: (proveedorId: string) => void;
  onDelete: (proveedorId: string) => void;
}

export function ProveedoresTable({ proveedores, onEdit, onDelete }: ProveedoresTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Proveedores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razón Social</TableHead>
              <TableHead>RFC</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow key={proveedor.id}>
                <TableCell className="font-medium">{proveedor.razonSocial}</TableCell>
                <TableCell>{proveedor.rfc}</TableCell>
                <TableCell>{proveedor.contactoPrincipal || "—"}</TableCell>
                <TableCell>{proveedor.telefono || "—"}</TableCell>
                <TableCell>
                  {proveedor.tipoProveedor ? (
                    <Badge variant="secondary" className="capitalize">
                      {proveedor.tipoProveedor}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={proveedor.activo ? "default" : "destructive"}>
                    {proveedor.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(proveedor.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(proveedor.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {proveedores.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay proveedores registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
