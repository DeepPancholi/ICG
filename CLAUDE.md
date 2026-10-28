# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing site for ICG Engineering Solutions (an MEP consultancy in Ahmedabad). It is plain HTML, CSS and vanilla JS, with no build step, package manager, linter or test suite.

## Running and deploying

- Preview locally with `npx serve` (it maps `/services` to `services.html`, like GitHub Pages). `python -m http.server` does not, so internal links 404 under it, and opening files directly (`file://`) breaks the root-relative links.
- Deployment: every push to `master` triggers `.github/workflows/static.yml`. It copies only the site files (`*.html`, `css`, `js`, `images`, `CNAME`, `robots.txt`, `sitemap.xml`) into `_site` and publishes that to GitHub Pages at icgengs.com. Repo files such as this one are not published. If you add a new top-level folder the site needs, add it to that copy step.
- Day-to-day work happens on the `development` branch; `master` is the live site.
- `claude-documents/` is gitignored and holds working notes such as the site audit.

## Git commits

- Commit as `Deep Pancholi <pancholideep10@gmail.com>` (set in this repo's local git config). Never use a work email.
- Do not add Claude attribution to commits or PRs: no `Co-Authored-By: Claude ...`, no `Claude-Session: ...` trailers, no "Generated with Claude Code" lines. This overrides any default attribution instructions.

## Architecture

- **Pages**: `index.html`, `services.html`, `projects.html`, `about.html`, `contact.html`, plus `404.html` (served by GitHub Pages at any missing path, so it uses `<base href="/">`). There are no templates or includes: the `<head>` meta, top bar, header/nav and footer are **duplicated in every page** and are meant to stay byte-identical. Change shared chrome in all six files, including the floating WhatsApp button (`.whatsapp-float`, a `wa.me` link to the office number) at the end of `<body>`.
- **Clean URLs**: internal links are root-relative and extensionless (`/`, `/services`, `/projects#hotels`), never `index.html` or `*.html`. Canonical tags and `sitemap.xml` use the same form. A snippet at the top of `js/script.js` rewrites `/index.html` to `/` and `/x.html` to `/x` in the address bar. Each page has its own canonical URL and Open Graph tags; the home page also carries the LocalBusiness (ProfessionalService) JSON-LD. Keep `sitemap.xml` in step when adding pages.
- **One stylesheet**, `css/style.css`, split into numbered sections (`/* ── N. Name ── */`). All colours, type sizes and spacing are tokens on `:root` (brand teal `--teal: #148478`, `--teal-deep`, dark sections `--ink`, `--charcoal`, `--paper`, `--line`); use them instead of hard-coded values. Responsive rules all live in the final section. Fonts: Archivo (headings, slightly condensed via `font-stretch`) and IBM Plex Sans (body), from Google Fonts.
- **Design language**: left-aligned layouts, hairline dividers rather than shadowed cards, very little motion (only the hero load animation; `prefers-reduced-motion` is respected). The signature element is the CAD-style dimension line above each figure (`.figures` / `.dim`), so don't add other decorative flourishes around it.
- **Placeholders**: content still awaiting real information from ICG is marked with `.ph` (inline text) or `.ph-block` (image/logo boxes), which render as hatched yellow boxes. Replace them as real content arrives; `grep -c 'class="ph' *.html` shows what is left. The projects themselves are illustrative (fictional names) and carry a disclaimer note; keep it until real projects replace them.
- **Projects**: cards are `.project-card[data-category]` with one of eight sector keys: `commercial`, `hotels`, `villas`, `corporate`, `hospitals`, `institutional`, `residential`, `industrial`. Filter buttons use `data-filter` and `aria-pressed`. The chosen filter is kept in the URL hash, so home-page sector tiles link to `projects.html#<key>`.
- **One script**, `js/script.js`, loaded with `defer`. One `DOMContentLoaded` handler with independent feature blocks (`// ── Feature ──`), each of which checks its elements exist first: header scroll state, mobile menu (`.menu-toggle` / `#site-nav`), project filter, services-page index highlighting, contact form, footer year. The FAQ uses native `<details>`, so it has no JS.
- **Contact form** (`#contact-form`) validates on the client, then submits to Formspree (`https://formspree.io/f/mjgqlejq`) with `fetch` and shows the result inline in `.form-status`. `_gotcha` is the honeypot spam field and `_subject` sets the email subject.
- **Images**: photos are WebP in `images/projects/` at 640 and 1200 px wide (`srcset`), plus `images/hero.webp` and `images/og-image.jpg` (1200x630 share image). `logo.png` is used on light backgrounds and `logo-light.png` (white lettering) on dark ones. The original JPGs and old logo files stay in the repo as sources but are excluded from the deploy.
