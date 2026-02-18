import { test, expect } from '@playwright/test';

const routes = [
  '/dashboard',
  '/dashboard/obras',
  '/compras/ordenes',
  '/compras/proveedores',
  '/pagos/programacion',
  '/requisiciones',
  '/destajos/catalogo',
  '/destajos/captura',
];

test.describe('mvp-routes-screenshots', () => {
  for (const route of routes) {
    test(`capture ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${route.replaceAll('/', '_') || 'home'}.png`, {
        fullPage: true,
      });
    });
  }
});
