# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio for Sebastian Aguirre Duque, a frontend developer. This is a zero-dependency, vanilla HTML/CSS/JS static site — no build step, no package manager, no framework.

The current design ("Ficha técnica") comes from a prototype + development guide kept outside the repo (`../design/New Design/GUIA-DESARROLLO_1.md`). That guide is the source of truth for tokens, type scale, motion and layout rules.

## Running the site

Use any static file server (ES module imports fail over `file://` in some browsers):

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Deployment

- Deployed on **Cloudflare** via `wrangler.jsonc`, which serves the repo root (`.`) directly as static assets — no build step. Cloudflare's default HTML handling serves `servicios.html` at `/servicios`.
- Both pages' `<head>` have `TODO` comments marking the canonical URL, `og:url`, `og:image`/`twitter:image`, and the JSON-LD `@id`/`url` fields (placeholder domain `https://sebastianaguirreduque.dev/`) — update all of them together once the real domain is confirmed.

## Two pages, two audiences

| File | Route | Audience | Sections (DOM order) |
|---|---|---|---|
| `index.html` | `/` | Recruiters / tech teams | hero → `work` 01 → `experience` 02 → `approach` 03 → `stack` 04 → `contact` 05 → footer |
| `servicios.html` | `/servicios` | SMBs / agencies (freelance) | hero → `clients` 01 → `build` 02 → `process` 03 → `limits` 04 → `contact` 05 → footer |

**Rule that does not break:** no vendor language (budget, timeline, "hire me") on `/`; no candidate language (CV, job availability) on `/servicios`. The link between the two lives in the **footer**, never the main menu.

## Architecture

- `css/styles.css` — the whole design system, shared by both pages: tokens → base → a11y → grid/HUD → nav → section structure → components → services-page components → `sm`/`md`/`lg` layers → reduced motion.
- `js/main.js` — theme toggle, mobile menu, screenshot-frame placeholder (`.media[data-placeholder]`, currently unused), nav border on scroll, `.rv` scroll reveal, HUD, footer year, then `initI18n()`. Shared by both pages; every feature no-ops if its elements are absent.
- Each page has a tiny **inline script in `<head>`** that applies the saved theme (`localStorage['sad-theme']`, else `prefers-color-scheme`) before first paint. Keep it there — moving it into `main.js` causes a light flash.
- `js/i18n/` — vanilla i18n (no library):
  - `i18n.js` — `initI18n()` picks the language (localStorage `portfolio-lang` → browser language → `es`), then swaps `data-i18n` (textContent), `data-i18n-html` (innerHTML), `data-i18n-aria`, `data-i18n-alt`, `data-i18n-content` (meta tags), `data-i18n-href` (CV PDF per language). `[data-lang-toggle]` switches language. Exports `t(key)` and dispatches a `langchange` event (the HUD listens to it).
  - `es.js` / `en.js` — flat dictionaries, **must stay in sync key-for-key**. Keys are prefixed `common.*` (both pages), `home.*` (index), `svc.*` (servicios). New visible or meta copy needs a key in both files.
- `assets/` — favicon, wordmark logo, CV PDFs (ES / `_en`), `img/jobportal.webp`, `img/pandora.webp` (case screenshots).
- `og/` — social preview card templates (`og-home.html`, `og-servicios.html`, shared `og-card.css`). Run `bash og/render.sh` after editing them to regenerate `assets/og-home.jpg` / `assets/og-servicios.jpg` (1200×630, needs python3 + Pillow + firefox). Both pages reference them via absolute `og:image` / `twitter:image` URLs on the placeholder domain.

## Design system (see `:root` in styles.css)

- **Tokens:** `--bg --surface --surface-2 --ink --muted --faint --line --line-soft --line-strong --accent --accent-soft --deep`, redefined under `html[data-theme="dark"]`. Dark-band colors are `--band-*` tokens. Don't hardcode values in components.
- **`--faint` is at 4.84:1 contrast — do not lighten it.**
- **Label size floor:** mono labels/meta use `--fs-label` (`.6875rem` = 11px). Nothing functional goes below it (deliberate deviation from the guide's .62–.68rem).
- **Fonts:** Instrument Serif (`--serif`: h1–h3, spec values/figures), Inter (`--sans`: running text), JetBrains Mono (`--mono`: labels, chips, section numbers, HUD, and the contact email/phone — mono keeps `1`/`l` unambiguous, which the serif did not). Loaded via `<link>` in each page head — keep both pages in sync.
- **Italic is the only emphasis and is always `--accent`** (`em`). Section h2s are two lines split by `<br>`: roman, then italic.
- **No `border-radius`** except the round icon buttons in the nav. Square corners are intentional.
- Class names follow the prototype (`.case`, `.field`, `.srow`, `.tier`, `.chip`, `.track`, `.step`…), not BEM. Section IDs stay English.

**Mobile first, strictly.** Base = phone. Layers: `sm` 640px, `md` 768px (`--pad` 20→40px, grid, `+` marks, HUD, two-column tables), `lg` 900px (three-column grids), `xl` 1100px (full horizontal menu — below it the full-name brand + links don't fit, so the hamburger stays; on `/servicios` the "← Portafolio" link only shows from 1280px). **There must be no `max-width` media query** — if you need one, the style belongs in the base.

### Signature pieces (don't lose them)

- **Vertical grid:** `.rules` (fixed) on body; every dark section (`.band`) carries its own `.bandrules` copy because the band covers the fixed grid.
- **Section heads:** `.sechead` with `.secnum` 01–05 + `.secname` + `.secrule`. Numbers must match the nav `data-n` / mobile-menu `<i>`. The HUD derives its numbers/names from these heads automatically.
- **`+` marks** on each section's top edge (`.plus.tl` / `.plus.tr`).
- **HUD** bottom-right, updates via IntersectionObserver at viewport center.

### Motion

Two curves only: `--ease-out` (`cubic-bezier(.22,1,.36,1)`) and `--ease-ping` (availability dot). Hero headline lines rise from an `overflow:hidden` mask (`h1 .ln > span`, start at `translateY(105%)`); `.hsub/.hcta/.spec` fade in and **start at `opacity:0`**. Everything else uses `.rv` (reveal once, then unobserve). **Any new motion must also be undone in the `prefers-reduced-motion` block.**

## Contact data — keep in sync

- WhatsApp `https://wa.me/573506487868`: `/` contact section (small "Prefer WhatsApp?" line); `/servicios` contact section (big number + solid button); `servicios.html` JSON-LD (`telephone`, `availableChannel.serviceUrl`); `index.html` JSON-LD `Person.telephone`.
- Email `sadw621@gmail.com`: both contact sections + both JSON-LD blocks.

## SEO / AEO (structured data)

- `index.html` JSON-LD: `Person` (+ `knowsAbout` mirroring the Stack section) and `WebSite`.
- `servicios.html` JSON-LD: `ProfessionalService` and `FAQPage`, referencing the Person by `@id`. **The FAQ mirrors the visible services, clients, process and limits copy — keep it in sync when that copy changes.**
- Each page has its own `<title>`, meta description, Open Graph and Twitter tags, all translated via `data-i18n-content`.

## Contact / ownership

- Owner: Sebastian Aguirre Duque — `sadw621@gmail.com`
- GitHub: `https://github.com/sad-sad-094` (repo: `sad-sad-094/SebastianAD-Frontend-Dev-Portfolio`); Pandora repo: `https://github.com/PandoraSuite/pandora-admin`
- LinkedIn: `https://www.linkedin.com/in/sebastian-aguirre-duque-05b9b082`
