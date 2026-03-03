/**
 * PageStates — componentes reutilizables de loading / error / empty
 * Se usan en todas las páginas del sistema.
 */
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { LucideIcon } from 'lucide-react';

export function PageLoading({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 className="h-10 w-10 animate-spin text-slate-500 mb-4" />
      <p className="text-muted-foreground">{mensaje}</p>
    </div>
  );
}

export function PageError({ mensaje, onRetry }: { mensaje: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Error al cargar</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md text-center">{mensaje}</p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" /> Reintentar
      </Button>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
  ctaLabel?: string;
  onCta?: () => void;
  iconBg?: string;
  iconColor?: string;
}

export function PageEmpty({
  icon: Icon,
  titulo,
  descripcion,
  ctaLabel,
  onCta,
  iconBg = 'bg-slate-100',
  iconColor = 'text-slate-400',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className={`p-5 ${iconBg} rounded-full mb-6`}>
        <Icon className={`h-12 w-12 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{titulo}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">{descripcion}</p>
      {ctaLabel && onCta && (
        <Button onClick={onCta} size="lg" className="gap-2">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
