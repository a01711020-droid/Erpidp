import {
  MaterialRequisitionsStateEmpty,
  MaterialRequisitionsStateError,
  MaterialRequisitionsStateLoading,
} from "@/app/components/material-requisitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { RequisicionDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface MaterialRequisitionsViewProps {
  viewState: ViewState;
  data?: RequisicionDto[];
  onRetry: () => void;
}

export function MaterialRequisitionsView({ viewState, data, onRetry }: MaterialRequisitionsViewProps) {
  if (viewState === "loading") return <MaterialRequisitionsStateLoading />;
  if (viewState === "error") return <MaterialRequisitionsStateError onRetry={onRetry} />;
  if (viewState === "empty") return <MaterialRequisitionsStateEmpty onCreateRequisition={() => undefined} />;

  return (
    <Card>
      <CardHeader><CardTitle>Requisiciones</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((item) => (
          <div key={item.id} className="rounded border p-3">
            <p className="font-semibold">{item.requisitionNumber}</p>
            <p className="text-sm text-slate-500">{item.workName} · {item.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
