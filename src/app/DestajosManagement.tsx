import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import {
  Upload,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  X,
  Download,
  Filter,
  Search,
  ArrowLeft,
} from "lucide-react";
import * as XLSX from "xlsx";

// Interfaces
export interface DestajistaEntry {
  inicial: string;
  nombre: string;
  importe: number;
}

export interface DestajosPorObra {
  codigoObra: string;
  nombreObra: string;
  destajistas: DestajistaEntry[];
  totalObra: number;
}

export interface CargaSemanal {
  id: string;
  fecha: string;
  semana: string;
  obras: DestajosPorObra[];
  totalGeneral: number;
  archivoNombre: string;
}

interface DestajosManagementProps {
  onClose: () => void;
}

export default function DestajosManagement({ onClose }: DestajosManagementProps) {
  const [cargas, setCargas] = useState<CargaSemanal[]>(() => {
    const saved = localStorage.getItem("destajosCargas");
    return saved ? JSON.parse(saved) : [];
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<CargaSemanal | null>(null);
  const [filterObra, setFilterObra] = useState("");
  const [filterDestajista, setFilterDestajista] = useState("");
  const [viewMode, setViewMode] = useState<"historial" | "porObra" | "porDestajista">("historial");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para procesar Excel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      // Procesar datos del Excel
      const obras: DestajosPorObra[] = [];
      let obraActual: DestajosPorObra | null = null;
      let totalGeneral = 0;

      // Mapeo de nombres de obra a códigos
      const obraMapping: { [key: string]: string } = {
        "CASTELLO E": "227",
        "CASTELLO F": "228",
        "CASTELLO G": "229",
        "CASTELLO H": "230",
        "DOZA A": "231",
        "DOZA B": "231B",
        "DOZA C": "233",
        "DOZA D": "231D",
        "BALVANERA": "232",
      };

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const cellText = String(row[0] || "").toUpperCase().trim();

        // Detectar inicio de tabla de obra
        if (Object.keys(obraMapping).some(nombre => cellText.includes(nombre))) {
          // Guardar obra anterior si existe
          if (obraActual && obraActual.destajistas.length > 0) {
            obras.push(obraActual);
          }

          // Encontrar el nombre de la obra
          const nombreObra = Object.keys(obraMapping).find(nombre => cellText.includes(nombre)) || "";
          const codigoObra = obraMapping[nombreObra] || "000";

          obraActual = {
            codigoObra,
            nombreObra,
            destajistas: [],
            totalObra: 0,
          };
          continue;
        }

        // Si estamos dentro de una obra, buscar destajistas
        if (obraActual && row.length >= 3) {
          const inicial = String(row[0] || "").trim();
          const nombre = String(row[1] || "").trim();
          const importeStr = String(row[2] || "").trim();

          // Verificar que sea una fila válida de destajista
          if (inicial && nombre && importeStr && 
              !inicial.toUpperCase().includes("INICIAL") &&
              !inicial.toUpperCase().includes("TOTAL") &&
              inicial.length <= 5) {
            
            // Limpiar y convertir importe
            const importeClean = importeStr.replace(/[^0-9.-]/g, "");
            const importe = parseFloat(importeClean) || 0;

            if (importe > 0) {
              obraActual.destajistas.push({
                inicial,
                nombre,
                importe,
              });
              obraActual.totalObra += importe;
              totalGeneral += importe;
            }
          }
        }
      }

      // Agregar última obra
      if (obraActual && obraActual.destajistas.length > 0) {
        obras.push(obraActual);
      }

      // Crear nueva carga
      const nuevaCarga: CargaSemanal = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        semana: `Semana ${Math.ceil(new Date().getDate() / 7)} - ${new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}`,
        obras,
        totalGeneral,
        archivoNombre: file.name,
      };

      const nuevasCargas = [nuevaCarga, ...cargas];
      setCargas(nuevasCargas);
      localStorage.setItem("destajosCargas", JSON.stringify(nuevasCargas));

      setShowUploadModal(false);
      alert(`✅ Excel procesado correctamente!\n\n${obras.length} obras encontradas\n${obras.reduce((sum, o) => sum + o.destajistas.length, 0)} destajistas registrados\nTotal: $${totalGeneral.toLocaleString()}`);

    } catch (error) {
      console.error("Error al procesar Excel:", error);
      alert("❌ Error al procesar el archivo Excel. Verifica el formato.");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Obtener todos los destajistas únicos
  const getAllDestajistas = () => {
    const destajistasMap = new Map<string, { nombre: string; obras: string[]; total: number }>();

    cargas.forEach(carga => {
      carga.obras.forEach(obra => {
        obra.destajistas.forEach(dest => {
          const key = dest.inicial;
          if (destajistasMap.has(key)) {
            const existing = destajistasMap.get(key)!;
            if (!existing.obras.includes(obra.nombreObra)) {
              existing.obras.push(obra.nombreObra);
            }
            existing.total += dest.importe;
          } else {
            destajistasMap.set(key, {
              nombre: dest.nombre,
              obras: [obra.nombreObra],
              total: dest.importe,
            });
          }
        });
      });
    });

    return Array.from(destajistasMap.entries()).map(([inicial, data]) => ({
      inicial,
      ...data,
    }));
  };

  // Totales por obra
  const getTotalesPorObra = () => {
    const obrasMap = new Map<string, { nombreObra: string; total: number; destajistas: number }>();

    cargas.forEach(carga => {
      carga.obras.forEach(obra => {
        if (obrasMap.has(obra.codigoObra)) {
          const existing = obrasMap.get(obra.codigoObra)!;
          existing.total += obra.totalObra;
          existing.destajistas += obra.destajistas.length;
        } else {
          obrasMap.set(obra.codigoObra, {
            nombreObra: obra.nombreObra,
            total: obra.totalObra,
            destajistas: obra.destajistas.length,
          });
        }
      });
    });

    return Array.from(obrasMap.entries()).map(([codigo, data]) => ({
      codigo,
      ...data,
    }));
  };

  const totalDestajistas = getAllDestajistas();
  const totalesPorObra = getTotalesPorObra();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gestión de Destajos</h2>
                <p className="text-sm text-green-100 mt-1">
                  Control semanal de destajistas por obra
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-green-200">Cargas Registradas</p>
              <p className="text-2xl font-bold">{cargas.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-green-200">Destajistas Únicos</p>
              <p className="text-2xl font-bold">{totalDestajistas.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-green-200">Obras con Destajos</p>
              <p className="text-2xl font-bold">{totalesPorObra.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-green-200">Total Acumulado</p>
              <p className="text-2xl font-bold">
                ${cargas.reduce((sum, c) => sum + c.totalGeneral, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="border-b bg-gray-50 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "historial" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("historial")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Historial
              </Button>
              <Button
                variant={viewMode === "porObra" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("porObra")}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                Por Obra
              </Button>
              <Button
                variant={viewMode === "porDestajista" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("porDestajista")}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Por Destajista
              </Button>
            </div>

            <Button
              onClick={() => setShowUploadModal(true)}
              className="gap-2 bg-green-700 hover:bg-green-800"
            >
              <Upload className="h-4 w-4" />
              Subir Excel
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "historial" && (
            <div className="space-y-4">
              {cargas.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileSpreadsheet className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay cargas registradas
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sube tu primer archivo Excel con los destajos semanales
                  </p>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="gap-2 bg-green-700 hover:bg-green-800"
                  >
                    <Upload className="h-4 w-4" />
                    Subir Excel
                  </Button>
                </Card>
              ) : (
                cargas.map((carga) => (
                  <Card key={carga.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{carga.semana}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Cargado: {new Date(carga.fecha).toLocaleString("es-MX")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            📄 {carga.archivoNombre}
                          </p>
                        </div>
                        <Badge className="bg-green-700 text-white">
                          ${carga.totalGeneral.toLocaleString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm">
                              <strong>{carga.obras.length}</strong> obras
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <span className="text-sm">
                              <strong>
                                {carga.obras.reduce((sum, o) => sum + o.destajistas.length, 0)}
                              </strong>{" "}
                              destajistas
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCarga(selectedCarga?.id === carga.id ? null : carga)}
                          className="w-full"
                        >
                          {selectedCarga?.id === carga.id ? "Ocultar Detalle" : "Ver Detalle"}
                        </Button>

                        {selectedCarga?.id === carga.id && (
                          <div className="mt-4 space-y-3 border-t pt-4">
                            {carga.obras.map((obra) => (
                              <div key={obra.codigoObra} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <Badge variant="outline" className="font-mono mr-2">
                                      {obra.codigoObra}
                                    </Badge>
                                    <span className="font-semibold">{obra.nombreObra}</span>
                                  </div>
                                  <Badge className="bg-green-100 text-green-900">
                                    ${obra.totalObra.toLocaleString()}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  {obra.destajistas.map((dest, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm py-1 px-2 hover:bg-white rounded"
                                    >
                                      <div>
                                        <Badge variant="secondary" className="font-mono text-xs mr-2">
                                          {dest.inicial}
                                        </Badge>
                                        <span>{dest.nombre}</span>
                                      </div>
                                      <span className="font-semibold">${dest.importe.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {viewMode === "porObra" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Totales Acumulados por Obra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {totalesPorObra.map((obra) => (
                      <div
                        key={obra.codigo}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            {obra.codigo}
                          </Badge>
                          <div>
                            <p className="font-semibold">{obra.nombreObra}</p>
                            <p className="text-sm text-muted-foreground">
                              {obra.destajistas} registros de destajistas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-700">
                            ${obra.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === "porDestajista" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Destajistas y Sus Obras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {totalDestajistas
                      .sort((a, b) => b.total - a.total)
                      .map((dest) => (
                        <div
                          key={dest.inicial}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="font-mono">
                                {dest.inicial}
                              </Badge>
                              <p className="font-semibold">{dest.nombre}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {dest.obras.map((obra, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {obra}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-xl font-bold text-green-700">
                              ${dest.total.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dest.obras.length} {dest.obras.length === 1 ? "obra" : "obras"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="bg-gradient-to-r from-green-700 to-green-800 text-white">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir Excel de Destajos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona el archivo Excel con los destajos semanales
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 bg-green-700 hover:bg-green-800"
                >
                  <Upload className="h-4 w-4" />
                  Seleccionar Archivo
                </Button>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Formato requerido:</strong> Excel con tablas por obra conteniendo:
                  Inicial, Destajista, Total Importe
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}