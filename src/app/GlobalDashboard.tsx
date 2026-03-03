/**
 * GLOBAL DASHBOARD
 *
 * Carga obras reales desde el dataAdapter.
 * Maneja estados: loading → error → empty → data
 * Sin datos hardcodeados.
 */

import { useState, useEffect } from 'react';
import { dataAdapter } from '@/core/data';
import type { Obra } from '@/core/data/types';
import {
  DashboardStateLoading,
  DashboardStateError,
  DashboardStateEmpty,
} from '@/app/components/global-dashboard';
import DashboardData from '@/app/components/global-dashboard/DashboardStateData';
import { WorkForm } from '@/app/components/WorkForm';

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
      const res = await dataAdapter.listObras({ estatus: 'activa' });
      if (res.status === 'error') {
        setError(res.error || 'Error al cargar obras');
        setStatus('error');
        return;
      }
      if (!res.data || res.data.length === 0) {
        setStatus('empty');
        return;
      }
      setObras(res.data);
      setStatus('data');
    } catch (e) {
      setError('Error inesperado al cargar obras');
      setStatus('error');
    }
  }

  useEffect(() => { cargarObras(); }, []);

  const handleObraCreada = () => {
    setShowModal(false);
    cargarObras();
  };

  if (status === 'loading') return <DashboardStateLoading />;

  if (status === 'error') {
    return <DashboardStateError onRetry={cargarObras} />;
  }

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
