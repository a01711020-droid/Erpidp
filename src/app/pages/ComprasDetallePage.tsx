import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import type { Obra, OrdenCompra, Proveedor } from "../types/entities";
import { useObra, useOrdenCompra, useProveedor } from "../../core/hooks";

export default function ComprasDetallePage() {
  const { ocId } = useParams<{ ocId: string }>();
  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [obraId, setObraId] = useState<string | null>(null);
  const [proveedorId, setProveedorId] = useState<string | null>(null);
  const { data: ordenData, error: ordenError } = useOrdenCompra(ocId);
  const { data: obra, error: obraError } = useObra(obraId || undefined);
  const { data: proveedor, error: proveedorError } = useProveedor(proveedorId || undefined);

  useEffect(() => {
    if (!ordenData) return;
    setOrden(ordenData);
    setObraId(ordenData.obraId);
    setProveedorId(ordenData.proveedorId);
  }, [ordenData]);

  if (ordenError || obraError || proveedorError) {
    return (
      <p className="text-sm text-red-600">
        {ordenError || obraError || proveedorError}
      </p>
    );
  }

  if (!orden) {
    return <p className="text-sm text-muted-foreground">Cargando orden...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Detalle de OC</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/compras">Volver al listado</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Folio:</strong> {orden.numeroOrden}
          </p>
          <p>
            <strong>Obra:</strong> {obra?.nombre || orden.obraId}
          </p>
          <p>
            <strong>Proveedor:</strong> {proveedor?.razonSocial || orden.proveedorId}
          </p>
          <p>
            <strong>Total:</strong> ${Number(orden.total).toFixed(2)}
          </p>
          <p>
            <strong>Estado:</strong> {orden.estado}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Descripción</th>
                  <th className="py-2">Unidad</th>
                  <th className="py-2">Cantidad</th>
                  <th className="py-2">Precio unitario</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orden.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2">{item.descripcion}</td>
                    <td className="py-2">{item.unidad}</td>
                    <td className="py-2">{item.cantidad}</td>
                    <td className="py-2">${Number(item.precioUnitario).toFixed(2)}</td>
                    <td className="py-2">${Number(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
