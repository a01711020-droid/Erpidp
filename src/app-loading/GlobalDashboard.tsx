/**
 * LOADING STATE - Dashboard Global Empresarial
 * Skeletons animados
 */

import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Building2 } from "lucide-react";

export default function GlobalDashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-700 rounded-xl shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Dashboard Global Empresarial
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  IDP - Inmobiliaria y Desarrollos del Pacífico
                </p>
              </div>
            </div>

            <Skeleton className="h-12 w-40" />
          </div>
        </div>

        {/* Loading Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-9 w-40" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Projects Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-32" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-28" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-32" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-28" />
                    </th>
                    <th className="px-4 py-3 text-right">
                      <Skeleton className="h-4 w-24" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-16 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-full max-w-xs mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-9 w-32 rounded" />
                          <Skeleton className="h-9 w-9 rounded" />
                          <Skeleton className="h-9 w-9 rounded" />
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
