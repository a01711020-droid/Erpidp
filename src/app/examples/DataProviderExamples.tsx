/**
 * EJEMPLOS DE INTEGRACIÓN DEL DATA PROVIDER
 * Estos ejemplos muestran cómo migrar los módulos existentes
 * para usar el DataProvider en lugar de localStorage o datos locales
 */

import React, { useState } from "react";
import { dataProvider } from "@/app/providers";
import type { Obra, Requisicion, OrdenCompra, Pago } from "@/app/providers";
import {
  useObras,
  useRequisiciones,
  useOrdenesCompra,
  usePagos,
  useCreateRequisicion,
  useApproveRequisicion,
} from "@/app/hooks/useDataProvider";

// ============================================================================
// EJEMPLO 1: LISTAR OBRAS EN EL DASHBOARD
// ============================================================================

export function EjemploDashboardObras() {
  // Usando el hook personalizado
  const { data: obras, loading, error, refetch } = useObras({
    page: 1,
    pageSize: 10,
    filters: { status: "Activa" },
    sortBy: "name",
    sortOrder: "asc",
  });

  if (loading) return <div>Cargando obras...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Obras Activas ({obras.length})</h2>
      <ul>
        {obras.map((obra) => (
          <li key={obra.id}>
            {obra.code} - {obra.name} - ${obra.contractAmount.toLocaleString()}
          </li>
        ))}
      </ul>
      <button onClick={refetch}>Recargar</button>
    </div>
  );
}

// ============================================================================
// EJEMPLO 2: OBTENER OBRA POR ID Y MOSTRAR DETALLES FINANCIEROS
// ============================================================================

