# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two confirmed audiences, both technical hiring stakeholders rather than non-technical business owners:

- **Tech leads / agency owners** sourcing an external frontend contractor to augment a team or cover a specific project (site build, web app, migration/redesign).
- **Recruiters / hiring managers** evaluating Sebastian for a permanent or long-term full-time frontend role.

Both are assessing technical credibility and working style before a conversation, not comparison-shopping on price. The site's contact paths (WhatsApp, email) and process walkthrough serve the contractor audience most directly; the recruiter audience reads the same evidence (stack depth, architecture principles, project writeups) as a credibility signal for a hire, not a project intake.

## Product Purpose

A personal portfolio/landing site for Sebastian Aguirre Duque, a frontend developer, that converts a technical visitor's evaluation into a direct conversation (WhatsApp or email) — whether that conversation leads to a contract engagement or a full-time hire.

## Positioning

Two combined claims a generic freelance-frontend-dev site does not make together:

1. **Technical depth over generic "I build websites" framing** — Vue/React component architecture, SOLID, and Clean Architecture applied specifically at the frontend layer (not process/methodology theater).
2. **Process transparency and predictability** — a named 5-step engagement (discovery → proposal → design approval → development → delivery & support) with scope/budget confirmed in writing before commitment, no last-minute surprises.

Neither claim alone differentiates from every other portfolio; the combination — architectural rigor *and* a predictable, written engagement process — is the position.

## Operating Context

- Visitors arrive cold (search, referral, shared link) and self-serve through the page before any conversation starts — there is no gated content or funnel step before contact.
- Primary conversion actions are WhatsApp (`https://wa.me/573506487868`) and email (`mailto:sadw621@gmail.com`); both must stay reachable and consistent across every place they appear (nav, mobile menu, services banner, contact section, JSON-LD).
- CV download (PDF, ES/EN variants) is a secondary, lower-friction credential check for the recruiter audience.
- Site is bilingual (ES default, EN toggle) — every visible claim must exist in both `es.js` and `en.js`.

## Capabilities and Constraints

- Zero-dependency static site: no build step, no framework, no package manager. Deployed to Cloudflare via `wrangler.jsonc` serving the repo root directly.
- i18n is a hand-rolled vanilla module (`js/i18n/`), not a library — new copy requires matching keys in both language dictionaries.
- No backend, no CMS, no analytics/lead-capture mechanism currently — contact happens entirely off-site (WhatsApp/email), so the page itself cannot report or gate on conversion.
- Domain is currently a placeholder (`https://sebastianaguirreduque.dev/`) pending confirmation — canonical URL, `og:url`, and JSON-LD `@id`/`url` are marked with TODOs in `index.html`.

## Brand Commitments

- Name: Sebastian Aguirre Duque. Contact: `sadw621@gmail.com`, WhatsApp `+57 350 648 7868`.
- GitHub: `github.com/sad-sad-094`. LinkedIn: `linkedin.com/in/sebastian-aguirre-duque-05b9b082`.
- Accent color `#4D55CC` (indigo), Fraunces (serif/headings) + Inter (sans/body) are existing, established brand choices from the current implementation — carried here as fact, not re-opened as a design decision.

## Evidence on Hand

- **Pandora** — real, open-source project (Vue 3, TypeScript, Pinia, Clean Architecture admin panel for API key/quota management). The one project with citable, verifiable specifics (JWT auth, quota management, service monitoring, dark/light mode) and a public repo.
- **"Cliente — por revelar"** — a real, NDA'd client project (HTML/CSS presentation site). Real work, but the client identity must stay masked; do not name or imply who it is.
- A job-portal project (Node/Express + PostgreSQL API consumed by a Vue frontend) is referenced in copy but has no public link.
- **No testimonials or case-study quotes exist yet.** Future work must not invent, imply, or draft placeholder testimonials, client logos, or quoted feedback — this is a stated absence, not an oversight.
- Certifications and education listed in `README.md` (GitHub profile page, separate from the live site) are real and dated.

## Product Principles

1. **Every claim must be one Sebastian can back up in a follow-up conversation.** No invented metrics, client counts, or generic "10+ projects delivered" filler — the site's credibility rests on Pandora and the process description being concretely true.
2. **Serve both audiences without splitting the page.** Contractor-hiring and full-time-hiring visitors read the same evidence differently; don't build a mode-switcher — keep the copy true for both readings simultaneously.
3. **The written process is itself a proof point.** Because visitors are technical evaluators, describing *how* Sebastian works (predictable, communicative, scoped in writing) carries as much weight as *what* he's built — preserve the 5-step process content and its match with the FAQPage JSON-LD.
4. **Bilingual parity is non-negotiable.** No visible or meta copy ships in only one language.
5. **Placeholder facts stay visibly provisional, not silently shipped.** The domain TODOs are known-incomplete and should be resolved together, not patched individually, once the real domain is confirmed.

## Accessibility & Inclusion

No product-specific accessibility requirement was established beyond the existing implementation (semantic landmarks, `aria-label`s, safe-area insets for notch devices). No additional standard (e.g. WCAG level) was confirmed as a target.
