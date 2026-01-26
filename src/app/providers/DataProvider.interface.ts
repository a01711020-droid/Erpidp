/**
 * INTERFAZ ÚNICA DEL DATA PROVIDER
 * Define el contrato para todos los providers (API y Mock)
 * 
 * REGLAS:
 * - Usa el modelo unificado de entities.ts
 * - Métodos CRUD estándar (list, get, create, update, delete)
 * - Respuestas paginadas
 * - Sin traducciones, sin conversiones
 */

export * from "../../core/api/DataProvider.interface";
