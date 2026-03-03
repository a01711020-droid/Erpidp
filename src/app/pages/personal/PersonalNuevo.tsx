import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function PersonalNuevo() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate('/personal')} className="gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al directorio
      </Button>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-700 rounded-lg"><UserPlus className="h-6 w-6 text-white" /></div>
        <h1 className="text-2xl font-bold">Nuevo Empleado</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Formulario — próximamente</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Este formulario se conectará al endpoint <code className="bg-gray-100 px-1 rounded">POST {EP_LABEL}</code> cuando el backend esté listo.</p>
        </CardContent>
      </Card>
    </div>
  );
}
const EP_LABEL = '/personal/empleados';
