/**
 * EMPTY STATE - Departamento de Compras
 * Sin datos (estado vacío con CTAs)
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PasswordDialog } from "@/app/components/PasswordDialog";
import { PurchaseOrderForm, PurchaseOrder } from "@/app/components/PurchaseOrderForm";
import SupplierManagementEmpty from "./SupplierManagement";
import {
  FileText,
  ShoppingCart,
  ClipboardList,
  Plus,
  PackageOpen,
  Users,
  Inbox,
} from "lucide-react";

interface PurchaseOrderManagementEmptyProps {
  onNavigateToSuppliers?: () => void;
}

export default function PurchaseOrderManagementEmpty({ onNavigateToSuppliers }: PurchaseOrderManagementEmptyProps = {}) {
  const [activeTab, setActiveTab] = useState<"orders" | "requisitions">("orders");
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePasswordSuccess = () => {
    setShowPasswordDialog(false);
    if (onNavigateToSuppliers) {
      onNavigateToSuppliers();
    } else {
      setShowSupplierManagement(true);
    }
  };

  const handleSaveOrder = (order: PurchaseOrder) => {
    console.log("Nueva OC guardada:", order);
    alert(`Orden de Compra #${order.orderNumber} guardada exitosamente. En producción se guardaría en la base de datos.`);
    setShowForm(false);
  };

  // Si está mostrando gestión de proveedores
  if (showSupplierManagement) {
    return (
      <SupplierManagementEmpty onBack={() => setShowSupplierManagement(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-700 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Departamento de Compras
                </h1>
                <p className="text-muted-foreground">
                  Gestión centralizada de órdenes de compra y requisiciones
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowPasswordDialog(true)}
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
              size="lg"
            >
              <Users className="h-5 w-5" />
              Gestión de Proveedores
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b bg-white rounded-t-lg">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold ${
                activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Órdenes de Compra
              <Badge variant="secondary" className="ml-2">
                0
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("requisitions")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold ${
                activeTab === "requisitions"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              Requisiciones Recibidas
              <Badge variant="secondary" className="ml-2">
                0
              </Badge>
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "orders" ? (
          // Empty State - Órdenes de Compra
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="inline-flex p-6 bg-blue-100 rounded-full mb-6">
                  <PackageOpen className="h-16 w-16 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No hay órdenes de compra registradas
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Comienza creando tu primera orden de compra o convierte una requisición
                  pendiente en OC.
                </p>

                <div className="space-y-3">
                  <Button 
                    size="lg"
                    className="w-full gap-2 bg-blue-700 hover:bg-blue-800"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="h-5 w-5" />
                    Crear Primera Orden de Compra
                  </Button>

                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => setActiveTab("requisitions")}
                  >
                    <ClipboardList className="h-5 w-5" />
                    Ver Requisiciones Pendientes
                  </Button>
                </div>

                {/* Beneficios */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    ¿Qué puedes hacer con las OCs?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Generar órdenes de compra en PDF</li>
                    <li>• Vincular con obras y proveedores</li>
                    <li>• Control de entregas y recolecciones</li>
                    <li>• Gestión de descuentos e IVA</li>
                    <li>• Seguimiento de estados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Empty State - Requisiciones
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="inline-flex p-6 bg-purple-100 rounded-full mb-6">
                  <Inbox className="h-16 w-16 text-purple-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No hay requisiciones recibidas
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Las requisiciones de material enviadas por los residentes de obra 
                  aparecerán aquí para su revisión y conversión a órdenes de compra.
                </p>

                <div className="space-y-3">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Ver Órdenes de Compra
                  </Button>
                </div>

                {/* Beneficios */}
                <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg text-left">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    ¿Cómo funcionan las requisiciones?
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Los residentes envían solicitudes de materiales</li>
                    <li>• Recibes notificaciones de requisiciones urgentes</li>
                    <li>• Puedes comunicarte directamente con el residente</li>
                    <li>• Convierte requisiciones en OCs con un clic</li>
                    <li>• Sistema de estados: En Revisión → Comprado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase Order Form Dialog */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-4xl my-8">
              <PurchaseOrderForm 
                onSave={handleSaveOrder}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Password Dialog for Supplier Management */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}