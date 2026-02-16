import {
  PurchaseOrderStateEmpty,
  PurchaseOrderStateError,
  PurchaseOrderStateLoading,
} from "@/app/components/purchase-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { OrdenCompraDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface PurchaseOrderManagementViewProps {
  viewState: ViewState;
  errorMessage?: string;
  data?: OrdenCompraDto[];
  onRetry: () => void;
}

export function PurchaseOrderManagementView({ viewState, data, onRetry }: PurchaseOrderManagementViewProps) {
  if (viewState === "loading") return <PurchaseOrderStateLoading />;
  if (viewState === "error") return <PurchaseOrderStateError onRetry={onRetry} />;
  if (viewState === "empty") return <PurchaseOrderStateEmpty onCreateOrder={() => undefined} />;

  return (
    <Card>
      <CardHeader><CardTitle>Órdenes de compra</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((order) => (
          <div key={order.id} className="rounded border p-3">
            <p className="font-semibold">{order.orderNumber}</p>
            <p className="text-sm text-slate-500">{order.workName} · {order.supplierName}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
