/**
 * PERSONAL MANAGEMENT (Personal)
 * 
 * Gestión de empleados y colaboradores:
 * - Todos los empleados asignados a una obra (incluyendo OFICINA)
 * - Control de asignaciones por obra
 * - Salarios por día
 * - Días trabajados a la semana
 * - Registro semanal histórico (52 semanas)
 */

import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  ArrowLeft,
  UserCog,
  UserPlus,
  Users,
  Building2,
  Search,
  Edit,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";

// Tipos
interface Employee {
  id: string;
  nombre: string;
  puesto: string;
  obraAsignada: string;
  nombreObra: string;
  salarioDia: number;
  diasSemana: number;
  numeroCuenta?: string;
  banco?: string;
  observaciones?: string;
}

interface WeeklyRecord {
  empleadoId: string;
  semana: number; // 1-52
  year: number;
  obraAsignada: string;
  nombreObra: string;
  diasTrabajados: number;
  salarioDia: number;
  salarioPagado: number;
  observaciones: string;
  fechaInicio: string;
  fechaFin: string;
}

interface PersonalManagementProps {
  onBack: () => void;
}

// Obras disponibles
const OBRAS = [
  { codigo: "228", nombre: "CASTELLO F" },
  { codigo: "229", nombre: "CASTELLO G" },
  { codigo: "230", nombre: "CASTELLO H" },
  { codigo: "231", nombre: "DOZA A" },
  { codigo: "232", nombre: "DOZA C" },
  { codigo: "233", nombre: "BALVANERA" },
  { codigo: "OFICINA", nombre: "OFICINA" },
];

