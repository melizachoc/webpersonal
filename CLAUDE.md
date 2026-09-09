# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual static marketing site for **Meliza R. Choc Montes**, a sworn translator and interpreter
(traductora jurada e intérprete) in Guatemala City. Its single job is lead generation: get found in
search and get the visitor into a WhatsApp conversation.

- `index.html` — Spanish (primary)
- `en/index.html` — English

Live at **https://melizachoc.github.io/webpersonal/** (custom domain pending).

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

## Contact details are duplicated — count them before editing

There is no template, so the phone and email are repeated across both pages. The phone appears in
**three different formats**, which is what makes a find-and-replace miss occurrences.

| What | Format | Per page |
|---|---|---|
| WhatsApp links | `wa.me/50255612435` | 6 — nav CTA, mobile-menu CTA, hero button, contact list, contact CTA block, floating button |
| Visible phone text | `(502) 5561-2435` | 1 |
| JSON-LD `telephone` | `+502-5561-2435` | 1 |
| Email | `melizachocm@gmail.com` | 5 — contact list (href + text), CTA note (href + text), JSON-LD |

Times two languages, a phone change touches **16 places** and an email change **10**. Verify with a
grep for each format, in both files, before calling it done.

## The English page is a work sample

The site is the portfolio of an ES↔EN translator, so its English copy is itself a demonstration of her
work. **Never publish machine-translated or unreviewed English.** Any change to `en/index.html` copy —
including a one-word tweak — goes to Meliza for approval before it ships.

The workflow when English copy is in draft: mark the block with an HTML comment listing the
terminology choices awaiting her decision, add `<meta name="robots" content="noindex">` to the page,
and drop its `<url>` entry from `sitemap.xml` so an unreviewed translation cannot be indexed. On
approval, reverse all three. The current English text was approved on 2026-09-09; the terminology she
signed off on includes "sworn translator", "certificate of completed coursework" (cierre de pénsum)
and "police clearance certificate" (antecedentes).

## Regenerating the seal-derived images

`favicon.svg` is hand-written and shipped as-is. `og-image.png` (1200×630) and `apple-touch-icon.png`
(180×180) are rendered from the sources in `assets/img/src/`. Keep those sources in sync with the seal.

The only renderer assumed present on macOS is `qlmanage`, and it has two traps worth knowing before
you fight it:

- **It scales to the *shorter* dimension and crops the rest.** Rendering a 1200×630 SVG directly gives
  a zoomed, cropped image. That is why `src/og-image.svg` is a **1200×1200 square** with the real
  design placed in a `translate(0,285)` band — render the square, then crop the middle 630 rows.
- **It renders unreliably at small sizes.** `apple-touch-icon.svg` is authored at 720×720 and
  downscaled, not authored at 180.

```bash
SP=$(mktemp -d)
qlmanage -t -s 1200 -o "$SP" assets/img/src/og-image.svg
sips -c 630 1200 "$SP/og-image.svg.png" --out assets/img/og-image.png       # crop to 1200x630

qlmanage -t -s 720 -o "$SP" assets/img/src/apple-touch-icon.svg
sips -z 180 180 "$SP/apple-touch-icon.svg.png" --out assets/img/apple-touch-icon.png
```

Always open the result and look at it — both traps produce a *valid* PNG of the wrong thing. Fonts are
system fallbacks (Georgia, Helvetica), not the web fonts, since the renderer has no network.

## Deploying / changing the domain

Pages is set to *Deploy from a branch* → `main` → `/ (root)`, HTTPS enforced. Every push to `main` is a
production release, so work on a branch and open a PR.

**Changing Pages settings requires repo admin, which only Meliza (`melizachoc`) has.** Collaborators
have push but not admin, so anything under Settings → Pages has to go through her.

After a merge, Pages takes ~30-60s to rebuild. Confirm the deploy actually shipped rather than assuming:

```bash
gh api repos/melizachoc/webpersonal/pages/builds/latest \
  --jq '{status, commit: .commit[0:7], error: .error.message}'
```

`status: built` with the commit you expect. A green merge is not a deploy — this repo has already been
live on a stale commit once, serving an outdated phone number.

When the custom domain is bought, swap the absolute URL in exactly these places, add a `CNAME` file at
the root, point DNS at GitHub, and enable *Enforce HTTPS*:
`index.html` and `en/index.html` (canonical, `og:url`, 3× `hreflang`, JSON-LD `url`), `sitemap.xml`,
`robots.txt`, `404.html`. Relative paths need no changes.
