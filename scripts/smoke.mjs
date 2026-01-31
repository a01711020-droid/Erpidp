const apiUrl = process.env.VITE_API_URL;

if (!apiUrl) {
  console.error("VITE_API_URL is not set. Export it before running smoke tests.");
  process.exit(1);
}

const endpoints = [
  { name: "health", url: `${apiUrl}/health` },
  { name: "proveedores", url: `${apiUrl}/proveedores` },
];

const run = async () => {
  for (const endpoint of endpoints) {
    const response = await fetch(endpoint.url);
    if (!response.ok) {
      throw new Error(`${endpoint.name} failed: ${response.status} ${response.statusText}`);
    }
  }
  console.log("Smoke checks OK");
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