// Generar fechas de semanas del año
const getWeekDates = (year: number, weekNumber: number) => {
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

// Mock data - Empleados
const initialEmployees: Employee[] = [
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

// Mock data - Registros semanales (últimas 8 semanas como ejemplo)
const generateMockWeeklyRecords = (): WeeklyRecord[] => {
  const records: WeeklyRecord[] = [];
  const currentYear = 2025;
  
  // Generar registros para las últimas 8 semanas (semana 1-8 del 2025)
  for (let semana = 1; semana <= 8; semana++) {
    const dates = getWeekDates(currentYear, semana);
    
    // EMP-001 - Juan Carlos (estuvo en diferentes obras)
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
    
    // EMP-008 - Ana María (oficina y obras)
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

export default function PersonalManagement({ onBack }: PersonalManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>(generateMockWeeklyRecords());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObra, setSelectedObra] = useState<string>("ALL");
  
  // Weekly tab state
  const [selectedEmployeeForWeekly, setSelectedEmployeeForWeekly] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showEditWeekDialog, setShowEditWeekDialog] = useState(false);
  const [editingWeek, setEditingWeek] = useState<{semana: number; record?: WeeklyRecord} | null>(null);
  const [weekForm, setWeekForm] = useState({
    obraAsignada: "",
    diasTrabajados: "",
    observaciones: "",
  });

  // Dialogs
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Forms
  const [editForm, setEditForm] = useState({
    nombre: "",
    puesto: "",
    obraAsignada: "",
    nombreObra: "",
    salarioDia: "",
    diasSemana: "",
    numeroCuenta: "",
    banco: "",
    observaciones: "",
  });

  const [addForm, setAddForm] = useState({
    nombre: "",
    puesto: "",
    obraAsignada: "",
    salarioDia: "",
    diasSemana: "6",
    numeroCuenta: "",
    banco: "",
    observaciones: "",
  });

  // CRUD Empleados
  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      nombre: employee.nombre,
      puesto: employee.puesto,
      obraAsignada: employee.obraAsignada,
      nombreObra: employee.nombreObra,
      salarioDia: employee.salarioDia.toString(),
      diasSemana: employee.diasSemana.toString(),
      numeroCuenta: employee.numeroCuenta || "",
      banco: employee.banco || "",
      observaciones: employee.observaciones || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEmployee) return;
    const obra = OBRAS.find((o) => o.codigo === editForm.obraAsignada);

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              nombre: editForm.nombre,
              puesto: editForm.puesto,
              obraAsignada: editForm.obraAsignada,
              nombreObra: obra?.nombre || editForm.nombreObra,
              salarioDia: parseFloat(editForm.salarioDia),
              diasSemana: parseFloat(editForm.diasSemana),
              numeroCuenta: editForm.numeroCuenta,
              banco: editForm.banco,
              observaciones: editForm.observaciones,
            }
          : emp
      )
    );

    setShowEditDialog(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    const obra = OBRAS.find((o) => o.codigo === addForm.obraAsignada);
    if (!obra) return;

    const newEmployee: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      nombre: addForm.nombre,
      puesto: addForm.puesto,
      obraAsignada: addForm.obraAsignada,
      nombreObra: obra.nombre,
      salarioDia: parseFloat(addForm.salarioDia),
      diasSemana: parseFloat(addForm.diasSemana),
      numeroCuenta: addForm.numeroCuenta,
      banco: addForm.banco,
      observaciones: addForm.observaciones,
    };

    setEmployees([...employees, newEmployee]);
    setShowAddDialog(false);
    setAddForm({
      nombre: "",
      puesto: "",
      obraAsignada: "",
      salarioDia: "",
      diasSemana: "6",
      numeroCuenta: "",
      banco: "",
      observaciones: "",
    });
  };

  // CRUD Weekly Records
  const handleOpenEditWeek = (semana: number, empleadoId: string) => {
    const existingRecord = weeklyRecords.find(
      (r) => r.semana === semana && r.empleadoId === empleadoId && r.year === selectedYear
    );
    
    const emp = employees.find((e) => e.id === empleadoId);
    
    setEditingWeek({ semana, record: existingRecord });
    setWeekForm({
      obraAsignada: existingRecord?.obraAsignada || emp?.obraAsignada || "",
      diasTrabajados: existingRecord?.diasTrabajados.toString() || emp?.diasSemana.toString() || "6",
      observaciones: existingRecord?.observaciones || "",
    });
    setShowEditWeekDialog(true);
  };

  const handleSaveWeek = () => {
    if (!editingWeek || !selectedEmployeeForWeekly) return;

    const emp = employees.find((e) => e.id === selectedEmployeeForWeekly);
    if (!emp) return;

    const obra = OBRAS.find((o) => o.codigo === weekForm.obraAsignada);
    if (!obra) return;

    const diasTrabajados = parseFloat(weekForm.diasTrabajados);
    const salarioPagado = emp.salarioDia * diasTrabajados;
    const dates = getWeekDates(selectedYear, editingWeek.semana);

    const newRecord: WeeklyRecord = {
      empleadoId: selectedEmployeeForWeekly,
      semana: editingWeek.semana,
      year: selectedYear,
      obraAsignada: weekForm.obraAsignada,
      nombreObra: obra.nombre,
      diasTrabajados,
      salarioDia: emp.salarioDia,
      salarioPagado,
      observaciones: weekForm.observaciones,
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    };

    // Actualizar o agregar registro
    const existingIndex = weeklyRecords.findIndex(
      (r) => r.semana === editingWeek.semana && r.empleadoId === selectedEmployeeForWeekly && r.year === selectedYear
    );

    if (existingIndex >= 0) {
      setWeeklyRecords(
        weeklyRecords.map((r, i) => (i === existingIndex ? newRecord : r))
      );
    } else {
      setWeeklyRecords([...weeklyRecords, newRecord]);
    }

    setShowEditWeekDialog(false);
    setEditingWeek(null);
  };

  // Filtros
  const filteredEmployees = employees.filter((emp) => {
    const matchesObra = selectedObra === "ALL" || emp.obraAsignada === selectedObra;
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nombreObra.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesObra && matchesSearch;
  });

  // Colores por obra
  const getObraColor = (codigo: string) => {
    const colores: Record<string, string> = {
      "228": "bg-blue-100 text-blue-800 border-blue-300",
      "229": "bg-green-100 text-green-800 border-green-300",
      "230": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "231": "bg-pink-100 text-pink-800 border-pink-300",
      "232": "bg-cyan-100 text-cyan-800 border-cyan-300",
      "233": "bg-orange-100 text-orange-800 border-orange-300",
      "OFICINA": "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colores[codigo] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Stats
  const totalEmpleados = employees.length;
  const empleadosObras = employees.filter((e) => e.obraAsignada !== "OFICINA").length;
  const empleadosOficina = employees.filter((e) => e.obraAsignada === "OFICINA").length;
  const nominaSemanalEstimada = employees.reduce(
    (sum, emp) => sum + emp.salarioDia * emp.diasSemana,
    0
  );

  // Weekly records para el empleado seleccionado
  const employeeWeeklyRecords = selectedEmployeeForWeekly
    ? weeklyRecords.filter(
        (r) => r.empleadoId === selectedEmployeeForWeekly && r.year === selectedYear
      )
    : [];

  const totalPagadoAnual = employeeWeeklyRecords.reduce(
    (sum, r) => sum + r.salarioPagado,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-800 border-b-4 border-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <UserCog className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Gestión de Personal</h1>
                  <p className="text-purple-100">Control de empleados y registro semanal</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2 bg-white text-purple-700 hover:bg-purple-50"
            >
              <UserPlus className="h-5 w-5" />
              Agregar Empleado
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Empleados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{totalEmpleados}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                En Obras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{empleadosObras}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                En Oficina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{empleadosOficina}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Nómina Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                ${nominaSemanalEstimada.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100">
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Registro de Personal
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-2">
              <Calendar className="h-4 w-4" />
              Registro Semanal
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: REGISTRO DE PERSONAL */}
          <TabsContent value="employees" className="space-y-6">
            {/* Filters */}
            <Card className="border-purple-200">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, puesto u obra..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedObra} onValueChange={setSelectedObra}>
                    <SelectTrigger className="w-full sm:w-[220px]">
                      <SelectValue placeholder="Filtrar por obra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todas las Ubicaciones</SelectItem>
                      {OBRAS.map((obra) => (
                        <SelectItem key={obra.codigo} value={obra.codigo}>
                          {obra.codigo === "OFICINA"
                            ? "OFICINA"
                            : `${obra.codigo} - ${obra.nombre}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Empleados */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Empleados Activos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 border-b font-semibold text-sm text-gray-700">
                  <div className="col-span-3">Obra Asignada</div>
                  <div className="col-span-3">Nombre</div>
                  <div className="col-span-2 text-center">Salario/Día</div>
                  <div className="col-span-2 text-center">Días/Sem</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>

                {/* Filas */}
                <div className="divide-y">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No se encontraron empleados</p>
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const salarioSemanal = emp.salarioDia * emp.diasSemana;

                      return (
                        <div
                          key={emp.id}
                          className="grid grid-cols-12 gap-4 p-4 hover:bg-purple-50 transition-colors"
                        >
                          <div className="col-span-3">
                            <Badge
                              variant="outline"
                              className={getObraColor(emp.obraAsignada)}
                            >
                              {emp.obraAsignada === "OFICINA"
                                ? "OFICINA"
                                : `${emp.obraAsignada} - ${emp.nombreObra}`}
                            </Badge>
                          </div>
                          <div className="col-span-3">
                            <p className="font-semibold text-gray-900">{emp.nombre}</p>
                            <p className="text-xs text-gray-500">{emp.id}</p>
                            {emp.observaciones && (
                              <p className="text-xs text-purple-600 mt-1">
                                📝 {emp.observaciones}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-sm font-bold text-green-700">
                              ${emp.salarioDia.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${salarioSemanal.toLocaleString()}/sem
                            </p>
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {emp.diasSemana}
                            </p>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit(emp)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: REGISTRO SEMANAL */}
          <TabsContent value="weekly" className="space-y-6">
            {/* Selector de Empleado y Año */}
            <Card className="border-purple-200">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label>Seleccionar Empleado</Label>
                    <Select
                      value={selectedEmployeeForWeekly}
                      onValueChange={setSelectedEmployeeForWeekly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.nombre} ({emp.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-[180px]">
                    <Label>Año</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(v) => setSelectedYear(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedEmployeeForWeekly && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Total Pagado en {selectedYear}
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          ${totalPagadoAnual.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Semanas Registradas
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {employeeWeeklyRecords.length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabla de Semanas */}
            {selectedEmployeeForWeekly ? (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle>
                    Registro de 52 Semanas -{" "}
                    {employees.find((e) => e.id === selectedEmployeeForWeekly)?.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 border-b font-semibold text-sm text-gray-700">
                    <div className="col-span-1 text-center">Sem</div>
                    <div className="col-span-2">Fechas</div>
                    <div className="col-span-3">Obra</div>
                    <div className="col-span-1 text-center">Días</div>
                    <div className="col-span-2 text-center">Salario</div>
                    <div className="col-span-3 text-right">Acciones</div>
                  </div>

                  {/* Filas de semanas */}
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 52 }, (_, i) => i + 1).map((semana) => {
                      const record = employeeWeeklyRecords.find((r) => r.semana === semana);
                      const dates = getWeekDates(selectedYear, semana);
                      const emp = employees.find((e) => e.id === selectedEmployeeForWeekly);

                      return (
                        <div
                          key={semana}
                          className={`grid grid-cols-12 gap-4 p-3 hover:bg-purple-50 transition-colors ${
                            !record ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="col-span-1 text-center">
                            <p className="text-sm font-semibold text-gray-700">{semana}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-600">
                              {dates.inicio} - {dates.fin}
                            </p>
                          </div>
                          <div className="col-span-3">
                            {record ? (
                              <Badge
                                variant="outline"
                                className={getObraColor(record.obraAsignada)}
                              >
                                {record.obraAsignada === "OFICINA"
                                  ? "OFICINA"
                                  : `${record.obraAsignada} - ${record.nombreObra}`}
                              </Badge>
                            ) : (
                              <p className="text-xs text-gray-400">Sin registro</p>
                            )}
                            {record?.observaciones && (
                              <p className="text-xs text-purple-600 mt-1">
                                📝 {record.observaciones}
                              </p>
                            )}
                          </div>
                          <div className="col-span-1 text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {record?.diasTrabajados || "-"}
                            </p>
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-sm font-bold text-green-700">
                              {record
                                ? `$${record.salarioPagado.toLocaleString()}`
                                : "-"}
                            </p>
                          </div>
                          <div className="col-span-3 flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenEditWeek(semana, selectedEmployeeForWeekly)
                              }
                              className="gap-1 text-xs"
                            >
                              <Edit className="h-3 w-3" />
                              {record ? "Editar" : "Registrar"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-purple-200">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Seleccione un empleado para ver su registro semanal
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog - Editar Empleado */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique los datos del empleado o reasigne a otra obra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              />
            </div>

            <div>
              <Label>Puesto</Label>
              <Input
                value={editForm.puesto}
                onChange={(e) => setEditForm({ ...editForm, puesto: e.target.value })}
              />
            </div>

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={editForm.obraAsignada}
                onValueChange={(value) => {
                  const obra = OBRAS.find((o) => o.codigo === value);
                  setEditForm({
                    ...editForm,
                    obraAsignada: value,
                    nombreObra: obra?.nombre || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salario por Día</Label>
                <Input
                  type="number"
                  value={editForm.salarioDia}
                  onChange={(e) => setEditForm({ ...editForm, salarioDia: e.target.value })}
                />
              </div>

              <div>
                <Label>Días por Semana</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="7"
                  step="0.5"
                  value={editForm.diasSemana}
                  onChange={(e) => setEditForm({ ...editForm, diasSemana: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Número de Cuenta</Label>
              <Input
                value={editForm.numeroCuenta}
                onChange={(e) => setEditForm({ ...editForm, numeroCuenta: e.target.value })}
              />
            </div>

            <div>
              <Label>Banco</Label>
              <Input
                value={editForm.banco}
                onChange={(e) => setEditForm({ ...editForm, banco: e.target.value })}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                value={editForm.observaciones}
                onChange={(e) =>
                  setEditForm({ ...editForm, observaciones: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Agregar Empleado */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Registre un nuevo empleado y asígnelo a una obra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input
                value={addForm.nombre}
                onChange={(e) => setAddForm({ ...addForm, nombre: e.target.value })}
              />
            </div>

            <div>
              <Label>Puesto</Label>
              <Input
                value={addForm.puesto}
                onChange={(e) => setAddForm({ ...addForm, puesto: e.target.value })}
              />
            </div>

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={addForm.obraAsignada}
                onValueChange={(value) => setAddForm({ ...addForm, obraAsignada: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione obra" />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salario por Día</Label>
                <Input
                  type="number"
                  value={addForm.salarioDia}
                  onChange={(e) => setAddForm({ ...addForm, salarioDia: e.target.value })}
                />
              </div>

              <div>
                <Label>Días por Semana</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="7"
                  step="0.5"
                  value={addForm.diasSemana}
                  onChange={(e) => setAddForm({ ...addForm, diasSemana: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Número de Cuenta</Label>
              <Input
                value={addForm.numeroCuenta}
                onChange={(e) => setAddForm({ ...addForm, numeroCuenta: e.target.value })}
              />
            </div>

            <div>
              <Label>Banco</Label>
              <Input
                value={addForm.banco}
                onChange={(e) => setAddForm({ ...addForm, banco: e.target.value })}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                value={addForm.observaciones}
                onChange={(e) => setAddForm({ ...addForm, observaciones: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddEmployee}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={
                !addForm.nombre ||
                !addForm.puesto ||
                !addForm.obraAsignada ||
                !addForm.salarioDia ||
                !addForm.diasSemana
              }
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Empleado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Editar Semana */}
      <Dialog open={showEditWeekDialog} onOpenChange={setShowEditWeekDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Registrar Semana {editingWeek?.semana} - {selectedYear}
            </DialogTitle>
            <DialogDescription>
              Registre en qué obra trabajó y cuántos días laboró esta semana
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingWeek && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">
                  Semana {editingWeek.semana} •{" "}
                  {getWeekDates(selectedYear, editingWeek.semana).inicio} -{" "}
                  {getWeekDates(selectedYear, editingWeek.semana).fin}
                </p>
              </div>
            )}

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={weekForm.obraAsignada}
                onValueChange={(value) =>
                  setWeekForm({ ...weekForm, obraAsignada: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione obra" />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Días Trabajados</Label>
              <Input
                type="number"
                min="0"
                max="7"
                step="0.5"
                value={weekForm.diasTrabajados}
                onChange={(e) =>
                  setWeekForm({ ...weekForm, diasTrabajados: e.target.value })
                }
                placeholder="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puede ingresar medios días (ejemplo: 5.5)
              </p>
            </div>

            <div>
              <Label>Observaciones</Label>
              <Textarea
                value={weekForm.observaciones}
                onChange={(e) =>
                  setWeekForm({ ...weekForm, observaciones: e.target.value })
                }
                rows={3}
                placeholder="Ejemplo: Trabajó horas extra el viernes"
              />
            </div>

            {weekForm.diasTrabajados && selectedEmployeeForWeekly && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Salario a Pagar:</span>{" "}
                  <span className="text-purple-700 font-bold">
                    $
                    {(
                      (employees.find((e) => e.id === selectedEmployeeForWeekly)
                        ?.salarioDia || 0) * parseFloat(weekForm.diasTrabajados)
                    ).toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditWeekDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveWeek}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!weekForm.obraAsignada || !weekForm.diasTrabajados}
            >
              Guardar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
