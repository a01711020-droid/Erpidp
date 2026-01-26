import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { dataProvider } from "../providers";
import type { BankTransaction, BankTransactionCreate, OrdenCompra } from "../types/entities";
import { useBankTransactions, useOrdenesCompra } from "../../core/hooks";

const parseCsv = (content: string): BankTransactionCreate[] => {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const [header, ...rows] = lines;
  const hasHeader = header.toLowerCase().includes("fecha");
  const dataRows = hasHeader ? rows : lines;
  return dataRows.map((row) => {
    const [fecha, descripcionBanco, monto, referenciaBancaria] = row.split(",");
    return {
      fecha: fecha?.trim(),
      descripcionBanco: descripcionBanco?.trim() || "",
      monto: Number(monto),
      referenciaBancaria: referenciaBancaria?.trim() || null,
      origen: "csv",
    };
  });
};

export default function PagosConciliacionPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [manualSelections, setManualSelections] = useState<Record<string, string>>({});
  const {
    data: transactions,
    error: transactionsError,
    reload: reloadTransactions,
    loading: transactionsLoading,
  } = useBankTransactions();
  const {
    data: ordenes,
    error: ordenesError,
    reload: reloadOrdenes,
    loading: ordenesLoading,
  } = useOrdenesCompra({ pageSize: 500 });

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const content = await file.text();
      const items = parseCsv(content).filter((item) => item.fecha && item.descripcionBanco);
      if (items.length === 0) {
        throw new Error("El CSV no contiene filas válidas.");
      }
      await dataProvider.importBankTransactions(items);
      await Promise.all([reloadTransactions(), reloadOrdenes()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const unmatched = transactions.filter((tx) => !tx.matched);

  const autoMatches = useMemo(() => {
    return unmatched
      .map((tx) => {
        const match = ordenes.find((oc) =>
          tx.descripcionBanco.toLowerCase().includes(oc.numeroOrden.toLowerCase())
        );
        return match ? { tx, oc: match } : null;
      })
      .filter(Boolean) as { tx: BankTransaction; oc: OrdenCompra }[];
  }, [unmatched, ordenes]);

  const handleAutoMatch = async () => {
    setMatching(true);
    setError(null);
    try {
      for (const { tx, oc } of autoMatches) {
        await dataProvider.matchBankTransaction(tx.id, {
          ordenCompraId: oc.id,
          matchConfidence: 100,
          matchManual: false,
        });
        await dataProvider.createPago({
          obraId: oc.obraId,
          proveedorId: oc.proveedorId,
          ordenCompraId: oc.id,
          monto: Number(tx.monto),
          metodoPago: "transferencia",
          fechaProgramada: tx.fecha,
          referencia: tx.referenciaBancaria ?? null,
          observaciones: tx.descripcionBanco,
        });
      }
        await Promise.all([reloadTransactions(), reloadOrdenes()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setMatching(false);
    }
  };

  const handleManualMatch = async (tx: BankTransaction) => {
    const ordenId = manualSelections[tx.id];
    if (!ordenId) return;
    const oc = ordenes.find((item) => item.id === ordenId);
    if (!oc) return;
    setMatching(true);
    setError(null);
    try {
      await dataProvider.matchBankTransaction(tx.id, {
        ordenCompraId: oc.id,
        matchConfidence: 0,
        matchManual: true,
      });
      await dataProvider.createPago({
        obraId: oc.obraId,
        proveedorId: oc.proveedorId,
        ordenCompraId: oc.id,
        monto: Number(tx.monto),
        metodoPago: "transferencia",
        fechaProgramada: tx.fecha,
        referencia: tx.referenciaBancaria ?? null,
        observaciones: tx.descripcionBanco,
      });
      await Promise.all([reloadTransactions(), reloadOrdenes()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Conciliación bancaria</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/pagos">Volver a pagos</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input type="file" accept=".csv" onChange={handleFile} />
          <p className="text-sm text-muted-foreground">
            Formato esperado: fecha, descripcion, monto, referencia (con encabezados opcionales).
          </p>
          {(loading || transactionsLoading || ordenesLoading) && (
            <p className="text-sm text-muted-foreground">Procesando CSV...</p>
          )}
          {(error || transactionsError || ordenesError) && (
            <p className="text-sm text-red-600">{error || transactionsError || ordenesError}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transacciones sin conciliar</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoMatch}
            disabled={autoMatches.length === 0 || matching}
          >
            {matching ? "Conciliando..." : "Auto-match por folio OC"}
          </Button>
        </CardHeader>
        <CardContent>
          {unmatched.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay transacciones pendientes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Referencia</th>
                    <th className="py-2">Conciliar</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatched.map((tx) => (
                    <tr key={tx.id} className="border-t">
                      <td className="py-2">{tx.fecha}</td>
                      <td className="py-2">{tx.descripcionBanco}</td>
                      <td className="py-2">${Number(tx.monto).toFixed(2)}</td>
                      <td className="py-2">{tx.referenciaBancaria || "-"}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                            value={manualSelections[tx.id] || ""}
                            onChange={(e) =>
                              setManualSelections((prev) => ({
                                ...prev,
                                [tx.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Selecciona OC</option>
                            {ordenes.map((oc) => (
                              <option key={oc.id} value={oc.id}>
                                {oc.numeroOrden}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!manualSelections[tx.id] || matching}
                            onClick={() => handleManualMatch(tx)}
                          >
                            Conciliar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
