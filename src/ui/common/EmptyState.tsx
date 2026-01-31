import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-slate-300 bg-slate-50/60">
      <CardContent className="py-10 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-slate-200 p-3">
            <AlertCircle className="h-6 w-6 text-slate-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
