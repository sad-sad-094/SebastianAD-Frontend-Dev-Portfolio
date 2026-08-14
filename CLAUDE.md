# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio for Sebastian Aguirre Duque, a frontend developer. This is a zero-dependency, vanilla HTML/CSS/JS static site — no build step, no package manager, no framework.

## Running the site

Open `index.html` directly in a browser, or use any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Since `js/main.js` and `js/i18n/*.js` use ES module `import`/`export`, opening `index.html` via `file://` will fail to load the script in some browsers (CORS on module imports) — prefer a local server.

## Deployment

- Deployed on **Cloudflare** via `wrangler.jsonc`, which serves the repo root (`.`) directly as static assets — no build step in the deploy pipeline either.
- `<head>` in `index.html` has explicit `TODO` comments marking the canonical URL, `og:url`, and the JSON-LD `@id`/`url` fields (currently a placeholder domain `https://sebastianaguirreduque.dev/`) — update all of these together once the real production domain is confirmed.

## Architecture

- `index.html` — single-page document with all sections as semantic landmarks (`<section id="...">`)
- `css/styles.css` — all styles, organized top-to-bottom as: custom properties → reset → layout → components → sections → responsive overrides
- `js/main.js` — initializes i18n and handles the mobile hamburger menu toggle
- `js/i18n/` — vanilla i18n module (no library):
  - `i18n.js` — `initI18n()` picks the language (localStorage `portfolio-lang` → browser language → `es` default), then swaps text via `data-i18n` (textContent), `data-i18n-html` (innerHTML), `data-i18n-aria` (aria-label), `data-i18n-content` (content attr, for meta tags), and `data-i18n-href` (href attr, e.g. swapping the CV PDF link per language). The `[data-lang-toggle]` button(s) in the nav (desktop + mobile) switch languages and persist the choice.
  - `es.js` / `en.js` — flat key→string dictionaries consumed by `i18n.js`, both currently 153 lines and must stay in sync key-for-key
  - When adding new translatable text in `index.html`, add the matching key to **both** `es.js` and `en.js` and wire the element with the appropriate `data-i18n*` attribute. Default/fallback language is Spanish (`es`); `<html lang>` is updated at runtime to match the active language.
- `assets/` — favicon, wordmark logo, and two CV PDFs (`Curriculum_Sebastian-Aguirre-Duque.pdf` for ES, `_en.pdf` for EN — linked via `data-i18n-href` in the About section)
- `wrangler.jsonc` — Cloudflare deploy config (static assets, no build)
- `README.md` — GitHub-facing profile README (skills badges, open-source project write-ups); not consumed by the site itself

**CSS design system** lives entirely in `:root` custom properties at the top of `styles.css`: color palette, typography scale (using `clamp()` for fluid sizing), spacing scale, border radii, borders, and transitions. All component styles consume these tokens — do not hardcode values.

- Border radii: `--radius-sm` (4px) → `--radius-full` (100px)
- Transitions: `--transition-fast` (150ms), `--transition-base` (250ms)
- Safe-area insets (`--safe-area-*`) wrap `env(safe-area-inset-*)` for notch/home-bar devices, used on `.nav`, `.nav__mobile-menu`, `.container`, `.footer` — relies on `viewport-fit=cover` in the meta viewport tag

**Responsive strategy**: mobile-first. Base styles target mobile; `@media (min-width: ...)` breakpoints layer in larger-screen overrides. The main breakpoints used are `540px`, `768px`, `900px`, and `1024px`.

**BEM naming** is used throughout: `.block__element--modifier` (e.g., `.nav__link`, `.service-card__title`, `.step__circle--accent`). Section IDs and CSS classes are English (`services`, `process`, `contact`, etc.) — an earlier refactor renamed them from Spanish, even though the visible copy defaults to Spanish.

## Sections (in DOM order)

`hero` → `services` → `about` → `projects` → `stack` → `process` → `contact` → `footer`

All sections use `.container` for max-width centering. Section headings use `section-label` (uppercase small label), `h2` (main title), and optional subtitle pattern.

- **hero** — headline, availability badge, primary/secondary CTAs, quick stats (years of experience, stack, languages)
- **services** — service offering cards (see `services__title` / `service-card` in HTML)
- **about** — bio + CV download link (`data-i18n-href` swaps PDF by language)
- **projects** — `project-card` (featured, e.g. Pandora), `project-mini` (grid items), and a `project-coming` teaser card. Adding a project means duplicating the relevant markup block and adding i18n keys for any translated copy
- **stack** — technical stack / approach breakdown
- **process** — the 5-step engagement process (also mirrored in the FAQPage JSON-LD below)
- **contact** — WhatsApp CTA, social links (GitHub, LinkedIn, email via `mailto:`)
- **footer** — brand name, copyright year, footer nav links

## Key design decisions

- **Dark sections** (`stack`, `process`, `contact`, `footer`) use navy/dark background tokens (`--color-navy`, `--color-dark`). Light sections (`hero`, `services`, `about`, `projects`) use `--color-bg` (`#F5F4F0`).
- **Accent color** is `#4D55CC` (indigo). Used sparingly for `.accent` text spans, `tag--accent` tags, and CTAs.
- **Fonts**: Fraunces (serif, headings) + Inter (sans-serif, body). Both loaded via Google Fonts in `<head>` (and imported again at the top of `styles.css` — keep both in sync if the font choice changes).
- The WhatsApp CTA (`https://wa.me/573506487868`) appears in **four** places: nav, mobile menu, services banner, and contact section — update all four if the number changes. The same number also appears in the JSON-LD (`telephone`, `availableChannel.serviceUrl`) — update there too.
- Contact email `sadw621@gmail.com` appears in the contact section `mailto:` link and in the JSON-LD `Person.email` — keep in sync if it changes.

## SEO / AEO (structured data)

A single `<script type="application/ld+json">` at the end of `<body>` defines a `@graph` with four entities:

- `Person` — bio, contact info, `knowsAbout` (skills list), `knowsLanguage`
- `WebSite` — site metadata, links back to the `Person` as author
- `ProfessionalService` — service offerings and `areaServed`
- `FAQPage` — Q&A content targeting AEO (answer-engine optimization); keep this in sync with the visible `services` and `process` section copy if either changes, since they describe the same offerings

Also present: Open Graph and Twitter Card meta tags in `<head>`, and a `<meta name="description">` tag wired to `data-i18n-content` so it translates with the rest of the page.

## Contact / ownership

- Owner: Sebastian Aguirre Duque — `sadw621@gmail.com`
- GitHub: `https://github.com/sad-sad-094` (repo: `sad-sad-094/SebastianAD-Frontend-Dev-Portfolio`)
- LinkedIn: `https://www.linkedin.com/in/sebastian-aguirre-duque-05b9b082`
