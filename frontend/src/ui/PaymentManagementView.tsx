import {
  PaymentManagementStateEmpty,
  PaymentManagementStateError,
  PaymentManagementStateLoading,
} from "@/app/components/payment-management";
import type { PagoDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface PaymentManagementViewProps {
  viewState: ViewState;
  data?: PagoDto[];
  onRetry: () => void;
}

export function PaymentManagementView({ viewState, onRetry }: PaymentManagementViewProps) {
  if (viewState === "loading") return <PaymentManagementStateLoading />;
  if (viewState === "error") return <PaymentManagementStateError onRetry={onRetry} />;
  return <PaymentManagementStateEmpty />;
}
