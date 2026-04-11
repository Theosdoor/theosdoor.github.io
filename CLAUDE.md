# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

Start a local dev server:
```bash
npm run dev
```

Build: `npm run build` (outputs to `dist/`)

The site is built with Astro and deployed to GitHub Pages via the `.github/workflows/deploy.yml` workflow.

## Architecture

This is a personal website built with Astro, with three routes:

- **`/` (`src/pages/index.astro`)** — Main page with tab-based navigation (Home / Let's chat). The Home panel has a portrait, link cards, and a Publications section. The Chat panel embeds a zcal scheduling iframe.
- **`/cv/` (`src/pages/cv/index.astro`)** — CV viewer: a collapsible sidebar (state persisted via `localStorage`) alongside an `<iframe>` rendering `TheoFarrell_CV.pdf`.
- **`/projects/` (`src/pages/projects/index.astro`)** — Projects page, currently a stub.

### Publications system

Publications are fetched at runtime from `content/pubs.yaml` using the `js-yaml` CDN library. The YAML schema is:
```yaml
owner: "Theo Farrell"   # name to bold in author lists
publications:
  - title: "..."
    authors: [...]
    venue: "..."
    year: 2025
    url: "..."
    link_label: "..."   # optional, defaults to "View paper"
```
To add a publication, edit `content/pubs.yaml` only — no HTML changes needed.

### Design tokens

All colours and fonts are CSS custom properties in `src/styles/global.css`:
- `--ink`, `--parchment`, `--cream`, `--copper`, `--copper-light` — colour palette
- `--serif` (Cormorant Garamond), `--mono` (DM Mono) — typefaces
- `--rule`, `--grid`, `--text-muted` — subtle UI values
