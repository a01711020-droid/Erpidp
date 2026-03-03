import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, FilePlus } from 'lucide-react';

export default function FacturaCreate() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate('/pagos/facturas')} className="gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-lg"><FilePlus className="h-6 w-6 text-white" /></div>
        <h1 className="text-2xl font-bold">Adjuntar Factura</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Formulario — próximamente</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Conectará al endpoint <code className="bg-gray-100 px-1 rounded">POST /pagos/:id/adjuntar-factura</code>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
