import { DestajosStateEmpty, DestajosStateError, DestajosStateLoading } from "@/app/components/destajos";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { DestajoSemanaDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface DestajosViewProps {
  viewState: ViewState;
  data?: DestajoSemanaDto[];
  onRetry: () => void;
}

export function DestajosView({ viewState, data, onRetry }: DestajosViewProps) {
  if (viewState === "loading") return <DestajosStateLoading />;
  if (viewState === "error") return <DestajosStateError onRetry={onRetry} />;
  if (viewState === "empty") return <DestajosStateEmpty onCreateDestajo={() => undefined} />;

  return (
    <Card>
      <CardHeader><CardTitle>Captura de destajos</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((week) => (
          <div key={week.id} className="rounded border p-3">
            <p className="font-semibold">{week.semana}</p>
            <p className="text-sm text-slate-500">{week.obra}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
