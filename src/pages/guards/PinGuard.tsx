import { useEffect, useState } from "react";
import { Button } from "../../ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/primitives/card";
import { Input } from "../../ui/primitives/input";

const DEFAULT_PIN = "1234";

interface PinGuardProps {
  storageKey: string;
  title: string;
  children: React.ReactNode;
}

export default function PinGuard({ storageKey, title, children }: PinGuardProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "verified") {
      setVerified(true);
    }
  }, [storageKey]);

  const handleVerify = () => {
    if (pin === DEFAULT_PIN) {
      localStorage.setItem(storageKey, "verified");
      setVerified(true);
      setError(null);
      return;
    }
    setError("PIN incorrecto. Intenta de nuevo.");
  };

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este módulo está protegido con un PIN temporal. Ingresa el PIN para continuar.
          </p>
          <Input
            type="password"
            placeholder="PIN de acceso"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleVerify} className="w-full">
            Desbloquear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
