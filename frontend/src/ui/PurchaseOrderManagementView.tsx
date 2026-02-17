import {
  PurchaseOrderStateEmpty,
  PurchaseOrderStateError,
  PurchaseOrderStateLoading,
} from "@/app/components/purchase-order";
import type { OrdenCompraDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface PurchaseOrderManagementViewProps {
  viewState: ViewState;
  data?: OrdenCompraDto[];
  onRetry: () => void;
}

export function PurchaseOrderManagementView({ viewState, onRetry }: PurchaseOrderManagementViewProps) {
  if (viewState === "loading") return <PurchaseOrderStateLoading />;
  if (viewState === "error") return <PurchaseOrderStateError onRetry={onRetry} />;
  return <PurchaseOrderStateEmpty />;
}
