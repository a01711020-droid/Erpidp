import { useMemo, useState } from "react";
import { Button } from "../../ui/primitives/button";
import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";
import { WorkForm, ObraFormValues } from "../../ui/obras/WorkForm";
import { ObrasTable } from "../../ui/obras/ObrasTable";
import FieldErrorsAlert from "../shared/FieldErrorsAlert";
import {
  useCreateObra,
  useDeleteObra,
  useObrasList,
  useUpdateObra,
} from "../../core/hooks";
import type { Obra, ObraCreate } from "../../core/types/entities";
import { Plus } from "lucide-react";

const toFormValues = (obra: Obra): ObraFormValues => ({
  codigo: obra.codigo,
  nombre: obra.nombre,
  numeroContrato: obra.numeroContrato,
  cliente: obra.cliente,
  residente: obra.residente,
  residenteIniciales: obra.residenteIniciales || "",
  direccion: obra.direccion || "",
  montoContratado: obra.montoContratado,
  anticipoPorcentaje: obra.anticipoPorcentaje,
  retencionPorcentaje: obra.retencionPorcentaje,
  fechaInicio: obra.fechaInicio,
  fechaFinProgramada: obra.fechaFinProgramada,
  plazoEjecucion: obra.plazoEjecucion,
  estado: obra.estado,
});

const toCreatePayload = (values: ObraFormValues): ObraCreate => ({
  codigo: values.codigo,
  nombre: values.nombre,
  numeroContrato: values.numeroContrato,
  cliente: values.cliente,
  residente: values.residente,
  residenteIniciales: values.residenteIniciales || null,
  direccion: values.direccion || null,
  montoContratado: values.montoContratado,
  anticipoPorcentaje: values.anticipoPorcentaje,
  retencionPorcentaje: values.retencionPorcentaje,
  fechaInicio: values.fechaInicio,
  fechaFinProgramada: values.fechaFinProgramada,
  plazoEjecucion: values.plazoEjecucion,
  estado: values.estado,
});

export default function ObrasCatalogoPage() {
  const { data: obras, loading, error } = useObrasList();
  const createObra = useCreateObra();
  const updateObra = useUpdateObra();
  const deleteObra = useDeleteObra();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingObra = useMemo(
    () => (editingId ? obras.find((obra) => obra.id === editingId) || null : null),
    [editingId, obras]
  );

  const handleCreateClick = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (obraId: string) => {
    setEditingId(obraId);
    setIsFormOpen(true);
  };

  const handleDelete = async (obraId: string) => {
    if (confirm("¿Eliminar esta obra?")) {
      await deleteObra.mutate(obraId);
    }
  };

  const handleSave = async (values: ObraFormValues) => {
    const payload = toCreatePayload(values);
    if (editingId) {
      await updateObra.mutate({ id: editingId, data: payload });
    } else {
      await createObra.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Obras</h2>
          <p className="text-sm text-muted-foreground">
            Administra el catálogo de obras y su información contractual.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nueva Obra
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldErrorsAlert title="Errores de validación" fieldErrors={createObra.fieldErrors} />
      <FieldErrorsAlert title="Errores de validación" fieldErrors={updateObra.fieldErrors} />

      {createObra.error && !createObra.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{createObra.error}</AlertDescription>
        </Alert>
      )}

      {updateObra.error && !updateObra.fieldErrors && (
        <Alert variant="destructive">
          <AlertTitle>Error al actualizar</AlertTitle>
          <AlertDescription>{updateObra.error}</AlertDescription>
        </Alert>
      )}

      {deleteObra.error && (
        <Alert variant="destructive">
          <AlertTitle>Error al eliminar</AlertTitle>
          <AlertDescription>{deleteObra.error}</AlertDescription>
        </Alert>
      )}

      <ObrasTable
        obras={obras.map((obra) => ({
          id: obra.id,
          codigo: obra.codigo,
          nombre: obra.nombre,
          cliente: obra.cliente,
          estado: obra.estado,
          montoContratado: obra.montoContratado,
          fechaInicio: obra.fechaInicio,
          fechaFinProgramada: obra.fechaFinProgramada,
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {loading && <p className="text-sm text-muted-foreground">Cargando obras...</p>}

      {isFormOpen && (
        <WorkForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editWork={editingObra ? toFormValues(editingObra) : null}
        />
      )}
    </div>
  );
}
