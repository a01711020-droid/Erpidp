/**
 * SCRIPT DE VERIFICACIÓN DE INTEGRIDAD DE DATOS
 * 
 * Ejecuta este script para verificar que todos los totales
 * cuadran correctamente en la base de datos de prueba.
 */

import obrasData from '@/data/obras.json';
import proveedoresData from '@/data/proveedores.json';
import requisicionesData from '@/data/requisiciones.json';
import ordenesCompraData from '@/data/ordenesCompra.json';
import pagosData from '@/data/pagos.json';
import destajosData from '@/data/destajos.json';

interface VerificacionResultado {
  nombre: string;
  esperado: number;
  obtenido: number;
  correcto: boolean;
  diferencia?: number;
}

export function verificarIntegridadDatos(): VerificacionResultado[] {
  const resultados: VerificacionResultado[] = [];

  // 1. Verificar totales de OCs por obra
  console.log('📊 Verificando totales de OCs por obra...\n');
  
  obrasData.forEach((obra) => {
    const ocsObra = ordenesCompraData.filter(oc => oc.obraCode === obra.code);
    const totalOCs = ocsObra.reduce((sum, oc) => sum + oc.total, 0);
    
    resultados.push({
      nombre: `OCs Obra ${obra.code} - ${obra.name}`,
      esperado: obra.totalExpensesFromOCs,
      obtenido: totalOCs,
      correcto: Math.abs(totalOCs - obra.totalExpensesFromOCs) < 0.01,
      diferencia: totalOCs - obra.totalExpensesFromOCs,
    });
  });

  // 2. Verificar totales de destajos por obra
  console.log('👷 Verificando totales de destajos por obra...\n');
  
  obrasData.forEach((obra) => {
    const destajosObra = destajosData.flatMap(carga => 
      carga.obras.filter(o => o.codigoObra === obra.code)
    );
    const totalDestajos = destajosObra.reduce((sum, d) => sum + d.totalObra, 0);
    
    resultados.push({
      nombre: `Destajos Obra ${obra.code} - ${obra.name}`,
      esperado: obra.totalExpensesFromDestajos,
      obtenido: totalDestajos,
      correcto: Math.abs(totalDestajos - obra.totalExpensesFromDestajos) < 0.01,
      diferencia: totalDestajos - obra.totalExpensesFromDestajos,
    });
  });

  // 3. Verificar total de gastos por obra (OCs + Destajos)
  console.log('💰 Verificando totales generales por obra...\n');
  
  obrasData.forEach((obra) => {
    const totalEsperado = obra.totalExpensesFromOCs + obra.totalExpensesFromDestajos;
    
    resultados.push({
      nombre: `Total Gastos Obra ${obra.code} - ${obra.name}`,
      esperado: totalEsperado,
      obtenido: obra.totalExpenses,
      correcto: Math.abs(obra.totalExpenses - totalEsperado) < 0.01,
      diferencia: obra.totalExpenses - totalEsperado,
    });
  });

  // 4. Verificar saldos de proveedores
  console.log('🏢 Verificando saldos de proveedores...\n');
  
  proveedoresData.forEach((proveedor) => {
    const ocsProveedor = ordenesCompraData.filter(oc => oc.proveedorId === proveedor.id);
    const saldoCalculado = ocsProveedor.reduce((sum, oc) => sum + oc.saldoPendiente, 0);
    
    resultados.push({
      nombre: `Saldo Proveedor ${proveedor.id} - ${proveedor.nombre}`,
      esperado: proveedor.saldoPendiente,
      obtenido: saldoCalculado,
      correcto: Math.abs(saldoCalculado - proveedor.saldoPendiente) < 0.01,
      diferencia: saldoCalculado - proveedor.saldoPendiente,
    });
  });

  // 5. Verificar pagos vs OCs
  console.log('💳 Verificando pagos vs OCs...\n');
  
  ordenesCompraData.forEach((oc) => {
    const pagosOC = pagosData.filter(p => p.ordenCompraId === oc.id);
    const totalPagado = pagosOC.reduce((sum, p) => sum + p.monto, 0);
    
    resultados.push({
      nombre: `Pagos OC ${oc.codigoOC}`,
      esperado: oc.montoPagado,
      obtenido: totalPagado,
      correcto: Math.abs(totalPagado - oc.montoPagado) < 0.01,
      diferencia: totalPagado - oc.montoPagado,
    });
  });

  // 6. Verificar saldo pendiente de OCs
  console.log('📝 Verificando saldos pendientes de OCs...\n');
  
  ordenesCompraData.forEach((oc) => {
    const saldoCalculado = oc.total - oc.montoPagado;
    
    resultados.push({
      nombre: `Saldo OC ${oc.codigoOC}`,
      esperado: oc.saldoPendiente,
      obtenido: saldoCalculado,
      correcto: Math.abs(saldoCalculado - oc.saldoPendiente) < 0.01,
      diferencia: saldoCalculado - oc.saldoPendiente,
    });
  });

  // 7. Verificar total general de destajos
  console.log('📊 Verificando totales generales de destajos...\n');
  
  destajosData.forEach((carga) => {
    const totalCalculado = carga.obras.reduce((sum, o) => sum + o.totalObra, 0);
    
    resultados.push({
      nombre: `Total ${carga.semana}`,
      esperado: carga.totalGeneral,
      obtenido: totalCalculado,
      correcto: Math.abs(totalCalculado - carga.totalGeneral) < 0.01,
      diferencia: totalCalculado - carga.totalGeneral,
    });
  });

  return resultados;
}

