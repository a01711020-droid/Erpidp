import { useMemo, useState } from "react";
import { dataProvider } from "../providers";
import type { ObraCreate } from "../types/entities";
import { useObras } from "../../core/hooks";
import { DashboardPageView } from "../../ui/dashboard/DashboardPageView";

const defaultForm: ObraCreate = {
  codigo: "",
  nombre: "",
  numeroContrato: "",
  cliente: "",
  residente: "",
  residenteIniciales: "",
  direccion: "",
  montoContratado: 0,
  anticipoPorcentaje: 0,
  retencionPorcentaje: 0,
  saldoActual: 0,
  totalEstimaciones: 0,
  totalGastos: 0,
  avanceFisicoPorcentaje: 0,
  fechaInicio: "",
  fechaFinProgramada: "",
  plazoEjecucion: 0,
  estado: "activa",
};

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ObraCreate>(defaultForm);
  const [saving, setSaving] = useState(false);
  const { data: obras, loading, error: loadError, reload } = useObras({ pageSize: 200 });

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
      formData.residenteIniciales &&
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
      await reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageView
      obras={obras}
      loading={loading}
      error={error || loadError}
      formData={formData}
      saving={saving}
      isValid={isValid}
      onChange={handleChange}
      onSubmit={handleSubmit}
      totals={{
        contratos: obras.reduce((sum, obra) => sum + Number(obra.montoContratado || 0), 0),
        saldo: obras.reduce((sum, obra) => sum + Number(obra.saldoActual || 0), 0),
        estimaciones: obras.reduce((sum, obra) => sum + Number(obra.totalEstimaciones || 0), 0),
        gastos: obras.reduce((sum, obra) => sum + Number(obra.totalGastos || 0), 0),
      }}
    />
  );
}
