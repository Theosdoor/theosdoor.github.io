# AGENTS.md

## Development

```bash
pnpm dev      # local dev server
pnpm build    # outputs to dist/
```

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Architecture

Astro static site (`output: 'static'`) with three routes:

- **`/`** (`src/pages/index.astro`) — single-page with three tab panels: Home, Projects, Let's chat
- **`/cv/`** (`src/pages/cv/index.astro`) — collapsible sidebar + PDF iframe; sidebar state persisted in `localStorage`
- **`/projects/`** (`src/pages/projects/index.astro`) — standalone projects page (same `Projects` component, with `urlSync` enabled)

### Tab navigation

`src/components/TabNav.astro` handles all tab switching via vanilla JS. Tabs map to URL hashes (`#projects`, `#chat`; home has no hash). Hash ↔ panel ID mapping lives in `panelFromHash` / `hashFromPanel`. Browser back/forward is supported via `popstate`.

### Data-driven content

Both publications and projects are loaded at **build time** from YAML via `@rollup/plugin-yaml` — no runtime fetching.

**Publications** — `content/pubs.yaml`, rendered by `src/components/Publications.astro`:
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

**Projects** — `content/projects.yaml`, rendered by `src/components/Projects.astro`:
```yaml
projects:
  - title: "..."
    description: "..."
    url: "..."           # optional
    image: "..."         # optional; .mp4/.gif renders as <video>, otherwise <img>
    role: lead | contributor
    category: research | side-project | coursework
    featured: true       # optional; controls "Highlighted" group in default sort
    year: 2025           # optional
    languages: [...]     # optional; drives filter chips
    tools: [...]         # optional; drives filter chips
```

The `Projects` component contains all filter/sort/search logic in client-side JS. Filters (role, category, language, tool) and sort order are reflected in the URL when `urlSync={true}` (used on `/projects/`).

### Styling

CSS is split into focused files — keep each file under ~300 lines. `global.css` is the import index; add new stylesheets there. The CV page imports `cv.css` directly instead of `global.css`.

| File | Contents |
|------|----------|
| `tokens.css` | CSS custom properties + box-sizing reset |
| `base.css` | html/body, layout wrappers, a11y, animations, media queries |
| `home.css` | identity, cards, publications, tabs, chat embed, footer |
| `projects.css` | all `proj-*` styles |
| `global.css` | import index only — `@import` the above four |
| `cv.css` | CV page only |

Tailwind is available (via `@tailwindcss/vite`) but the site primarily uses hand-written CSS with the design tokens below.

### Design tokens

All in `src/styles/tokens.css`:
- `--ink`, `--parchment`, `--cream`, `--copper`, `--copper-light` — colour palette
- `--serif` (Cormorant Garamond), `--mono` (DM Mono) — typefaces
- `--rule`, `--grid`, `--text-muted` — subtle UI values
- `--focus-ring`, `--focus-offset` — keyboard focus styles

### Layout constraints

- `.page-wrap` — max-width `560px`, centred; used for prose/card content on the home panel
- `.proj-page-wrap` — max-width `960px`, centred; used for the projects grid
- `.zcal-wrap` — max-width `900px`, centred; sits outside `.page-wrap` so the booking widget isn't artificially narrowed

### Astro script notes

External third-party scripts (e.g. the zcal embed) must use `is:inline` to prevent Astro's bundler from mangling them:
```astro
<script is:inline type="text/javascript" async src="..."></script>
```
