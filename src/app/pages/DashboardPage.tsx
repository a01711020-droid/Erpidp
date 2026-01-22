import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { dataProvider } from "../providers";
import type { Obra, ObraCreate } from "../types/entities";

const defaultForm: ObraCreate = {
  codigo: "",
  nombre: "",
  numeroContrato: "",
  cliente: "",
  residente: "",
  direccion: "",
  montoContratado: 0,
  fechaInicio: "",
  fechaFinProgramada: "",
  plazoEjecucion: 0,
  estado: "activa",
};

export default function DashboardPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ObraCreate>(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchObras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataProvider.listObras({ pageSize: 100 });
      setObras(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  const handleChange = (field: keyof ObraCreate, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = useMemo(() => {
    return (
      formData.codigo &&
      formData.nombre &&
      formData.numeroContrato &&
      formData.cliente &&
      formData.residente &&
      formData.montoContratado > 0 &&
      formData.fechaInicio &&
      formData.fechaFinProgramada &&
      formData.plazoEjecucion > 0
    );
  }, [formData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await dataProvider.createObra(formData);
      setFormData(defaultForm);
      await fetchObras();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear nueva obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange("codigo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroContrato">Número de contrato</Label>
              <Input
                id="numeroContrato"
                value={formData.numeroContrato}
                onChange={(e) => handleChange("numeroContrato", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => handleChange("cliente", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residente">Residente</Label>
              <Input
                id="residente"
                value={formData.residente}
                onChange={(e) => handleChange("residente", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion ?? ""}
                onChange={(e) => handleChange("direccion", e.target.value)}
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
                onChange={(e) => handleChange("montoContratado", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleChange("fechaInicio", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFinProgramada">Fecha fin programada</Label>
              <Input
                id="fechaFinProgramada"
                type="date"
                value={formData.fechaFinProgramada}
                onChange={(e) => handleChange("fechaFinProgramada", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plazoEjecucion">Plazo ejecución (días)</Label>
              <Input
                id="plazoEjecucion"
                type="number"
                min="1"
                value={formData.plazoEjecucion}
                onChange={(e) => handleChange("plazoEjecucion", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={formData.estado}
                onChange={(e) => handleChange("estado", e.target.value as ObraCreate["estado"])}
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
