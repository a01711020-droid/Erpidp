# DEPLOY NOTES (SPA + Router)

Para que React Router funcione con refresh (`F5`) y rutas profundas en hosting estático,
el servidor debe devolver `index.html` para cualquier ruta no encontrada.

## Netlify / static hosting compatible
En `frontend/public/_redirects` debe existir un **archivo** (no carpeta) con:

```txt
/*    /index.html   200
```

Sin esto, al abrir una ruta profunda como `/proveedores` o al recargar, el servidor responde 404.
