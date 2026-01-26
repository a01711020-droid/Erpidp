import { useState } from "react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Switch } from "../primitives/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";
import { X } from "lucide-react";

export interface ProveedorFormValues {
  razonSocial: string;
  aliasProveedor: string;
  nombreComercial: string;
  rfc: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  contactoPrincipal: string;
  banco: string;
  numeroCuenta: string;
  clabe: string;
  tipoProveedor: "material" | "servicio" | "renta" | "mixto" | "";
  creditoDias: number;
  limiteCredito: number;
  activo: boolean;
}

interface ProveedorFormProps {
  onClose: () => void;
  onSave: (values: ProveedorFormValues) => void;
  editProveedor?: ProveedorFormValues | null;
}

export function ProveedorForm({ onClose, onSave, editProveedor }: ProveedorFormProps) {
  const [razonSocial, setRazonSocial] = useState(editProveedor?.razonSocial || "");
  const [aliasProveedor, setAliasProveedor] = useState(editProveedor?.aliasProveedor || "");
  const [nombreComercial, setNombreComercial] = useState(editProveedor?.nombreComercial || "");
  const [rfc, setRfc] = useState(editProveedor?.rfc || "");
  const [direccion, setDireccion] = useState(editProveedor?.direccion || "");
  const [ciudad, setCiudad] = useState(editProveedor?.ciudad || "");
  const [codigoPostal, setCodigoPostal] = useState(editProveedor?.codigoPostal || "");
  const [telefono, setTelefono] = useState(editProveedor?.telefono || "");
  const [email, setEmail] = useState(editProveedor?.email || "");
  const [contactoPrincipal, setContactoPrincipal] = useState(
    editProveedor?.contactoPrincipal || ""
  );
  const [banco, setBanco] = useState(editProveedor?.banco || "");
  const [numeroCuenta, setNumeroCuenta] = useState(editProveedor?.numeroCuenta || "");
  const [clabe, setClabe] = useState(editProveedor?.clabe || "");
  const [tipoProveedor, setTipoProveedor] = useState<ProveedorFormValues["tipoProveedor"]>(
    editProveedor?.tipoProveedor || ""
  );
  const [creditoDias, setCreditoDias] = useState(editProveedor?.creditoDias || 0);
  const [limiteCredito, setLimiteCredito] = useState(editProveedor?.limiteCredito || 0);
  const [activo, setActivo] = useState(editProveedor?.activo ?? true);

  const handleSave = () => {
    onSave({
      razonSocial,
      aliasProveedor,
      nombreComercial,
      rfc,
      direccion,
      ciudad,
      codigoPostal,
      telefono,
      email,
      contactoPrincipal,
      banco,
      numeroCuenta,
      clabe,
      tipoProveedor,
      creditoDias,
      limiteCredito,
      activo,
    });
    onClose();
  };

  const isValid = razonSocial && rfc;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              Información fiscal y de contacto del proveedor
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-emerald-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    placeholder="Materiales del Centro SA de CV"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC *</Label>
                  <Input
                    id="rfc"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    placeholder="MDC991231AB1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alias">Alias / Código corto</Label>
                  <Input
                    id="alias"
                    value={aliasProveedor}
                    onChange={(e) => setAliasProveedor(e.target.value)}
                    placeholder="MATERIALES-CENTRO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreComercial">Nombre Comercial</Label>
                  <Input
                    id="nombreComercial"
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    placeholder="Materiales del Centro"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contacto">Contacto Principal</Label>
                  <Input
                    id="contacto"
                    value={contactoPrincipal}
                    onChange={(e) => setContactoPrincipal(e.target.value)}
                    placeholder="Ing. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="(722) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@proveedor.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Principal 123, Toluca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Toluca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input
                    id="codigoPostal"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información Bancaria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    placeholder="BBVA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
                  <Input
                    id="numeroCuenta"
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clabe">CLABE</Label>
                  <Input
                    id="clabe"
                    value={clabe}
                    onChange={(e) => setClabe(e.target.value)}
                    placeholder="012345678901234567"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Crédito y Tipo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoProveedor">Tipo de Proveedor</Label>
                  <Select
                    value={tipoProveedor}
                    onValueChange={(value) => setTipoProveedor(value as ProveedorFormValues["tipoProveedor"])}
                  >
                    <SelectTrigger id="tipoProveedor">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="servicio">Servicio</SelectItem>
                      <SelectItem value="renta">Renta</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditoDias">Días de Crédito</Label>
                  <Input
                    id="creditoDias"
                    type="number"
                    min="0"
                    step="1"
                    value={creditoDias}
                    onChange={(e) => setCreditoDias(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limiteCredito">Límite de Crédito (MXN)</Label>
                  <Input
                    id="limiteCredito"
                    type="number"
                    min="0"
                    step="0.01"
                    value={limiteCredito}
                    onChange={(e) => setLimiteCredito(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 bg-emerald-50">
              <div>
                <p className="font-medium">Proveedor Activo</p>
                <p className="text-sm text-muted-foreground">
                  Controla si el proveedor puede ser usado en nuevas órdenes de compra.
                </p>
              </div>
              <Switch checked={activo} onCheckedChange={setActivo} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {editProveedor ? "Guardar Cambios" : "Crear Proveedor"}
          </Button>
        </div>
      </div>
    </div>
  );
}
