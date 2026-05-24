# AGENTS.md

@/Users/Subspace_Explorer/.codex/RTK.md

## Development

This is a pnpm-managed Astro + Tailwind v4 static site. Use Node `>=24.x` and keep `pnpm-lock.yaml` as the single lockfile.

```bash
pnpm install
pnpm exec astro check # TypeScript/Astro type-check
pnpm test             # design-system and regression checks
pnpm build            # outputs to dist/
pnpm dev              # local dev server
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

Tailwind v4 is the primary styling layer. `src/layouts/Base.astro` imports `src/styles/global.css` once for every route; components and pages should prefer semantic Tailwind utilities rather than new route-level stylesheets.

| File | Contents |
|------|----------|
| `global.css` | Tailwind entrypoint, CSS-first theme variables, runtime light/dark tokens, base rules, and the `deco-frame` utility |
| `cv.css` | CV-only sidebar state, PDF layout, and theme-toggle placement overrides |

### Design tokens

All public utility tokens are declared in `src/styles/global.css` under `@theme inline`:
- Semantic color utilities: `canvas`, `panel`, `ink`, `muted`, `subtle`, `rule`, `accent`, `accent-strong`, and `safety`
- Typography utilities: `font-serif` and `font-sans`
- Theme-sensitive values update through `--site-*` CSS variables on `html[data-theme="dark"]`

### Layout constraints

- Home prose/card content uses `max-w-[560px]`.
- Project grids use `max-w-[960px]`.
- The booking widget uses `max-w-[900px]`, separate from the narrower home content width.

### Astro script notes

External third-party scripts (e.g. the zcal embed) must use `is:inline` to prevent Astro's bundler from mangling them:
```astro
<script is:inline type="text/javascript" async src="..."></script>
```
