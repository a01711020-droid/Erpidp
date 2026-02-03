/**
 * LOADING STATE - Seguimiento Físico de Contrato
 * Skeletons animados
 */

import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

interface ContractTrackingLoadingProps {
  projectId?: string | null;
}

export default function ContractTrackingLoading({ projectId }: ContractTrackingLoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Contract Header */}
        <Card className="mb-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-6 w-20 bg-white/20" />
                  <Skeleton className="h-6 w-32 bg-white/20" />
                </div>
                <Skeleton className="h-9 w-64 mb-2 bg-white/20" />
                <Skeleton className="h-6 w-96 bg-white/20" />
              </div>
              
              <Skeleton className="h-12 w-48 bg-white/20" />
            </div>

            {/* Contract Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
                  <Skeleton className="h-8 w-32 bg-white/20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading Main Table */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <th key={i} className="px-3 py-3 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-8" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gastos Semanales */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gastos Indirectos */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-5 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {i === 4 && <Skeleton className="h-1 w-full mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Desglose Button */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-20 w-full mb-3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
