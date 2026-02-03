/**
 * LOADING STATE - Requisiciones de Material
 * Skeletons animados
 */

import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Package, Bell } from "lucide-react";

export default function MaterialRequisitionsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Naranja */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 border-b-4 border-orange-800 shadow-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <Skeleton className="h-7 w-56 mb-2 bg-white/20" />
                <Skeleton className="h-5 w-40 bg-white/20" />
              </div>
            </div>
            <Skeleton className="h-9 w-32 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Button */}
        <Skeleton className="h-16 w-full mb-6 rounded-lg" />

        {/* Section Title */}
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Loading Requisition Cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-l-4 border-orange-500 animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>

                {/* Materials */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Skeleton className="h-5 w-24 mb-3" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>

                  {/* Input */}
                  <div className="mt-3 flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
