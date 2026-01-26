import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export interface EstimationFormData {
  movementNumber: number;
  type: "estimacion" | "aditiva" | "deductiva";
  date: string;
  description: string;
  amount: number;
  advanceAmortization: number;
  guaranteeFund: number;
  paid: number;
  balanceToPay: number;
}

interface EstimationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EstimationFormData) => void;
  contractInfo: {
    contractAmount: number;
    advancePercentage: number;
    guaranteeFundPercentage: number;
  };
  lastEstimation?: {
    no: number;
    advanceBalance: number;
    contractPending: number;
  };
}

export function EstimationForm({
  isOpen,
  onClose,
  onSave,
  contractInfo,
  lastEstimation,
}: EstimationFormProps) {
  const [formData, setFormData] = useState<EstimationFormData>({
    movementNumber: (lastEstimation?.no || 0) + 1,
    type: "estimacion",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    advanceAmortization: 0,
    guaranteeFund: 0,
    paid: 0,
    balanceToPay: 0,
  });

  // Calcular automáticamente los valores
  const calculateValues = (amount: number) => {
    const advanceAmortization = (amount * contractInfo.advancePercentage) / 100;
    const guaranteeFund = (amount * contractInfo.guaranteeFundPercentage) / 100;
    const balanceToPay = amount - advanceAmortization - guaranteeFund;
    
    return {
      advanceAmortization,
      guaranteeFund,
      balanceToPay,
    };
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const calculated = calculateValues(amount);
    
    setFormData({
      ...formData,
      amount,
      ...calculated,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      movementNumber: (lastEstimation?.no || 0) + 1,
      type: "estimacion",
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
      advanceAmortization: 0,
      guaranteeFund: 0,
      paid: 0,
      balanceToPay: 0,
    });
  };

  const getTypeIcon = () => {
    switch (formData.type) {
      case "aditiva":
        return <TrendingUp className="h-6 w-6 text-green-600" />;
      case "deductiva":
        return <TrendingDown className="h-6 w-6 text-red-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (formData.type) {
      case "aditiva":
        return "Aditiva";
      case "deductiva":
        return "Deductiva";
      default:
        return "Estimación";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {getTypeIcon()}
            Nuevo Movimiento del Contrato #{formData.movementNumber}
          </DialogTitle>
          <DialogDescription>
            Registra un nuevo movimiento del contrato (estimación, aditiva o deductiva)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimiento</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "estimacion" | "aditiva" | "deductiva") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estimacion">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>Estimación</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="aditiva">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Aditiva</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="deductiva">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span>Deductiva</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movementNumber">Número de Movimiento</Label>
              <Input
                id="movementNumber"
                type="number"
                value={formData.movementNumber}
                onChange={(e) => setFormData({ ...formData, movementNumber: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder={`Ej: ${getTypeLabel()} - Descripción del movimiento`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={2}
            />
          </div>

          {/* Monto del movimiento */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto del Movimiento</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Cálculos automáticos */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Cálculos Automáticos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-700 mb-1">Amortización Anticipo ({contractInfo.advancePercentage}%)</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.advanceAmortization.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Fondo de Garantía ({contractInfo.guaranteeFundPercentage}%)</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.guaranteeFund.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Saldo a Pagar</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.balanceToPay.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resumen del movimiento */}
          <Card 
            className={`border-2 ${
              formData.type === "aditiva" 
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300" 
                : formData.type === "deductiva"
                ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon()}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo de Movimiento</p>
                    <p className="text-xl font-bold">{getTypeLabel()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Monto Total</p>
                  <p className="text-2xl font-bold">
                    ${formData.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={
                formData.type === "aditiva"
                  ? "bg-green-600 hover:bg-green-700"
                  : formData.type === "deductiva"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {getTypeIcon()}
              <span className="ml-2">Guardar Movimiento</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}