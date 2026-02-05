import MainApp from "./MainApp";
import AppDemo from "../AppDemo";
import { DevModeProvider } from "@/core/contexts/DevModeContext";
import { useDevModeSync } from "@/core/hooks/useDevModeSync";
import { useState } from "react";
import { Button } from "./components/ui/button";

// Toggle para cambiar entre App normal y Demo
const USE_DEMO_MODE = false; // Cambia a true para usar AppDemo, false para MainApp refactorizado

function AppWithSync() {
  // Sincronizar contexto con mockAdapter
  useDevModeSync();
  
  return <MainApp />;
}

export default function App() {
  // Si USE_DEMO_MODE está activo, mostrar AppDemo directamente
  if (USE_DEMO_MODE) {
    return <AppDemo />;
  }

  // App original con DevModeProvider
  return (
    <DevModeProvider>
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
        <AppWithSync />
      </div>
    </DevModeProvider>
  );
}