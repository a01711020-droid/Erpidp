import { readFileSync } from "node:fs";

const checks = [
  { file: "src/ui/PurchaseOrderManagementView.tsx", mustInclude: ["renderFull", 'viewState === "data"'] },
  { file: "src/ui/MaterialRequisitionsView.tsx", mustInclude: ["renderFull", 'viewState === "data"'] },
  { file: "src/ui/DestajosView.tsx", mustInclude: ["renderFull", 'viewState === "data"'] },
  { file: "src/ui/PaymentManagementView.tsx", mustInclude: ["renderFull", 'viewState === "data"'] },
  { file: "src/ui/SupplierManagementView.tsx", mustInclude: ["renderFull"] },
];

const errors = [];
for (const c of checks) {
  const txt = readFileSync(new URL(`../${c.file}`, import.meta.url), "utf8");
  for (const token of c.mustInclude) {
    if (!txt.includes(token)) {
      errors.push(`${c.file} missing token: ${token}`);
    }
  }
}

if (errors.length) {
  console.error("audit:full-coverage failed");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log("audit:full-coverage passed");
