/**
 * DATA PROVIDER - PUNTO DE ENTRADA
 * Exporta la instancia del DataProvider según la configuración del entorno
 * 
 * Variables de entorno:
 * - VITE_DATA_MODE: "mock" | "api" (por defecto: "mock")
 * - VITE_API_URL: URL del backend API (requerido si mode === "api")
 */

import type { IDataProvider } from "./DataProvider.interface";
import { MockProvider } from "./MockProvider";
import { ApiProvider } from "./ApiProvider";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const DATA_MODE = import.meta.env.VITE_DATA_MODE || "mock";
const API_URL = import.meta.env.VITE_API_URL;

console.log("[DataProvider] Inicializando en modo:", DATA_MODE);

// ============================================================================
// FACTORY
// ============================================================================

function createDataProvider(): IDataProvider {
  if (DATA_MODE === "api") {
    if (!API_URL) {
      console.error(
        "[DataProvider] ERROR: Modo API seleccionado pero VITE_API_URL no está configurado. Usando MockProvider como fallback."
      );
      // En producción, NO debe haber fallback a mock
      if (import.meta.env.PROD) {
        throw new Error(
          "Configuración inválida: VITE_DATA_MODE=api requiere VITE_API_URL"
        );
      }
      return new MockProvider();
    }

    console.log("[DataProvider] Usando ApiProvider con URL:", API_URL);
    return new ApiProvider(API_URL);
  }

  // Por defecto, usar MockProvider
  console.log("[DataProvider] Usando MockProvider con datos de demostración");
  return new MockProvider();
}

// ============================================================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================================================

export const dataProvider: IDataProvider = createDataProvider();

// También exportar los tipos e interfaces para uso en los módulos
export type { IDataProvider } from "./DataProvider.interface";
export * from "@/app/types/entities";
