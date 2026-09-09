# webpersonal

Sitio de **Meliza R. Choc Montes** — traductora jurada e intérprete, Guatemala.

Sitio estático bilingüe (ES / EN), sin build ni dependencias, publicado con GitHub Pages.

- Español: `index.html`
- English: `en/index.html`
- Estilos y scripts compartidos: `assets/`

## Desarrollo

```bash
# Servir desde el directorio padre para reproducir el subpath real de Pages
cd .. && python3 -m http.server 8000
```

- http://localhost:8000/webpersonal/
- http://localhost:8000/webpersonal/en/

## Publicación

Cada push a `main` publica. Trabajar en rama y abrir PR.

Ver `CLAUDE.md` para las convenciones del proyecto (rutas relativas, tokens de color,
duplicación de datos de contacto y el cambio de dominio pendiente).
