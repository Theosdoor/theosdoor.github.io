# theosdoor.github.io

Personal website built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), deployed to GitHub Pages.

This is a modern, high-performance, data-driven static portfolio website designed with responsive light/dark themes, clean typography, premium animations, and modular architecture.

## Architecture & Routes

The site is built as a static Astro application with several routes:

- **`/`** — Home page featuring interactive tab-based navigation across 5 panels: Home, Research, Field-building, Projects, and Let's Chat. Tab switching uses client-side history navigation with full browser back/forward support.
- **`/cv/`** — CV viewer with a collapsible sidebar and an embedded interactive PDF viewer. The sidebar state is persisted across visits in `localStorage`.
- **`/projects/`** — Standalone projects page with extensive client-side filtering, sorting, keyboard accessibility, and URL state-synchronization.
- **`/talks/`** — Standalone talks page listing all presentations, talks, and panels.
- **`/field-building/`** — Dedicated space highlighting leadership, community building, and public engagement initiatives.
- **`/lets-chat/`** — Booking and meeting scheduling interface integrating zcal.

## Development

The project is pnpm-managed and requires Node `>=24.x`.

### Local Setup & Dev Commands

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Build production static bundle (outputs to dist/)
pnpm build
```

### Deployment

The site is configured for continuous integration and automatically deploys to GitHub Pages via GitHub Actions. Any merge or push to the `main` branch triggers the deployment pipeline defined in `.github/workflows/deploy.yml`.

## Managing Content

All content is managed through structured, type-safe data collections under `content/` with validation schemas defined in `src/content.config.ts`. To update site content, you only need to modify these files:

### Data-Driven Collections

- **Publications** (`content/pubs.yaml`): Add or update scientific publications.
- **Projects** (`content/projects.yaml`): Track research, coursework, or side projects (supports image previews, `.mp4`/`.gif` video clips, tags, and languages).
- **Talks** (`content/talks.yaml`): List public lectures, panels, and academic talks.
- **Field-Building** (`content/field-building/*.md`): Markdown files representing field-building projects, dynamically rendered on the site.
- **Intro** (`content/intro.md`): Markdown file for the main intro/bio displayed on the home page.

### Assets & Styling

- **CV PDF**: Replace the CV file directly at `public/TheoFarrell_CV.pdf`.
- **Styling**: Powered by Tailwind v4. Utility tokens, semantic colors, and design variables are defined in `src/styles/global.css` under `@theme inline` for runtime adaptation.

## Acknowledgements

- Icons powered by [Phosphor Icons](https://phosphoricons.com/).
