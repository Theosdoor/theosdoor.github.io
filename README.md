# theosdoor.github.io

Personal website built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), deployed to GitHub Pages.

A data-driven static site with light and dark themes; content lives in YAML and Markdown under `content/`.

## Architecture & Routes

The site is built as a static Astro application. Every section has its own URL — there is no client-side routing, and the only JavaScript shipped is the theme toggle, the mobile menu, and the projects filter.

- **`/`** — Home page: intro and bio, followed by the three most recent key-role papers as a plain list linking on to `/research/`.
- **`/research/`** — Publications (key-role and other contributions), reviewing activity, and research talks.
- **`/cv`** — Redirects to the current dated CV PDF.
- **`/projects/`** — Standalone projects page with extensive client-side filtering, sorting, keyboard accessibility, and URL state-synchronization.
- **`/talks/`** — Standalone talks page listing all presentations, talks, and panels.
- **`/field-building/`** — Dedicated space highlighting leadership, community building, and public engagement initiatives.
- **`/lets-chat/`** — Booking and meeting scheduling interface integrating zcal.

## Development

The project is managed with pnpm 12 (pinned in `package.json`) and requires Node `>=24.x`.

### Local Setup & Dev Commands

```bash
# Install dependencies
pnpm install

# Start local development server (Astro 7 runs it in the background;
# manage it with `pnpm exec astro dev stop|status|logs`)
pnpm dev

# Type-check and run the regression tests (CI runs both)
pnpm exec astro check
pnpm test

# Build production static bundle (outputs to dist/)
pnpm build
```

### Deployment

`.github/workflows/deploy.yml` type-checks, tests, builds and checks internal links on every pull request, and deploys to GitHub Pages on push to `main`. `links.yml` checks external links weekly.

## Managing Content

All content is managed through structured, type-safe data collections under `content/` with validation schemas defined in `src/content.config.ts`. To update site content, you only need to modify these files:

### Data-Driven Collections

- **Publications** (`content/pubs.yaml`): Add or update scientific publications.
- **Projects** (`content/projects.yaml`): Track research, coursework, or side projects (supports image previews, `.mp4`/`.gif` video clips, tags, and languages).
- **Talks** (`content/talks.yaml`): List public lectures, panels, and academic talks.
- **Field-Building** (`content/field-building/*.md`): Markdown files representing field-building projects, dynamically rendered on the site.
- **Intro** (`content/intro.md`): Markdown file for the main intro/bio displayed on the home page.

### Assets & Styling

- **CV PDF**: Owned by the [resume repo](https://github.com/Theosdoor/resume), whose CI copies the compiled PDF to `public/cv/` and stamps `src/data/cv-meta.json`; do not edit either here.
- **Images**: Put stills in `src/assets/images/{pubs,projects}/` and reference them from YAML as `/images/<dir>/<file>`; they are resized to webp at build time. Videos and GIFs go in `public/images/projects/`.
- **Styling**: Powered by Tailwind v4. Utility tokens, semantic colors, and design variables are defined in `src/styles/global.css` under `@theme inline` for runtime adaptation.

## Acknowledgements

- Icons from [Font Awesome Free](https://fontawesome.com/license/free) (see `src/components/Icon.astro` for the path definitions and attribution).
