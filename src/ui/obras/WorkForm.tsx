import { useState } from "react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";
import { X } from "lucide-react";

export interface ObraFormValues {
  codigo: string;
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  residenteIniciales: string;
  direccion: string;
  montoContratado: number;
  anticipoPorcentaje: number;
  retencionPorcentaje: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
}

interface WorkFormProps {
  onClose: () => void;
  onSave: (work: ObraFormValues) => void;
  editWork?: ObraFormValues | null;
}

export function WorkForm({ onClose, onSave, editWork }: WorkFormProps) {
  const [codigo, setCodigo] = useState(editWork?.codigo || "");
  const [nombre, setNombre] = useState(editWork?.nombre || "");
  const [cliente, setCliente] = useState(editWork?.cliente || "");
  const [numeroContrato, setNumeroContrato] = useState(editWork?.numeroContrato || "");
  const [montoContratado, setMontoContratado] = useState(editWork?.montoContratado || 0);
  const [anticipoPorcentaje, setAnticipoPorcentaje] = useState(
    editWork?.anticipoPorcentaje || 0
  );
  const [retencionPorcentaje, setRetencionPorcentaje] = useState(
    editWork?.retencionPorcentaje || 0
  );
  const [fechaInicio, setFechaInicio] = useState(editWork?.fechaInicio || "");
  const [fechaFinProgramada, setFechaFinProgramada] = useState(
    editWork?.fechaFinProgramada || ""
  );
  const [plazoEjecucion, setPlazoEjecucion] = useState(editWork?.plazoEjecucion || 0);
  const [residente, setResidente] = useState(editWork?.residente || "");
  const [residenteIniciales, setResidenteIniciales] = useState(
    editWork?.residenteIniciales || ""
  );
  const [direccion, setDireccion] = useState(editWork?.direccion || "");
  const [estado, setEstado] = useState<ObraFormValues["estado"]>(
    editWork?.estado || "activa"
  );

  const handleSave = () => {
    onSave({
      codigo,
      nombre,
      numeroContrato,
      cliente,
      residente,
      residenteIniciales,
      direccion,
      montoContratado,
      anticipoPorcentaje,
      retencionPorcentaje,
      fechaInicio,
      fechaFinProgramada,
      plazoEjecucion,
      estado,
    });
    onClose();
  };

  const isValid =
    codigo &&
    nombre &&
    cliente &&
    numeroContrato &&
    montoContratado > 0 &&
    fechaInicio &&
    fechaFinProgramada &&
    residente;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editWork ? "Editar Obra" : "Nueva Obra"}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Información general del proyecto de construcción
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-indigo-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Obra *</Label>
                  <Input
                    id="code"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="227"
                    maxLength={6}
                    disabled={!!editWork}
                    className={editWork ? "bg-gray-100" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este código es único e inmutable una vez creado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Obra *</Label>
                  <Input
                    id="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="CASTELLO E"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Input
                    id="client"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Desarrolladora Inmobiliaria del Centro"
                  />
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información del Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractNumber">Número de Contrato *</Label>
                  <Input
                    id="contractNumber"
                    value={numeroContrato}
                    onChange={(e) => setNumeroContrato(e.target.value)}
                    placeholder="CONT-2025-045"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractAmount">Monto del Contrato (MXN) *</Label>
                  <Input
                    id="contractAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoContratado}
                    onChange={(e) => setMontoContratado(parseFloat(e.target.value) || 0)}
                    placeholder="5000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advancePercentage">Anticipo (%)</Label>
                  <Input
                    id="advancePercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={anticipoPorcentaje}
                    onChange={(e) => setAnticipoPorcentaje(parseFloat(e.target.value) || 0)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPercentage">Fondo de Garantía (%)</Label>
                  <Input
                    id="retentionPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={retencionPorcentaje}
                    onChange={(e) => setRetencionPorcentaje(parseFloat(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Cronograma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedEndDate">Fecha Fin Programada *</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={fechaFinProgramada}
                    onChange={(e) => setFechaFinProgramada(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="executionTerm">Plazo de Ejecución (días)</Label>
                  <Input
                    id="executionTerm"
                    type="number"
                    min="0"
                    step="1"
                    value={plazoEjecucion}
                    onChange={(e) => setPlazoEjecucion(parseInt(e.target.value, 10) || 0)}
                    placeholder="180"
                  />
                </div>
              </div>
            </div>

            {/* Resident Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Residente de Obra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resident">Nombre Completo del Residente *</Label>
                  <Input
                    id="resident"
                    value={residente}
                    onChange={(e) => setResidente(e.target.value)}
                    placeholder="Ing. Miguel Ángel Torres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residentInitials">Iniciales del Residente</Label>
                  <Input
                    id="residentInitials"
                    value={residenteIniciales}
                    onChange={(e) => setResidenteIniciales(e.target.value.toUpperCase())}
                    placeholder="MAT"
                    maxLength={4}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usadas para códigos de requisiciones
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección de la Obra</Label>
                  <Input
                    id="address"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Paseo de la Constitución 60, Toluca"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={estado}
                    onValueChange={(value) => setEstado(value as ObraFormValues["estado"])}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="suspendida">Suspendida</SelectItem>
                      <SelectItem value="terminada">Terminada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Resumen</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Código:</span>
                  <span className="ml-2 font-medium">{codigo || "---"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monto:</span>
                  <span className="ml-2 font-medium">
                    ${montoContratado.toLocaleString("es-MX")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Anticipo:</span>
                  <span className="ml-2 font-medium">
                    ${((montoContratado * anticipoPorcentaje) / 100).toLocaleString("es-MX")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fondo:</span>
                  <span className="ml-2 font-medium">
                    ${((montoContratado * retencionPorcentaje) / 100).toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {editWork ? "Guardar Cambios" : "Crear Obra"}
          </Button>
        </div>
      </div>
    </div>
  );
}
