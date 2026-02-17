import {
  PaymentManagementStateEmpty,
  PaymentManagementStateError,
  PaymentManagementStateLoading,
} from "@/app/components/payment-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { PagoDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface PaymentManagementViewProps {
  viewState: ViewState;
  data?: PagoDto[];
  onRetry: () => void;
}

export function PaymentManagementView({ viewState, data, onRetry }: PaymentManagementViewProps) {
  if (viewState === "loading") return <PaymentManagementStateLoading />;
  if (viewState === "error") return <PaymentManagementStateError onRetry={onRetry} />;
  if (viewState === "empty") return <PaymentManagementStateEmpty onCreatePayment={() => undefined} />;

  return (
    <Card>
      <CardHeader><CardTitle>Pagos</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((item) => (
          <div key={item.id} className="rounded border p-3">
            <p className="font-semibold">{item.provider}</p>
            <p className="text-sm text-slate-500">{item.obra} · ${item.monto.toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
