import {
  PurchaseOrderStateEmpty,
  PurchaseOrderStateError,
  PurchaseOrderStateLoading,
} from "@/app/components/purchase-order";
import type { OrdenCompraDto } from "@/core/types/entities";
import type { ReactNode } from "react";
import type { ViewState } from "./viewState";

interface PurchaseOrderManagementViewProps {
  viewState: ViewState;
  data?: OrdenCompraDto[];
  onRetry: () => void;
  renderFull: (data: OrdenCompraDto[]) => ReactNode;
}

export function PurchaseOrderManagementView({ viewState, data = [], onRetry, renderFull }: PurchaseOrderManagementViewProps) {
  if (viewState === "loading") return <PurchaseOrderStateLoading />;
  if (viewState === "error") return <PurchaseOrderStateError onRetry={onRetry} />;
  if (viewState === "empty") return <PurchaseOrderStateEmpty />;
  return <>{renderFull(Array.isArray(data) ? data : [])}</>;
}
