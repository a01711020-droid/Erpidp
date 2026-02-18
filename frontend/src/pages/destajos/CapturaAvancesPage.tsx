import { useDestajos } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import { DestajosView } from "@/ui/DestajosView";
import DestajosFull from "@/ui/destajos/DestajosFullView";

export default function CapturaAvancesPage() {
  const { data, isLoading, error, refetch } = useDestajos();

  return (
    <DestajosView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
      renderFull={() => (
        <DestajosFull
          onBack={() => undefined}
          onManageDestajistas={() => undefined}
          destajistas={[]}
        />
      )}
    />
  );
}
