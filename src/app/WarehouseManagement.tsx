/**
 * WAREHOUSE MANAGEMENT (Almacén)
 * 
 * Módulo para el ALMACENISTA:
 * - Registro de órdenes de compra en formato tabla
 * - Expandir para ver materiales y marcar cantidades recibidas
 * - Inventario calculado automáticamente (recibido - enviado)
 */

import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  ArrowLeft,
  Warehouse,
  AlertTriangle,
  Package,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  TruckIcon,
} from "lucide-react";
import { Textarea } from "./components/ui/textarea";

// Tipos
interface OrderMaterial {
  id: string;
  descripcion: string;
  cantidadOrdenada: number;
  unidad: string;
  cantidadRecibida: number;
  cantidadEnviada: number;
  remision?: string;
  fechaRecepcion?: string;
  notas?: string;
}

interface PurchaseOrder {
  id: string; // Formato: 227-A01GM-CEMEX
  workCode: string;
  fechaCompra: string;
  fechaPago?: string;
  materiales: OrderMaterial[];
  expanded: boolean;
}

interface WarehouseManagementProps {
  onBack: () => void;
}

// Mock Data
const initialOrders: PurchaseOrder[] = [
  {
    id: "227-A01GM-CEMEX",
    workCode: "227",
    fechaCompra: "19/1/2025",
    fechaPago: "22/1/2025",
    expanded: false,
    materiales: [
      {
        id: "M001",
        descripcion: "Cemento Gris CPC 30R",
        cantidadOrdenada: 300,
        unidad: "BULTO",
        cantidadRecibida: 300,
        cantidadEnviada: 120,
        remision: "REM-4521",
        fechaRecepcion: "23/1/2025",
        notas: "",
      },
      {
        id: "M002",
        descripcion: "Arena fina de río",
        cantidadOrdenada: 20,
        unidad: "M3",
        cantidadRecibida: 20,
        cantidadEnviada: 8,
        remision: "REM-4521",
        fechaRecepcion: "23/1/2025",
        notas: "",
      },
      {
        id: "M003",
        descripcion: "Grava 3/4\"",
        cantidadOrdenada: 15,
        unidad: "M3",
        cantidadRecibida: 15,
        cantidadEnviada: 15,
        remision: "REM-4522",
        fechaRecepcion: "24/1/2025",
        notas: "",
      },
    ],
  },
  {
    id: "228-A01JR-INTERCERAMIC",
    workCode: "228",
    fechaCompra: "24/1/2025",
    fechaPago: "27/1/2025",
    expanded: false,
    materiales: [
      {
        id: "M004",
        descripcion: "Piso porcelanato 60x60 gris",
        cantidadOrdenada: 150,
        unidad: "M2",
        cantidadRecibida: 150,
        cantidadEnviada: 0,
        remision: "REM-8841",
        fechaRecepcion: "28/1/2025",
        notas: "",
      },
      {
        id: "M005",
        descripcion: "Adhesivo para porcelanato",
        cantidadOrdenada: 50,
        unidad: "BULTO",
        cantidadRecibida: 50,
        cantidadEnviada: 15,
        remision: "REM-8841",
        fechaRecepcion: "28/1/2025",
        notas: "",
      },
    ],
  },
  {
    id: "229-A01GM-BEREL",
    workCode: "229",
    fechaCompra: "17/1/2025",
    fechaPago: "20/1/2025",
    expanded: false,
    materiales: [
      {
        id: "M006",
        descripcion: "Pintura Vinílica Blanco 19L",
        cantidadOrdenada: 30,
        unidad: "CUBETA",
        cantidadRecibida: 20,
        cantidadEnviada: 0,
        remision: "REM-5521",
        fechaRecepcion: "21/1/2025",
        notas: "Recepción parcial. Faltan 10 cubetas.",
      },
      {
        id: "M007",
        descripcion: "Sellador acrílico 19L",
        cantidadOrdenada: 20,
        unidad: "CUBETA",
        cantidadRecibida: 20,
        cantidadEnviada: 8,
        remision: "REM-5521",
        fechaRecepcion: "21/1/2025",
        notas: "",
      },
    ],
  },
  {
    id: "231-A01RS-CEMEX",
    workCode: "231",
    fechaCompra: "27/1/2025",
    fechaPago: "30/1/2025",
    expanded: false,
    materiales: [
      {
        id: "M008",
        descripcion: "Cemento Gris CPC 30R",
        cantidadOrdenada: 200,
        unidad: "BULTO",
        cantidadRecibida: 0,
        cantidadEnviada: 0,
        notas: "Pedido pagado. Pendiente de recibir.",
      },
      {
        id: "M009",
        descripcion: "Arena fina de río",
        cantidadOrdenada: 15,
        unidad: "M3",
        cantidadRecibida: 0,
        cantidadEnviada: 0,
        notas: "Pedido pagado. Pendiente de recibir.",
      },
    ],
  },
  {
    id: "230-A02RS-ACEROS",
    workCode: "230",
    fechaCompra: "3/2/2025",
    fechaPago: "6/2/2025",
    expanded: false,
    materiales: [
      {
        id: "M010",
        descripcion: "Varilla 3/8\" 12m",
        cantidadOrdenada: 200,
        unidad: "PIEZA",
        cantidadRecibida: 150,
        cantidadEnviada: 0,
        remision: "REM-7745",
        fechaRecepcion: "8/2/2025",
        notas: "Recepción parcial. Faltan 50 piezas.",
      },
      {
        id: "M011",
        descripcion: "Alambre recocido calibre 18",
        cantidadOrdenada: 100,
        unidad: "KG",
        cantidadRecibida: 100,
        cantidadEnviada: 30,
        remision: "REM-7746",
        fechaRecepcion: "8/2/2025",
        notas: "",
      },
    ],
  },
];

