import { useDestajistas } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import { DestajistasCatalogView } from "@/ui/DestajistasCatalogView";

export default function DestajistasCatalogoPage() {
  const { data, isLoading, error, refetch } = useDestajistas();

  return (
    <DestajistasCatalogView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
    />
  );
}