export function EjemploDetalleObra({ obraId }: { obraId: string }) {
  const [summary, setSummary] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Obtener resumen financiero
      const summaryData = await dataProvider.obras.getFinancialSummary(obraId);
      setSummary(summaryData);

      // Obtener gastos por categoría
      const expensesData = await dataProvider.obras.getExpensesByCategory(obraId);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    cargarDatos();
  }, [obraId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {summary && (
        <div>
          <h3>Resumen Financiero</h3>
          <p>Monto del Contrato: ${summary.contractAmount.toLocaleString()}</p>
          <p>Saldo Actual: ${summary.actualBalance.toLocaleString()}</p>
          <p>Total Pagado: ${summary.totalPaid.toLocaleString()}</p>
          <p>Pagos Pendientes: ${summary.pendingPayments.toLocaleString()}</p>
        </div>
      )}

      {expenses.length > 0 && (
        <div>
          <h3>Gastos por Categoría</h3>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.category}>
                {expense.category}: ${expense.amount.toLocaleString()} (
                {expense.percentage.toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EJEMPLO 3: LISTAR REQUISICIONES CON FILTROS
// ============================================================================

export function EjemploRequisiciones({ obraId }: { obraId: string }) {
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Hook con filtros dinámicos
  const { data: requisiciones, loading, error, refetch } = useRequisiciones({
    page: 1,
    pageSize: 20,
    filters: {
      obraId: obraId,
      ...(statusFilter && { status: statusFilter }),
    },
    sortBy: "requestedAt",
    sortOrder: "desc",
  });

  const { mutate: approveReq, loading: approving } = useApproveRequisicion();

  const handleApprove = async (reqId: string) => {
    const result = await approveReq({
      id: reqId,
      approvedBy: "Ing. Jorge Hernández",
    });

    if (result) {
      alert("Requisición aprobada exitosamente");
      refetch(); // Recargar lista
    }
  };

  if (loading) return <div>Cargando requisiciones...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Requisiciones de Material</h2>

      {/* Filtro por estado */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Aprobada">Aprobada</option>
        <option value="Rechazada">Rechazada</option>
        <option value="Completada">Completada</option>
      </select>

      {/* Lista de requisiciones */}
      <div>
        {requisiciones.map((req) => (
          <div key={req.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{req.code}</h3>
            <p>Solicitado por: {req.requestedBy}</p>
            <p>Estado: {req.status}</p>
            <p>Urgencia: {req.urgency}</p>
            <p>Items: {req.items.length}</p>

            {req.status === "Pendiente" && (
              <button
                onClick={() => handleApprove(req.id)}
                disabled={approving}
              >
                {approving ? "Aprobando..." : "Aprobar"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 4: CREAR NUEVA REQUISICIÓN
// ============================================================================

export function EjemploCrearRequisicion({ obraId }: { obraId: string }) {
  const { mutate: createReq, loading, error } = useCreateRequisicion();
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaRequisicion = {
      code: `REQ-227-${Date.now()}`,
      obraId: obraId,
      requestedBy: "Ing. Miguel Ángel Torres",
      requestedAt: new Date().toISOString(),
      urgency: "Normal" as const,
      status: "Pendiente" as const,
      notes: description,
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      items: [],
    };

    const result = await createReq(nuevaRequisicion);

    if (result) {
      alert(`Requisición ${result.code} creada exitosamente`);
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nueva Requisición</h3>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la requisición"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear Requisición"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </form>
  );
}

// ============================================================================
// EJEMPLO 5: LISTAR ÓRDENES DE COMPRA CON RELACIÓN A PROVEEDOR
// ============================================================================

export function EjemploOrdenesCompra({ obraId }: { obraId: string }) {
  const { data: ordenesCompra, loading } = useOrdenesCompra({
    filters: { obraId },
    sortBy: "issueDate",
    sortOrder: "desc",
  });

  const [proveedores, setProveedores] = useState<Record<string, any>>({});

  // Cargar proveedores relacionados
  React.useEffect(() => {
    const cargarProveedores = async () => {
      const provIds = [...new Set(ordenesCompra.map((oc) => oc.proveedorId))];

      const provs: Record<string, any> = {};
      for (const id of provIds) {
        try {
          provs[id] = await dataProvider.proveedores.getById(id);
        } catch (error) {
          console.error(`Error cargando proveedor ${id}:`, error);
        }
      }

      setProveedores(provs);
    };

    if (ordenesCompra.length > 0) {
      cargarProveedores();
    }
  }, [ordenesCompra]);

  if (loading) return <div>Cargando órdenes de compra...</div>;

  return (
    <div>
      <h2>Órdenes de Compra</h2>

      {ordenesCompra.map((oc) => {
        const proveedor = proveedores[oc.proveedorId];

        return (
          <div key={oc.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{oc.code}</h3>
            <p>Proveedor: {proveedor ? proveedor.commercialName : "Cargando..."}</p>
            <p>Estado: {oc.status}</p>
            <p>Total: ${oc.total.toLocaleString()}</p>
            <p>Fecha de Emisión: {new Date(oc.issueDate).toLocaleDateString()}</p>
            <p>Items: {oc.items.length}</p>

            <details>
              <summary>Ver Items</summary>
              <ul>
                {oc.items.map((item) => (
                  <li key={item.id}>
                    {item.description} - {item.quantity} {item.unit} x $
                    {item.unitPrice} = ${item.subtotal.toLocaleString()}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EJEMPLO 6: PAGOS CON FILTRO POR PROVEEDOR
// ============================================================================

export function EjemploPagos({ obraId }: { obraId: string }) {
  const [proveedorId, setProveedorId] = useState<string>("");

  const { data: pagos, loading } = usePagos({
    filters: {
      obraId,
      ...(proveedorId && { proveedorId }),
    },
    sortBy: "paymentDate",
    sortOrder: "desc",
  });

  const totalPagado = pagos
    .filter((p) => p.status === "Completado")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProgramado = pagos
    .filter((p) => p.status === "Programado")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <div>Cargando pagos...</div>;

  return (
    <div>
      <h2>Módulo de Pagos</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Resumen</h3>
        <p>Total Pagado: ${totalPagado.toLocaleString()}</p>
        <p>Total Programado: ${totalProgramado.toLocaleString()}</p>
      </div>

      <h3>Listado de Pagos</h3>
      {pagos.map((pago) => (
        <div key={pago.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h4>{pago.code}</h4>
          <p>Monto: ${pago.amount.toLocaleString()}</p>
          <p>Estado: {pago.status}</p>
          <p>Método: {pago.paymentMethod}</p>
          <p>Fecha: {new Date(pago.paymentDate).toLocaleDateString()}</p>
          <p>Procesado por: {pago.processedBy}</p>
          {pago.notes && <p>Notas: {pago.notes}</p>}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO 7: USO DIRECTO DEL DATA PROVIDER (Sin hooks)
// ============================================================================

export function EjemploUsoDirecto() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarObras = async () => {
    setLoading(true);
    try {
      // Llamada directa al dataProvider
      const response = await dataProvider.obras.list({
        page: 1,
        pageSize: 100,
      });

      setObras(response.data);
      console.log(`Cargadas ${response.total} obras`);
    } catch (error) {
      console.error("Error cargando obras:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearNuevaObra = async () => {
    try {
      const nuevaObra = await dataProvider.obras.create({
        code: "999",
        name: "NUEVA OBRA",
        client: "Cliente Test",
        contractNumber: "CONT-TEST-001",
        contractAmount: 1000000,
        advancePercentage: 30,
        retentionPercentage: 5,
        startDate: new Date().toISOString(),
        estimatedEndDate: new Date().toISOString(),
        resident: "Ing. Test",
        residentInitials: "IT",
        status: "Activa",
        actualBalance: 300000,
        totalEstimates: 0,
        totalExpenses: 0,
      });

      alert(`Obra ${nuevaObra.code} creada con ID: ${nuevaObra.id}`);
      cargarObras(); // Recargar lista
    } catch (error) {
      console.error("Error creando obra:", error);
    }
  };

  return (
    <div>
      <button onClick={cargarObras} disabled={loading}>
        {loading ? "Cargando..." : "Cargar Obras"}
      </button>
      <button onClick={crearNuevaObra}>Crear Nueva Obra</button>

      <ul>
        {obras.map((obra) => (
          <li key={obra.id}>
            {obra.code} - {obra.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
