/**
 * LOADING STATE - Módulo de Pagos
 * Skeletons animados
 */

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { DollarSign } from "lucide-react";

export default function PaymentManagementLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Módulo de Pagos
              </h1>
              <p className="text-muted-foreground">
                Control de pagos a proveedores y gestión de facturas
              </p>
            </div>
          </div>
        </div>

        {/* Loading Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-40" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>

        {/* Loading Table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-96" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
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
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-4 py-4">
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full rounded-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-8 w-20 rounded" />
                          <Skeleton className="h-8 w-24 rounded" />
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
