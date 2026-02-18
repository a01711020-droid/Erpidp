# TESTING (Frontend Fase 1)

## Capturas con Playwright (local)

```bash
cd frontend
npm install
npx playwright install
npm run test:screenshots
```

## Notas

- `npx playwright install` es prerrequisito: si no está instalado el browser, el comando de screenshots falla.
- El workflow de CI en PR ejecuta screenshots y sube artifacts (`playwright-report/`, `test-results/`, `screenshots/`).
