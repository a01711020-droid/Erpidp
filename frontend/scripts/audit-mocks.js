import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "src");

const patterns = [
  { name: "spec-imports", regex: /@\/spec|\/spec\//g },
  {
    name: "mock-markers",
    regex: /mockData|weeklyExpenses|WORKS_DATA|SUPPLIERS_DATA|BUYERS_DATA|CEMEX|LEVINSON|destajistasMock|obrasMock|resumenObrasMock|purchaseOrdersPaymentMock|requisitionsMock/g,
  },
  { name: "mock-ids", regex: /IDs y valores de referencia para los datos mock|OBRA_CASTELLO|PROVEEDOR_IDS|REQUISICION_IDS|ORDEN_COMPRA_IDS|PAGO_IDS|DESTAJO_IDS|USUARIO_IDS/g },
  { name: "uuid-samples", regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g },
];

const files = [];
function walk(dir) {
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx)$/.test(item)) files.push(full);
  }
}

walk(root);

const violations = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const p of patterns) {
    if (p.regex.test(text)) {
      violations.push({ file, rule: p.name });
      p.regex.lastIndex = 0;
    }
  }
}

if (violations.length > 0) {
  console.error("Mock/spec violations found:");
  for (const v of violations) console.error(`- ${v.rule}: ${v.file}`);
  process.exit(1);
}

console.log("audit:mocks passed (0 violations)");
