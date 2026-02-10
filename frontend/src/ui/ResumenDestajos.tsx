/**
 * Componente de Resumen General de Destajos
 * Muestra tablas por obra y tabla consolidada de todos los destajistas
 */

import { Card } from "@/ui/ui/card";
import { Button } from "@/ui/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/ui/table";
import { ArrowUpDown, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface DesatajistaImporte {
  inicial: string;
  nombre: string;
  importe: number;
}

interface ObraResumen {
  nombre: string;
  codigo: string;
  destajistas: DesatajistaImporte[];
}

interface Props {
  obras: ObraResumen[];
  onBack: () => void;
}

export default function ResumenDestajos({ obras, onBack }: Props) {
  const [sortField, setSortField] = useState<"inicial" | "nombre" | "importe">("inicial");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calcular tabla consolidada - sumar importes de todos los destajistas
  const consolidado = obras.reduce((acc, obra) => {
    obra.destajistas.forEach((destajista) => {
      const existing = acc.find((d) => d.inicial === destajista.inicial);
      if (existing) {
        existing.importe += destajista.importe;
      } else {
        acc.push({
          inicial: destajista.inicial,
          nombre: destajista.nombre,
          importe: destajista.importe,
        });
      }
    });
    return acc;
  }, [] as DesatajistaImporte[]);

  // Ordenar tabla consolidada
  const consolidadoOrdenado = [...consolidado].sort((a, b) => {
    let comparison = 0;
    if (sortField === "inicial") {
      comparison = a.inicial.localeCompare(b.inicial);
    } else if (sortField === "nombre") {
      comparison = a.nombre.localeCompare(b.nombre);
    } else {
      comparison = a.importe - b.importe;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: "inicial" | "nombre" | "importe") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  // Calcular estadísticas
  const totalGeneral = consolidadoOrdenado.reduce((sum, d) => sum + d.importe, 0);
  const totalObras = obras.length;
  const totalDestajistas = consolidadoOrdenado.length;
  const promedioDestajista = totalGeneral / totalDestajistas;

  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Obras
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Resumen General de Destajos
        </h2>
        <p className="text-gray-600">
          Desglose de importes por obra y consolidado global de destajistas
        </p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-4">
            <p className="text-sm text-purple-700 font-medium mb-1">Total Obras</p>
            <p className="text-3xl font-bold text-purple-900">{totalObras}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-4">
            <p className="text-sm text-green-700 font-medium mb-1">Total Destajistas</p>
            <p className="text-3xl font-bold text-green-900">{totalDestajistas}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-4">
            <p className="text-sm text-blue-700 font-medium mb-1">Total General</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalGeneral)}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="p-4">
            <p className="text-sm text-amber-700 font-medium mb-1">Promedio por Destajista</p>
            <p className="text-2xl font-bold text-amber-900">{formatCurrency(promedioDestajista)}</p>
          </div>
        </Card>
      </div>

      {/* Tabla Consolidada */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">
              📋 Consolidado Total - Todos los Destajistas
            </h3>
            <div className="text-sm text-blue-700 font-medium">
              Total Destajistas: {consolidadoOrdenado.length}
            </div>
          </div>
          <div className="overflow-auto max-h-[500px] border rounded-lg bg-white">
            <Table>
              <TableHeader className="sticky top-0 bg-blue-600 z-10">
                <TableRow>
                  <TableHead
                    className="text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort("inicial")}
                  >
                    <div className="flex items-center gap-2">
                      Inicial
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="flex items-center gap-2">
                      Destajista
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-white font-bold text-right cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort("importe")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Total Importe
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidadoOrdenado.map((destajista, idx) => (
                  <TableRow
                    key={destajista.inicial}
                    className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  >
                    <TableCell className="font-bold text-blue-900">
                      {destajista.inicial}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {destajista.nombre}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-700">
                      {formatCurrency(destajista.importe)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
            <div className="flex items-center justify-between">
              <span className="text-blue-900 font-bold text-lg">
                TOTAL GENERAL:
              </span>
              <span className="text-blue-900 font-bold text-2xl">
                {formatCurrency(
                  consolidadoOrdenado.reduce((sum, d) => sum + d.importe, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tablas por Obra */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🏗️ Desglose por Obra
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map((obra) => {
            const totalObra = obra.destajistas.reduce(
              (sum, d) => sum + d.importe,
              0
            );

            return (
              <Card
                key={obra.codigo}
                className="overflow-hidden border-2 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700">
                  <h4 className="font-bold text-white text-lg mb-1">
                    {obra.nombre}
                  </h4>
                  <p className="text-teal-100 text-sm">Código: {obra.codigo}</p>
                </div>
                <div className="overflow-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-green-600 z-10">
                      <TableRow>
                        <TableHead className="text-white font-bold text-xs py-2">
                          Inicial
                        </TableHead>
                        <TableHead className="text-white font-bold text-xs py-2">
                          Destajista
                        </TableHead>
                        <TableHead className="text-white font-bold text-xs py-2 text-right">
                          Total Importe
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {obra.destajistas.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-gray-500 py-8"
                          >
                            Sin destajistas asignados
                          </TableCell>
                        </TableRow>
                      ) : (
                        obra.destajistas.map((destajista, idx) => (
                          <TableRow
                            key={`${obra.codigo}-${destajista.inicial}`}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <TableCell className="font-bold text-teal-900 text-sm py-2">
                              {destajista.inicial}
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-2">
                              {destajista.nombre}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-teal-700 text-sm py-2">
                              {formatCurrency(destajista.importe)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-3 bg-green-50 border-t-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-green-900 font-bold text-sm">
                      Total Obra:
                    </span>
                    <span className="text-green-900 font-bold text-lg">
                      {formatCurrency(totalObra)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
