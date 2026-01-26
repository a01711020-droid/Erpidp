import { useMemo, useState } from "react";
import { dataProvider } from "../providers";
import type { Pago } from "../types/entities";
import { useOrdenesCompra, usePagos } from "../../core/hooks";
import { PagosListView } from "../../ui/pagos/PagosListView";

export default function PagosListPage() {
  const [selectedOrdenId, setSelectedOrdenId] = useState("");
  const [monto, setMonto] = useState(0);
  const [fecha, setFecha] = useState("");
  const [referencia, setReferencia] = useState("");
  const [metodoPago, setMetodoPago] = useState<Pago["metodoPago"]>("transferencia");
  const [folioFactura, setFolioFactura] = useState("");
  const [montoFactura, setMontoFactura] = useState(0);
  const [fechaFactura, setFechaFactura] = useState("");
  const [diasCredito, setDiasCredito] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    data: ordenes,
    reload: reloadOrdenes,
    error: ordenesError,
    loading: ordenesLoading,
  } = useOrdenesCompra({ pageSize: 200 });
  const {
    data: pagos,
    reload: reloadPagos,
    error: pagosError,
    loading: pagosLoading,
  } = usePagos({ pageSize: 500 });

  const pagosPorOrden = useMemo(() => {
    const map = new Map<string, number>();
    pagos.forEach((pago) => {
      map.set(pago.ordenCompraId, (map.get(pago.ordenCompraId) || 0) + Number(pago.monto || 0));
    });
    return map;
  }, [pagos]);

  const resumen = useMemo(
    () =>
      ordenes.map((orden) => {
        const pagado = pagosPorOrden.get(orden.id) || 0;
        const saldo = Number(orden.total || 0) - pagado;
        return { orden, pagado, saldo };
      }),
    [ordenes, pagosPorOrden]
  );

  const selectedOrden = ordenes.find((orden) => orden.id === selectedOrdenId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrden || !fecha || monto <= 0) return;
    setSaving(true);
    setError(null);
    try {
      const fechaVencimiento =
        fechaFactura && diasCredito > 0
          ? new Date(new Date(fechaFactura).getTime() + diasCredito * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null;
      await dataProvider.createPago({
        obraId: selectedOrden.obraId,
        proveedorId: selectedOrden.proveedorId,
        ordenCompraId: selectedOrden.id,
        monto,
        metodoPago: metodoPago || "transferencia",
        fechaProgramada: fecha,
        referencia: referencia || null,
        folioFactura: folioFactura || null,
        montoFactura: montoFactura || null,
        fechaFactura: fechaFactura || null,
        diasCredito,
        fechaVencimiento,
        observaciones: "Pago registrado desde módulo de pagos",
      });
      setSelectedOrdenId("");
      setMonto(0);
      setFecha("");
      setReferencia("");
      setFolioFactura("");
      setMontoFactura(0);
      setFechaFactura("");
      setDiasCredito(0);
      await Promise.all([reloadOrdenes(), reloadPagos()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PagosListView
      ordenes={ordenes}
      resumen={resumen}
      loading={ordenesLoading || pagosLoading}
      selectedOrdenId={selectedOrdenId}
      monto={monto}
      fecha={fecha}
      referencia={referencia}
      metodoPago={metodoPago}
      folioFactura={folioFactura}
      montoFactura={montoFactura}
      fechaFactura={fechaFactura}
      diasCredito={diasCredito}
      error={error || ordenesError || pagosError}
      saving={saving}
      onChange={(field, value) => {
        if (field === "selectedOrdenId") setSelectedOrdenId(value as string);
        if (field === "monto") setMonto(Number(value));
        if (field === "fecha") setFecha(value as string);
        if (field === "referencia") setReferencia(value as string);
        if (field === "metodoPago") setMetodoPago(value as Pago["metodoPago"]);
        if (field === "folioFactura") setFolioFactura(value as string);
        if (field === "montoFactura") setMontoFactura(Number(value));
        if (field === "fechaFactura") setFechaFactura(value as string);
        if (field === "diasCredito") setDiasCredito(Number(value));
      }}
      onSubmit={handleSubmit}
    />
  );
}