export function imprimirResultados(resultados: VerificacionResultado[]) {
  console.log('\n' + '='.repeat(80));
  console.log('📋 REPORTE DE VERIFICACIÓN DE INTEGRIDAD DE DATOS');
  console.log('='.repeat(80) + '\n');

  const correctos = resultados.filter(r => r.correcto);
  const incorrectos = resultados.filter(r => !r.correcto);

  console.log(`✅ Verificaciones correctas: ${correctos.length}/${resultados.length}`);
  console.log(`❌ Verificaciones incorrectas: ${incorrectos.length}/${resultados.length}\n`);

  if (incorrectos.length > 0) {
    console.log('❌ ERRORES ENCONTRADOS:\n');
    incorrectos.forEach((r) => {
      console.log(`  ${r.nombre}`);
      console.log(`    Esperado: $${r.esperado.toFixed(2)}`);
      console.log(`    Obtenido: $${r.obtenido.toFixed(2)}`);
      console.log(`    Diferencia: $${r.diferencia?.toFixed(2)}\n`);
    });
  } else {
    console.log('🎉 ¡TODOS LOS DATOS SON CORRECTOS!\n');
    console.log('✅ Totales de OCs por obra: CORRECTO');
    console.log('✅ Totales de destajos por obra: CORRECTO');
    console.log('✅ Totales generales por obra: CORRECTO');
    console.log('✅ Saldos de proveedores: CORRECTO');
    console.log('✅ Pagos vs OCs: CORRECTO');
    console.log('✅ Saldos pendientes de OCs: CORRECTO');
    console.log('✅ Totales de cargas de destajos: CORRECTO\n');
  }

  console.log('='.repeat(80));
  console.log('\n📊 ESTADÍSTICAS GLOBALES:\n');

  const totalOCs = ordenesCompraData.reduce((sum, oc) => sum + oc.total, 0);
  const totalPagado = pagosData.reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = ordenesCompraData.reduce((sum, oc) => sum + oc.saldoPendiente, 0);
  const totalDestajos = destajosData.reduce((sum, c) => sum + c.totalGeneral, 0);
  const totalGastosEmpresas = obrasData.reduce((sum, o) => sum + o.totalExpenses, 0);

  console.log(`  Total OCs emitidas: $${totalOCs.toLocaleString()}`);
  console.log(`  Total pagado: $${totalPagado.toLocaleString()}`);
  console.log(`  Total pendiente de pago: $${totalPendiente.toLocaleString()}`);
  console.log(`  Total destajos: $${totalDestajos.toLocaleString()}`);
  console.log(`  Total gastos empresa: $${totalGastosEmpresas.toLocaleString()}\n`);

  console.log(`  Requisiciones: ${requisicionesData.length}`);
  console.log(`  Órdenes de Compra: ${ordenesCompraData.length}`);
  console.log(`  Pagos registrados: ${pagosData.length}`);
  console.log(`  Cargas de destajos: ${destajosData.length}`);
  console.log(`  Obras activas: ${obrasData.filter(o => o.status === 'Activa').length}\n`);

  console.log('='.repeat(80) + '\n');

  return incorrectos.length === 0;
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  const resultados = verificarIntegridadDatos();
  const todoCorrecto = imprimirResultados(resultados);
  process.exit(todoCorrecto ? 0 : 1);
}
