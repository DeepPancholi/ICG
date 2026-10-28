# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing site for ICG Engineering Solutions (an MEP consultancy). It is plain HTML, CSS and vanilla JS, with no build step, package manager, linter or test suite.

## Running and deploying

- Preview locally by opening `index.html` directly, or serve the folder: `python -m http.server 8000`
- Deployment: every push to `master` triggers `.github/workflows/static.yml`, which uploads the **entire repository root** to GitHub Pages. Anything committed to the repo root gets published, so keep scratch files out of it.

## Architecture

- **Five standalone pages** (`index.html`, `services.html`, `projects.html`, `about.html`, `contact.html`). There are no templates or includes, so the header/nav, mobile menu, and footer are **duplicated in every page**. Changes to shared chrome (nav links, footer, social links, logo, favicon, `<head>` meta) must be made in all five files.
- **One stylesheet**, `css/style.css`, split into numbered sections (`/* ── N. Name ── */`: base/variables, typography, utilities, nav, hero, ..., footer, animations, responsive). Colors, shadows, radii and transitions are CSS custom properties on `:root`; use them instead of hard-coded values. Brand primary is `--color-primary: #148478`. Responsive rules are all in the final section, not next to their components.
- **One script**, `js/script.js`, loaded with `defer` on every page. Everything runs inside a single `DOMContentLoaded` handler as independent feature blocks (`// ── Feature ──`), and each block checks whether its elements exist first, so a page that lacks a feature just skips it. Behaviour is driven by class names and data attributes in the markup:
  - Scroll reveal: add `.fade-in-up`, `.fade-in-left`, `.fade-in-right` or `.scale-in`. The IntersectionObserver adds `.visible` and staggers siblings by 0.1s.
  - Stat counters: `.stat-number` with `data-target` and `data-suffix`.
  - Project filter: `.filter-btn[data-filter]` matches against `.project-card[data-category]` (`all` shows every card).
  - Testimonial slider, FAQ accordion (`.faq-item`/`.faq-question`), back-to-top button, preloader, and active nav link highlighting (matched from the current filename).
  - The `fadeInUp` keyframe used by the project filter is injected from JS at the bottom of the file, not defined in the CSS.
- **Contact form** (`contact.html`, `#contact-form`) posts directly to Formspree (`https://formspree.io/f/mjgqlejq`). `script.js` only validates on the client (required fields, email and phone regex, `.error`/`.success` classes on `.form-group`) and lets the native submit go through when the form is valid.
- Fonts: Inter (body) and Outfit (headings), loaded from Google Fonts. The footer uses `images/logo_dark.png` and the navbar uses `images/logo.png`.
