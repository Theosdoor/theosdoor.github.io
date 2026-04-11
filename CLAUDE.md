# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

Start a local dev server:
```bash
npx serve
```

No build step — the site is static HTML/CSS/JS deployed directly to GitHub Pages.

## Architecture

This is a single-page personal website with two routes:

- **`/` (`index.html`)** — Main page with tab-based navigation (Home / Let's chat). The Home panel has a portrait, link cards, and a Publications section. The Chat panel embeds a zcal scheduling iframe.
- **`/resume/` (`resume/index.html`)** — CV viewer: a collapsible sidebar (state persisted via `localStorage`) alongside an `<iframe>` rendering `resume/TheoFarrell_CV.pdf`.

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

All colours and fonts are CSS custom properties in `style.css`:
- `--ink`, `--parchment`, `--cream`, `--copper`, `--copper-light` — colour palette
- `--serif` (Cormorant Garamond), `--mono` (DM Mono) — typefaces
- `--rule`, `--grid`, `--text-muted` — subtle UI values

The resume page has its own `resume/styles.css` with separate (but visually consistent) tokens.
