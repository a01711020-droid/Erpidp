import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import type { Obra, ObraCreate } from "../../core/types/entities";

interface DashboardPageViewProps {
  obras: Obra[];
  loading: boolean;
  error: string | null;
  formData: ObraCreate;
  saving: boolean;
  isValid: boolean;
  onChange: (field: keyof ObraCreate, value: string | number) => void;
  onSubmit: (event: FormEvent) => void;
  totals: {
    contratos: number;
    saldo: number;
    estimaciones: number;
    gastos: number;
  };
}

export function DashboardPageView({
  obras,
  loading,
  error,
  formData,
  saving,
  onChange,
  onSubmit,
  totals,
}: DashboardPageViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen ejecutivo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Monto contratado</p>
            <p className="text-lg font-semibold">${totals.contratos.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo actual</p>
            <p className="text-lg font-semibold">${totals.saldo.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimaciones</p>
            <p className="text-lg font-semibold">${totals.estimaciones.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gastos</p>
            <p className="text-lg font-semibold">${totals.gastos.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrar obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => onChange("codigo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroContrato">Número de contrato</Label>
              <Input
                id="numeroContrato"
                value={formData.numeroContrato}
                onChange={(e) => onChange("numeroContrato", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => onChange("cliente", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residente">Residente</Label>
              <Input
                id="residente"
                value={formData.residente}
                onChange={(e) => onChange("residente", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residenteIniciales">Iniciales residente</Label>
              <Input
                id="residenteIniciales"
                value={formData.residenteIniciales ?? ""}
                onChange={(e) => onChange("residenteIniciales", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion ?? ""}
                onChange={(e) => onChange("direccion", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montoContratado">Monto contratado</Label>
              <Input
                id="montoContratado"
                type="number"
                min="0"
                step="0.01"
                value={formData.montoContratado}
                onChange={(e) => onChange("montoContratado", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anticipoPorcentaje">Anticipo (%)</Label>
              <Input
                id="anticipoPorcentaje"
                type="number"
                min="0"
                step="0.01"
                value={formData.anticipoPorcentaje ?? 0}
                onChange={(e) => onChange("anticipoPorcentaje", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retencionPorcentaje">Retención (%)</Label>
              <Input
                id="retencionPorcentaje"
                type="number"
                min="0"
                step="0.01"
                value={formData.retencionPorcentaje ?? 0}
                onChange={(e) => onChange("retencionPorcentaje", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saldoActual">Saldo actual</Label>
              <Input
                id="saldoActual"
                type="number"
                min="0"
                step="0.01"
                value={formData.saldoActual ?? 0}
                onChange={(e) => onChange("saldoActual", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalEstimaciones">Total estimaciones</Label>
              <Input
                id="totalEstimaciones"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalEstimaciones ?? 0}
                onChange={(e) => onChange("totalEstimaciones", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalGastos">Total gastos</Label>
              <Input
                id="totalGastos"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalGastos ?? 0}
                onChange={(e) => onChange("totalGastos", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avanceFisico">Avance físico (%)</Label>
              <Input
                id="avanceFisico"
                type="number"
                min="0"
                step="0.01"
                value={formData.avanceFisicoPorcentaje ?? 0}
                onChange={(e) => onChange("avanceFisicoPorcentaje", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => onChange("fechaInicio", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFinProgramada">Fecha fin programada</Label>
              <Input
                id="fechaFinProgramada"
                type="date"
                value={formData.fechaFinProgramada}
                onChange={(e) => onChange("fechaFinProgramada", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plazoEjecucion">Plazo ejecución (días)</Label>
              <Input
                id="plazoEjecucion"
                type="number"
                min="1"
                value={formData.plazoEjecucion}
                onChange={(e) => onChange("plazoEjecucion", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={formData.estado}
                onChange={(e) => onChange("estado", e.target.value as ObraCreate["estado"])}
              >
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="terminada">Terminada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={!isValid || saving}>
                {saving ? "Guardando..." : "Crear obra"}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Obras registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando obras...</p>
          ) : obras.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay obras registradas aún. Crea la primera obra para comenzar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Código</th>
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra) => (
                    <tr key={obra.id} className="border-t">
                      <td className="py-2">{obra.codigo}</td>
                      <td className="py-2">{obra.nombre}</td>
                      <td className="py-2">{obra.cliente}</td>
                      <td className="py-2 capitalize">{obra.estado}</td>
                      <td className="py-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/obras/${obra.id}`}>Ver detalle</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
