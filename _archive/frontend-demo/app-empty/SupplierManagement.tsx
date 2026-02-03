/**
 * EMPTY STATE - Gestión de Proveedores
 * Sin proveedores registrados
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import GestionProveedores from "@/app/components/GestionProveedores";
import {
  ArrowLeft,
  Users,
  Plus,
  Building2,
  Phone,
  Mail,
  UserCircle,
  Package,
  TrendingUp,
} from "lucide-react";

interface SupplierManagementEmptyProps {
  onBack: () => void;
}

export default function SupplierManagementEmpty({ onBack }: SupplierManagementEmptyProps) {
  const [showSupplierForm, setShowSupplierForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Regresar a Compras
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Proveedores
                </h1>
                <p className="text-muted-foreground">
                  Administra tu directorio de proveedores y contactos
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowSupplierForm(true)}
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Nuevo Proveedor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Proveedores
                  </p>
                  <p className="text-3xl font-bold text-gray-400">0</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg opacity-50">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    OCs Generadas
                  </p>
                  <p className="text-3xl font-bold text-gray-400">0</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg opacity-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Monto Total
                  </p>
                  <p className="text-3xl font-bold text-gray-400">$0.00</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg opacity-50">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex p-6 bg-green-100 rounded-full mb-6">
                <Users className="h-16 w-16 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No hay proveedores registrados
              </h3>

              <p className="text-gray-600 mb-8">
                Comienza agregando tus proveedores para poder vincularlos con órdenes de compra
                y llevar un control de tus compras.
              </p>

              <Button
                size="lg"
                className="gap-2 bg-green-600 hover:bg-green-700 px-8"
                onClick={() => setShowSupplierForm(true)}
              >
                <Plus className="h-5 w-5" />
                Agregar Primer Proveedor
              </Button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Datos Completos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Registra RFC, razón social, dirección, datos fiscales y más
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                      <UserCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Contactos Directos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Guarda nombre del vendedor, teléfono y correo de contacto
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Vinculación Automática
                      </h4>
                      <p className="text-sm text-gray-600">
                        Vincula proveedores directamente con tus órdenes de compra
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Historial de Compras
                      </h4>
                      <p className="text-sm text-gray-600">
                        Consulta el historial completo de OCs y montos por proveedor
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-left">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Información que puedes registrar:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <Building2 className="h-3 w-3 mr-1" />
                      Proveedor
                    </Badge>
                    <span>Nombre comercial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <Building2 className="h-3 w-3 mr-1" />
                      Razón Social
                    </Badge>
                    <span>Nombre fiscal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <Building2 className="h-3 w-3 mr-1" />
                      RFC
                    </Badge>
                    <span>Registro fiscal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <UserCircle className="h-3 w-3 mr-1" />
                      Vendedor
                    </Badge>
                    <span>Contacto directo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <Phone className="h-3 w-3 mr-1" />
                      Teléfono
                    </Badge>
                    <span>Número de contacto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      <Mail className="h-3 w-3 mr-1" />
                      Correo
                    </Badge>
                    <span>Email de contacto</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Form - Full Component */}
        {showSupplierForm && (
          <GestionProveedores
            isOpen={showSupplierForm}
            onClose={() => setShowSupplierForm(false)}
          />
        )}
      </div>
    </div>
  );
}
