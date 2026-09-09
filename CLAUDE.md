# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual static marketing site for **Meliza R. Choc Montes**, a sworn translator and interpreter
(traductora jurada e intérprete) in Guatemala City. Its single job is lead generation: get found in
search and get the visitor into a WhatsApp conversation.

- `index.html` — Spanish (primary)
- `en/index.html` — English

There is **no build step, no package manager, no framework**. Deploy = push to `main`; GitHub Pages
serves the repo root.

## Running it

```bash
# Serve from the PARENT directory so the site sits at /webpersonal/,
# reproducing the real GitHub Pages subpath.
cd .. && python3 -m http.server 8000
# → http://localhost:8000/webpersonal/  and  /webpersonal/en/
```

Opening `index.html` via `file://` works too, but it will not catch subpath bugs.

## Architecture

`assets/css/styles.css` and `assets/js/main.js` are **shared by both language pages**. A style or
behavior change must be made once and verified on both.

- **Rutas relativas, siempre.** `assets/…` from the root, `../assets/…` from `en/`. The site is served
  at `/webpersonal/` today and at an apex domain later; root-absolute paths (`/assets/…`) break the
  first case. The only absolute URLs live in `<link rel="canonical">`, `og:url`, `hreflang`,
  `sitemap.xml`, `robots.txt`, the JSON-LD, and the home link in `404.html`.
- **CSS blocks mirror DOM order** (`/* --- NAV --- */`, HERO, SERVICIOS, SOBRE MÍ, PORTAFOLIO,
  CURRÍCULUM, CONTACTO, FOOTER). Add styles to the matching block.
- **Design tokens in `:root`.** Use them instead of literal hex.
- **Mobile overrides** go immediately after the desktop rule they modify, not collected at the bottom.
  Breakpoints: 860px (grids collapse, burger appears), 720px, 480px.
- **Section `id`s are shared across languages** (`sobre-mi`, `portafolio`, `curriculum`, `contacto`) so
  the CSS and JS stay identical. Only the visible link text is translated.
- **The seal** is a hand-built inline SVG in the hero. It is the site's signature element and the
  source for `favicon.svg` and `og-image.png`. Treat changes to it as a design decision.

### Three colors of olive

`--olive` `#A79B6E` fails WCAG AA as text (2.53:1 on cream). Do not use it for text:

| Token | Use |
|---|---|
| `--olive` | borders and rules only — decorative, no contrast requirement |
| `--olive-ink` `#7D7145` | text on light backgrounds (4.65:1 on cream) |
| `--olive-light` `#B5A87C` | text on `--maroon-deep` (4.98:1) |

### JavaScript

`assets/js/main.js` only does: footer year, burger menu (keeping `aria-expanded` in sync, closing on
link click / Escape / resize to desktop). No libraries. **There is no contact form and no backend** —
WhatsApp is the only conversion channel by design.

## Contact details are duplicated

Phone `wa.me/50255612435` appears **6 times per page** (nav CTA, mobile menu CTA, hero button, contact
list, contact CTA block, floating button) and the email twice. Update every occurrence in **both**
languages together. Grep before declaring it done.

## The English page is a work sample

The site is the portfolio of an ES↔EN translator, so its English copy is itself a demonstration of her
work. Never publish machine-translated or unreviewed English. Draft it, mark it, and route it to
Meliza for approval — `en/index.html` carries a comment block listing the terminology choices awaiting
her confirmation.

## Deploying / changing the domain

Pages is set to *Deploy from a branch* → `main` → `/ (root)`. Every push to `main` is a production
release, so work on a branch and open a PR.

When the custom domain is bought, swap the absolute URL in exactly these places, add a `CNAME` file at
the root, point DNS at GitHub, and enable *Enforce HTTPS*:
`index.html` and `en/index.html` (canonical, `og:url`, 3× `hreflang`, JSON-LD `url`), `sitemap.xml`,
`robots.txt`, `404.html`. Relative paths need no changes.