export default function WarehouseManagement({ onBack }: WarehouseManagementProps) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWork, setSelectedWork] = useState<string>("ALL");

  // Dialogs
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<{
    orderId: string;
    material: OrderMaterial;
  } | null>(null);

  const [receiveForm, setReceiveForm] = useState({
    cantidad: "",
    remision: "",
    notas: "",
  });

  const [sendForm, setSendForm] = useState({
    cantidad: "",
    transportista: "",
    notas: "",
  });

  // Toggle expand
  const toggleOrder = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, expanded: !o.expanded } : o))
    );
  };

  // Marcar recepción
  const handleReceive = () => {
    if (!selectedMaterial) return;
    const cantidad = parseInt(receiveForm.cantidad);

    setOrders(
      orders.map((order) => {
        if (order.id === selectedMaterial.orderId) {
          return {
            ...order,
            materiales: order.materiales.map((mat) =>
              mat.id === selectedMaterial.material.id
                ? {
                    ...mat,
                    cantidadRecibida: mat.cantidadRecibida + cantidad,
                    remision: receiveForm.remision || mat.remision,
                    fechaRecepcion: new Date().toLocaleDateString("es-MX"),
                    notas: receiveForm.notas || mat.notas,
                  }
                : mat
            ),
          };
        }
        return order;
      })
    );

    setShowReceiveDialog(false);
    setSelectedMaterial(null);
    setReceiveForm({ cantidad: "", remision: "", notas: "" });
  };

  // Marcar envío
  const handleSend = () => {
    if (!selectedMaterial) return;
    const cantidad = parseInt(sendForm.cantidad);

    setOrders(
      orders.map((order) => {
        if (order.id === selectedMaterial.orderId) {
          return {
            ...order,
            materiales: order.materiales.map((mat) =>
              mat.id === selectedMaterial.material.id
                ? {
                    ...mat,
                    cantidadEnviada: mat.cantidadEnviada + cantidad,
                    notas: sendForm.notas || mat.notas,
                  }
                : mat
            ),
          };
        }
        return order;
      })
    );

    setShowSendDialog(false);
    setSelectedMaterial(null);
    setSendForm({ cantidad: "", transportista: "", notas: "" });
  };

  // Calcular inventario
  const calcularInventario = () => {
    const inventarioMap = new Map();

    orders.forEach((order) => {
      order.materiales.forEach((mat) => {
        const enBodega = mat.cantidadRecibida - mat.cantidadEnviada;
        if (enBodega > 0) {
          const key = `${mat.descripcion}-${mat.unidad}`;
          if (inventarioMap.has(key)) {
            const existing = inventarioMap.get(key);
            existing.cantidad += enBodega;
            existing.ubicaciones.push({
              oc: order.id,
              cantidad: enBodega,
              fechaRecepcion: mat.fechaRecepcion,
            });
          } else {
            inventarioMap.set(key, {
              descripcion: mat.descripcion,
              unidad: mat.unidad,
              cantidad: enBodega,
              ubicaciones: [
                {
                  oc: order.id,
                  cantidad: enBodega,
                  fechaRecepcion: mat.fechaRecepcion,
                },
              ],
            });
          }
        }
      });
    });

    return Array.from(inventarioMap.values());
  };

  // Alertas
  const materialesPagadosSinRecibir = orders.flatMap((order) =>
    order.materiales
      .filter((mat) => order.fechaPago && mat.cantidadRecibida === 0)
      .map((mat) => ({
        oc: order.id,
        material: mat.descripcion,
        cantidadOrdenada: mat.cantidadOrdenada,
        unidad: mat.unidad,
        fechaPago: order.fechaPago,
      }))
  );

  const recepcionParcial = orders.flatMap((order) =>
    order.materiales
      .filter(
        (mat) =>
          mat.cantidadRecibida > 0 && mat.cantidadRecibida < mat.cantidadOrdenada
      )
      .map((mat) => ({
        oc: order.id,
        material: mat.descripcion,
        cantidadOrdenada: mat.cantidadOrdenada,
        cantidadRecibida: mat.cantidadRecibida,
        faltante: mat.cantidadOrdenada - mat.cantidadRecibida,
        unidad: mat.unidad,
      }))
  );

  // Filtros
  const filteredOrders = orders.filter((order) => {
    const matchesWork = selectedWork === "ALL" || order.workCode === selectedWork;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWork && matchesSearch;
  });

  const inventario = calcularInventario();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-800 border-b-4 border-orange-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <Warehouse className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Almacén Central</h1>
                  <p className="text-orange-100">Control de recepción y envío de materiales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Órdenes Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Materiales en Bodega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{inventario.length}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recepción Parcial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {recepcionParcial.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pagados Sin Recibir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {materialesPagadosSinRecibir.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por OC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedWork} onValueChange={setSelectedWork}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filtrar por obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las Obras</SelectItem>
                  <SelectItem value="227">227 - CASTELLO F</SelectItem>
                  <SelectItem value="228">228 - CASTELLO G</SelectItem>
                  <SelectItem value="229">229 - CASTELLO H</SelectItem>
                  <SelectItem value="230">230 - DOZA A</SelectItem>
                  <SelectItem value="231">231 - DOZA C</SelectItem>
                  <SelectItem value="232">232 - BALVANERA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger value="orders">Registro de Órdenes de Compra</TabsTrigger>
            <TabsTrigger value="inventory">Inventario en Bodega</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          {/* TAB 1: REGISTRO DE ÓRDENES */}
          <TabsContent value="orders">
            <Card className="border-orange-200">
              <CardContent className="p-0">
                {/* Header de tabla */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 border-b font-semibold text-sm text-gray-700">
                  <div className="col-span-3">OC / Fecha</div>
                  <div className="col-span-2">Fecha de Pago</div>
                  <div className="col-span-7 text-right">Acciones</div>
                </div>

                {/* Filas de órdenes */}
                <div className="divide-y">
                  {filteredOrders.map((order) => (
                    <div key={order.id}>
                      {/* Fila principal */}
                      <div className="grid grid-cols-12 gap-4 p-4 hover:bg-orange-50 transition-colors">
                        <div className="col-span-3">
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.fechaCompra}</p>
                        </div>
                        <div className="col-span-2">
                          {order.fechaPago ? (
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                {order.fechaPago}
                              </p>
                              <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                                Pagado
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Pendiente Pago
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-7 flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleOrder(order.id)}
                            className="gap-2"
                          >
                            {order.expanded ? (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Ocultar Materiales
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-4 w-4" />
                                Ver Materiales
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Tabla de materiales expandida */}
                      {order.expanded && (
                        <div className="bg-gray-50 border-t border-b">
                          <div className="p-6">
                            <h4 className="font-semibold text-gray-700 mb-4">Conceptos</h4>

                            {/* Header de tabla de materiales */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
                                <div className="col-span-4">Descripción</div>
                                <div className="col-span-2 text-center">Cantidad</div>
                                <div className="col-span-1 text-center">Unidad</div>
                                <div className="col-span-2 text-center">Cant. Recibida</div>
                                <div className="col-span-3 text-right">Acciones</div>
                              </div>

                              {/* Materiales */}
                              <div className="divide-y">
                                {order.materiales.map((mat) => {
                                  const enBodega = mat.cantidadRecibida - mat.cantidadEnviada;
                                  const faltante = mat.cantidadOrdenada - mat.cantidadRecibida;

                                  return (
                                    <div
                                      key={mat.id}
                                      className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50"
                                    >
                                      <div className="col-span-4">
                                        <p className="text-sm font-medium text-gray-900">
                                          {mat.descripcion}
                                        </p>
                                        {mat.fechaRecepcion && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Recibido: {mat.fechaRecepcion}
                                            {mat.remision && ` • Rem: ${mat.remision}`}
                                          </p>
                                        )}
                                        {mat.notas && (
                                          <p className="text-xs text-amber-700 bg-amber-50 p-1 rounded mt-1">
                                            {mat.notas}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-span-2 text-center">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {mat.cantidadOrdenada}
                                        </p>
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p className="text-sm text-gray-600">{mat.unidad}</p>
                                      </div>
                                      <div className="col-span-2 text-center">
                                        <p
                                          className={`text-sm font-bold ${
                                            mat.cantidadRecibida >= mat.cantidadOrdenada
                                              ? "text-green-700"
                                              : mat.cantidadRecibida > 0
                                              ? "text-amber-700"
                                              : "text-gray-400"
                                          }`}
                                        >
                                          {mat.cantidadRecibida}
                                        </p>
                                        {faltante > 0 && (
                                          <p className="text-xs text-red-600 mt-1">
                                            Faltan: {faltante}
                                          </p>
                                        )}
                                        {enBodega > 0 && (
                                          <p className="text-xs text-blue-600 mt-1">
                                            En bodega: {enBodega}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-span-3 flex items-center justify-end gap-2">
                                        {faltante > 0 && (
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              setSelectedMaterial({
                                                orderId: order.id,
                                                material: mat,
                                              });
                                              setShowReceiveDialog(true);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-xs"
                                          >
                                            Recibir
                                          </Button>
                                        )}
                                        {enBodega > 0 && (
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              setSelectedMaterial({
                                                orderId: order.id,
                                                material: mat,
                                              });
                                              setShowSendDialog(true);
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-xs"
                                          >
                                            Enviar
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: INVENTARIO */}
          <TabsContent value="inventory">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Material en Bodega</CardTitle>
              </CardHeader>
              <CardContent>
                {inventario.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay materiales en bodega</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                      <div className="col-span-6">Descripción</div>
                      <div className="col-span-2 text-center">Cantidad</div>
                      <div className="col-span-1 text-center">Unidad</div>
                      <div className="col-span-3">Ubicaciones</div>
                    </div>

                    {/* Items */}
                    {inventario.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="col-span-6">
                          <p className="font-semibold text-gray-900">{item.descripcion}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-2xl font-bold text-orange-700">
                            {item.cantidad}
                          </p>
                        </div>
                        <div className="col-span-1 text-center">
                          <p className="text-sm text-gray-600">{item.unidad}</p>
                        </div>
                        <div className="col-span-3">
                          {item.ubicaciones.map((ub, ubIdx) => (
                            <div key={ubIdx} className="text-xs text-gray-600 mb-1">
                              <p className="font-medium">{ub.oc}</p>
                              <p>
                                {ub.cantidad} {item.unidad}
                                {ub.fechaRecepcion && ` • ${ub.fechaRecepcion}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: ALERTAS */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pagados Sin Recibir ({materialesPagadosSinRecibir.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {materialesPagadosSinRecibir.length === 0 ? (
                  <p className="text-gray-600">✓ No hay materiales pendientes</p>
                ) : (
                  <div className="space-y-2">
                    {materialesPagadosSinRecibir.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-red-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{item.material}</p>
                            <p className="text-sm text-gray-600">
                              OC: {item.oc} • {item.cantidadOrdenada} {item.unidad}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Pagado: {item.fechaPago}
                            </p>
                          </div>
                          <Badge variant="destructive">URGENTE</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recepción Parcial ({recepcionParcial.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recepcionParcial.length === 0 ? (
                  <p className="text-gray-600">✓ No hay recepciones parciales</p>
                ) : (
                  <div className="space-y-2">
                    {recepcionParcial.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-amber-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{item.material}</p>
                            <p className="text-sm text-gray-600">
                              OC: {item.oc} • Recibido: {item.cantidadRecibida}/
                              {item.cantidadOrdenada} {item.unidad}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-amber-200">
                            Faltan {item.faltante} {item.unidad}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog - Recibir Material */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Material Recibido</DialogTitle>
            <DialogDescription>
              Registre la cantidad de material que acaba de recibir del proveedor
            </DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">{selectedMaterial.material.descripcion}</p>
                <p className="text-sm text-gray-600">
                  Ordenado: {selectedMaterial.material.cantidadOrdenada}{" "}
                  {selectedMaterial.material.unidad}
                </p>
                <p className="text-sm text-red-600">
                  Falta recibir:{" "}
                  {selectedMaterial.material.cantidadOrdenada -
                    selectedMaterial.material.cantidadRecibida}{" "}
                  {selectedMaterial.material.unidad}
                </p>
              </div>

              <div>
                <Label>Cantidad Recibida</Label>
                <Input
                  type="number"
                  value={receiveForm.cantidad}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, cantidad: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Número de Remisión</Label>
                <Input
                  value={receiveForm.remision}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, remision: e.target.value })
                  }
                  placeholder="REM-12345"
                />
              </div>

              <div>
                <Label>Notas</Label>
                <Textarea
                  value={receiveForm.notas}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, notas: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReceiveDialog(false);
                setSelectedMaterial(null);
                setReceiveForm({ cantidad: "", remision: "", notas: "" });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleReceive} className="bg-green-600 hover:bg-green-700">
              Confirmar Recepción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Enviar Material */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Material a Obra</DialogTitle>
            <DialogDescription>
              Registre el material que está enviando desde el almacén hacia la obra
            </DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">{selectedMaterial.material.descripcion}</p>
                <p className="text-sm text-gray-600">
                  Disponible:{" "}
                  {selectedMaterial.material.cantidadRecibida -
                    selectedMaterial.material.cantidadEnviada}{" "}
                  {selectedMaterial.material.unidad}
                </p>
              </div>

              <div>
                <Label>Cantidad a Enviar</Label>
                <Input
                  type="number"
                  value={sendForm.cantidad}
                  onChange={(e) => setSendForm({ ...sendForm, cantidad: e.target.value })}
                />
              </div>

              <div>
                <Label>Transportista</Label>
                <Input
                  value={sendForm.transportista}
                  onChange={(e) =>
                    setSendForm({ ...sendForm, transportista: e.target.value })
                  }
                  placeholder="Nombre del transportista"
                />
              </div>

              <div>
                <Label>Notas</Label>
                <Textarea
                  value={sendForm.notas}
                  onChange={(e) => setSendForm({ ...sendForm, notas: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSendDialog(false);
                setSelectedMaterial(null);
                setSendForm({ cantidad: "", transportista: "", notas: "" });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700">
              <TruckIcon className="h-4 w-4 mr-2" />
              Confirmar Envío
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}