import {
  PaymentManagementStateEmpty,
  PaymentManagementStateError,
  PaymentManagementStateLoading,
} from "@/app/components/payment-management";
import type { PagoDto } from "@/core/types/entities";
import type { ReactNode } from "react";
import type { ViewState } from "./viewState";

interface PaymentManagementViewProps {
  viewState: ViewState;
  data?: PagoDto[];
  onRetry: () => void;
  renderFull: (data: PagoDto[]) => ReactNode;
}

export function PaymentManagementView({ viewState, data = [], onRetry, renderFull }: PaymentManagementViewProps) {
  if (viewState === "loading") return <PaymentManagementStateLoading />;
  if (viewState === "error") return <PaymentManagementStateError onRetry={onRetry} />;
  if (viewState === "empty") return <PaymentManagementStateEmpty />;

  const safeData = Array.isArray(data) ? data : [];
  return <>{renderFull(safeData)}</>;
}
