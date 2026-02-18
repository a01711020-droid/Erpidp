/**
 * MOCK DATA - GESTIÓN DE PERSONAL
 * Datos para el módulo de Personal Management.
 */

import { Employee, WeeklyRecord, DestajistaSemanal } from "./types";

// Obras disponibles (Referencia)
export const OBRAS_REF = [
  { codigo: "228", nombre: "CASTELLO F" },
  { codigo: "229", nombre: "CASTELLO G" },
  { codigo: "230", nombre: "CASTELLO H" },
  { codigo: "231", nombre: "DOZA A" },
  { codigo: "232", nombre: "DOZA C" },
  { codigo: "233", nombre: "BALVANERA" },
  { codigo: "OFICINA", nombre: "OFICINA" },
];

// Generar fechas de semanas del año (Utility for mocks)
export const getWeekDates = (year: number, weekNumber: number) => {
  const firstDay = new Date(year, 0, 1);
  const dayOfWeek = firstDay.getDay();
  const daysSinceFirstMonday = (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek);
  
  const firstMonday = new Date(year, 0, firstDay.getDate() + daysSinceFirstMonday);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const formatDate = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${day}/${month}`;
  };
  
  return {
    inicio: formatDate(weekStart),
    fin: formatDate(weekEnd),
  };
};

// Empleados Iniciales
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP-001",
    nombre: "Juan Carlos Pérez",
    puesto: "Maestro Albañil",
    obraAsignada: "228",
    nombreObra: "CASTELLO F",
    salarioDia: 450,
    diasSemana: 6,
  },
  {
    id: "EMP-002",
    nombre: "Miguel Ángel Rodríguez",
    puesto: "Fierrero",
    obraAsignada: "229",
    nombreObra: "CASTELLO G",
    salarioDia: 420,
    diasSemana: 6,
  },
  {
    id: "EMP-003",
    nombre: "Roberto Sánchez Torres",
    puesto: "Peón",
    obraAsignada: "228",
    nombreObra: "CASTELLO F",
    salarioDia: 350,
    diasSemana: 6,
  },
  {
    id: "EMP-008",
    nombre: "Ana María González",
    puesto: "Gerente de Proyecto",
    obraAsignada: "OFICINA",
    nombreObra: "OFICINA",
    salarioDia: 800,
    diasSemana: 5,
  },
  {
    id: "EMP-010",
    nombre: "Ricardo Flores Díaz",
    puesto: "Ingeniero Residente",
    obraAsignada: "228",
    nombreObra: "CASTELLO F",
    salarioDia: 750,
    diasSemana: 6,
  },
];

// Destajistas de la semana
export const MOCK_DESTAJISTAS_SEMANALES: DestajistaSemanal[] = [
  { inicial: "JP", nombre: "Juan Pérez", importe: 125000 },
  { inicial: "MG", nombre: "María González", importe: 98000 },
  { inicial: "LS", nombre: "Luis Sánchez", importe: 112000 },
  { inicial: "AC", nombre: "Ana Cruz", importe: 87500 },
  { inicial: "RH", nombre: "Roberto Hernández", importe: 95000 },
  { inicial: "CF", nombre: "Carlos Flores", importe: 103000 },
  { inicial: "PM", nombre: "Pedro Morales", importe: 88500 },
  { inicial: "DV", nombre: "Diana Vega", importe: 91000 },
  { inicial: "JR", nombre: "José Ramírez", importe: 107000 },
  { inicial: "LM", nombre: "Laura Méndez", importe: 94500 },
  { inicial: "AM", nombre: "Alberto Mata", importe: 89000 },
  { inicial: "SR", nombre: "Sandra Rojas", importe: 96000 },
];

// Generador de Registros Semanales (Snapshot)
export const generateMockWeeklyRecords = (): WeeklyRecord[] => {
  const records: WeeklyRecord[] = [];
  const currentYear = 2025;
  
  // Generar registros para las últimas 8 semanas (semana 1-8 del 2025)
  for (let semana = 1; semana <= 8; semana++) {
    const dates = getWeekDates(currentYear, semana);
    
    // EMP-001 - Juan Carlos
    records.push({
      empleadoId: "EMP-001",
      semana,
      year: currentYear,
      obraAsignada: semana <= 3 ? "228" : semana <= 6 ? "229" : "228",
      nombreObra: semana <= 3 ? "CASTELLO F" : semana <= 6 ? "CASTELLO G" : "CASTELLO F",
      diasTrabajados: semana === 4 ? 5.5 : 6,
      salarioDia: 450,
      salarioPagado: semana === 4 ? 2475 : 2700,
      observaciones: semana === 4 ? "Salió temprano el sábado" : "",
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    });
    
    // EMP-008 - Ana María
    records.push({
      empleadoId: "EMP-008",
      semana,
      year: currentYear,
      obraAsignada: semana === 2 || semana === 5 ? "228" : "OFICINA",
      nombreObra: semana === 2 || semana === 5 ? "CASTELLO F" : "OFICINA",
      diasTrabajados: 5,
      salarioDia: 800,
      salarioPagado: 4000,
      observaciones: semana === 2 ? "Supervisión en obra" : semana === 5 ? "Revisión de avances" : "",
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    });
  }
  
  return records;
};
