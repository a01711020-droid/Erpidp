import type {
  DestajoSemanaDto,
  ObraDto,
  OrdenCompraDto,
  PagoDto,
  ProveedorDto,
  RequisicionDto,
} from "@/core/types/entities";
import { createEmptyResourceState, type ResourceHookResult } from "./types";

export const useObras = (): ResourceHookResult<ObraDto> => createEmptyResourceState<ObraDto>();
export const useProveedores = (): ResourceHookResult<ProveedorDto> => createEmptyResourceState<ProveedorDto>();
export const useRequisiciones = (): ResourceHookResult<RequisicionDto> => createEmptyResourceState<RequisicionDto>();
export const useOrdenesCompra = (): ResourceHookResult<OrdenCompraDto> => createEmptyResourceState<OrdenCompraDto>();
export const usePagos = (): ResourceHookResult<PagoDto> => createEmptyResourceState<PagoDto>();
export const useDestajos = (): ResourceHookResult<DestajoSemanaDto> => createEmptyResourceState<DestajoSemanaDto>();
