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

Astro static site (`output: 'static'`) with multiple static routes:

- **`/`** (`src/pages/index.astro`) — single-page with five tab panels: Home, Research, Field-building, Projects, Let's chat
- **`/cv/`** (`src/pages/cv/index.astro`) — collapsible sidebar + PDF iframe; sidebar state persisted in `localStorage`
- **`/projects/`** (`src/pages/projects/index.astro`) — standalone projects page (same `Projects` component, with `urlSync` enabled)
- **`/talks/`** (`src/pages/talks/index.astro`) — standalone talks page showing all talks (including non-research topics)
- **`/field-building/`** (`src/pages/field-building/index.astro`) — standalone field-building projects page
- **`/lets-chat/`** (`src/pages/lets-chat/index.astro`) — standalone booking and scheduling meeting widget

### Tab navigation

Homepage tab switching is handled via client-side scripts inside `src/components/Header.astro`. Tabs map to URL hashes (`#research`, `#field-building`, `#projects`, `#chat`; home has no hash). Browser back/forward is fully supported via `popstate` and `hashchange` event listeners.

### Data-driven content

All site content is managed and validated using **Astro Content Collections (Content Layer)** under `src/content.config.ts` with strict Zod validation schemas. Source files remain authored as raw YAML and Markdown under `content/`:

**1. Publications (`content/pubs.yaml`)** — Loaded via `getCollection('pubs')` and rendered by `src/components/Publications.astro`:
```yaml
owner: "Theo Farrell"
publications:
  - title: "..."
    authors: [...]
    venue: "..."
    year: 2025
    url: "..."
    link_label: "..."   # optional
    key-role: true | false
```

**2. Projects (`content/projects.yaml`)** — Loaded via `getCollection('projects')` and rendered by `src/components/Projects.astro`:
```yaml
projects:
  - title: "..."
    description: "..."
    url: "..."           # optional
    image: "..."         # optional; .mp4/.gif renders as <video>, otherwise <img>
    role: lead | contributor
    category: research | side-project | coursework
    featured: true       # optional
    year: 2025
    languages: [...]     # optional
    tools: [...]         # optional
    ais: true | false    # optional
```

**3. Talks (`content/talks.yaml`)** — Loaded via `getCollection('talks')` and rendered by `src/components/Talks.astro`. Can be filtered using `filterResearchOnly` prop.

**4. Field-building (`content/field-building/*.md`)** — Markdown files loaded via `getCollection('fieldBuilding')` and rendered dynamically by `src/components/FieldBuilding.astro`.

### Modularity & DRY

*   **Formatters (`src/utils/formatters.ts`)**: Date parsing, markdown links parsing, and author list name bolding are fully centralized and tested.
*   **Projects Filter (`src/scripts/projects.ts`)**: The extensive client-side filtering, sorting, keyboard access, and URL state-synchronization logic is isolated in a dedicated type-safe TypeScript module.

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
