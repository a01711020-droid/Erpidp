import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export default function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="py-8">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          {title && <p className="text-sm text-slate-500">{title}</p>}
          {description && (
            <p className="text-sm text-slate-400">{description}</p>
          )}
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
