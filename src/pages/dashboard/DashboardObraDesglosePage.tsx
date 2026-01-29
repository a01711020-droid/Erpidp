import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { Button } from "../../ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/primitives/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/primitives/table";
import { useObra, useOrdenesCompraList, usePagosList } from "../../core/hooks";
import type { ListParams } from "../../core/types/entities";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);

export default function DashboardObraDesglosePage() {
  const { obraId } = useParams();
  const navigate = useNavigate();
  const { data: obra, loading: obraLoading, error: obraError } = useObra(obraId);

  const filters: ListParams | undefined = obraId ? { filters: { obraId } } : undefined;
  const {
    data: ordenes,
    loading: ordenesLoading,
    error: ordenesError,
  } = useOrdenesCompraList(filters);
  const {
    data: pagos,
    loading: pagosLoading,
    error: pagosError,
  } = usePagosList(filters);

  if (obraLoading || ordenesLoading || pagosLoading) {
    return <p className="text-sm text-muted-foreground">Cargando desglose...</p>;
  }

  if (obraError || ordenesError || pagosError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{obraError || ordenesError || pagosError}</AlertDescription>
      </Alert>
    );
  }

  if (!obra) {
    return (
      <Alert>
        <AlertTitle>Obra no encontrada</AlertTitle>
        <AlertDescription>No se encontró la obra solicitada.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Desglose de {obra.nombre}</h2>
          <p className="text-sm text-muted-foreground">Detalle de órdenes y pagos.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/dashboard/obras/${obra.id}`)}>
          Volver a métricas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OC</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.map((orden) => (
                <TableRow key={orden.id}>
                  <TableCell className="font-medium">{orden.numeroOrden}</TableCell>
                  <TableCell className="capitalize">{orden.estado}</TableCell>
                  <TableCell>{formatCurrency(orden.total)}</TableCell>
                  <TableCell>{orden.fechaEntrega}</TableCell>
                </TableRow>
              ))}
              {ordenes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay órdenes de compra registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Programado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell className="font-medium">{pago.numeroPago}</TableCell>
                  <TableCell className="capitalize">{pago.estado}</TableCell>
                  <TableCell>{formatCurrency(pago.monto)}</TableCell>
                  <TableCell>{pago.fechaProgramada}</TableCell>
                </TableRow>
              ))}
              {pagos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay pagos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
