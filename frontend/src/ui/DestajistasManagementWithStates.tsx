/**
 * Wrapper de DestajistasManagement con manejo de estados
 * Cumple con las reglas: Loading, Empty, WithData
 */

import { ViewState } from "@/ui/states";
import {
  DestajistasStateLoading,
  DestajistasStateEmpty,
} from "@/ui/destajistas-management";
import DestajistasManagement from "@/app/DestajistasManagement";

interface Props {
  viewState?: ViewState;
  onBack: () => void;
}

export default function DestajistasManagementWithStates({
  viewState = "data",
  onBack,
}: Props) {
  // Estado Loading
  if (viewState === "loading") {
    return <DestajistasStateLoading onBack={onBack} />;
  }

  // Estado Empty - verificar si hay destajistas (esto vendría de props en producción)
  if (viewState === "empty") {
    return <DestajistasStateEmpty onBack={onBack} />;
  }

  // Estado WithData
  return <DestajistasManagement onBack={onBack} />;
}
