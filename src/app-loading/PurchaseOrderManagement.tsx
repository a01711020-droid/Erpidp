/**
 * LOADING STATE - Departamento de Compras
 * Skeletons animados
 */

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { FileText, ShoppingCart, ClipboardList } from "lucide-react";

export default function PurchaseOrderManagementLoading() {
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
            
            <Skeleton className="h-12 w-56" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b bg-white rounded-t-lg">
            <button
              className="flex items-center gap-2 px-6 py-3 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            >
              <ShoppingCart className="h-5 w-5" />
              Órdenes de Compra
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-600"
            >
              <ClipboardList className="h-5 w-5" />
              Requisiciones Recibidas
            </button>
          </div>
        </div>

        {/* Loading Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>

        {/* Loading Table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-32" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-4 py-3 text-right">
                      <Skeleton className="h-4 w-24" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-12 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
