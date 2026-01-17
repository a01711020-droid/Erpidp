import { useState } from "react";
import MainApp from "./MainApp";
import DataProviderTest from "./DataProviderTest";
import { Button } from "./components/ui/button";

export default function App() {
  const [showTest, setShowTest] = useState(false);

  // Si quieres ver el panel de pruebas del DataProvider, cambia showTest a true
  // o agrega un botón para alternar
  if (showTest) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => setShowTest(false)}>
            Volver a la App
          </Button>
        </div>
        <DataProviderTest />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `
        linear-gradient(to bottom, #f5f3f0 0%, #f8f6f3 100%),
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.008) 2px,
          rgba(0, 0, 0, 0.008) 4px
        )
      `,
      backgroundBlendMode: 'overlay'
    }}>
      {/* Botón flotante para acceder al panel de pruebas (temporal) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setShowTest(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          🧪 Probar DataProvider
        </Button>
      </div>
      <MainApp />
    </div>
  );
}