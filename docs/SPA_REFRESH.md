# SPA Refresh / Deep Links

## Netlify
Se añadió `public/_redirects` con:

```txt
/* /index.html 200
```

## Vercel
Usar `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Render / Nginx
Configurar fallback para rutas no estáticas hacia `/index.html`.
