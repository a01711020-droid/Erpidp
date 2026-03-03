/**
 * GLOBAL DASHBOARD
 *
 * Fetch real a /api/obras via MSW (dev) o backend real (prod).
 * Sin dataAdapter, sin mocks importados.
 * Estados: loading → error → empty → data
 */

import { useState, useEffect } from 'react';
import type { Obra } from '@/core/data/types';
import {
  DashboardStateLoading,
  DashboardStateError,
  DashboardStateEmpty,
} from '@/app/components/global-dashboard';
import DashboardData from '@/app/components/global-dashboard/DashboardStateData';
import { WorkForm } from '@/app/components/WorkForm';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

interface GlobalDashboardProps {
  onSelectProject?: (projectId: string) => void;
}

export default function GlobalDashboard({ onSelectProject }: GlobalDashboardProps) {
  const [obras, setObras] = useState<Obra[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'data'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function cargarObras() {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/obras?estatus=activa`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const data: Obra[] = json.data ?? [];
      if (data.length === 0) {
        setStatus('empty');
      } else {
        setObras(data);
        setStatus('data');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStatus('error');
    }
  }

  useEffect(() => { cargarObras(); }, []);

  const handleObraCreada = () => {
    setShowModal(false);
    cargarObras();
  };

  if (status === 'loading') return <DashboardStateLoading />;
  if (status === 'error') return <DashboardStateError onRetry={cargarObras} />;
  if (status === 'empty') {
    return (
      <>
        <DashboardStateEmpty onCreateWork={() => setShowModal(true)} />
        {showModal && (
          <WorkForm onClose={() => setShowModal(false)} onSuccess={handleObraCreada} />
        )}
      </>
    );
  }

  return (
    <>
      <DashboardData
        obras={obras}
        onSelectProject={onSelectProject}
        onCreateWork={() => setShowModal(true)}
      />
      {showModal && (
        <WorkForm onClose={() => setShowModal(false)} onSuccess={handleObraCreada} />
      )}
    </>
  );
}
