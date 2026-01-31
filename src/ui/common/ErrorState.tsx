import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export default function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50/60">
      <CardContent className="py-10 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-700">{title}</h3>
          <p className="text-sm text-red-600 mt-1">{description}</p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="border-red-200">
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
