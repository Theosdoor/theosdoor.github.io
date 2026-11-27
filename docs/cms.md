# Content manager (Sveltia CMS)

Edit the site's content at `/admin` (`public/admin/index.html` loads Sveltia CMS from unpkg, pinned to an exact version; `public/admin/config.yml` defines the collections). The CV is not managed here.

Collections: Intro (bio, meta description, current affiliations), Projects, Talks, Publications, Reviewing, Field-building. Field names, enums and required/optional mirror `src/content-schemas.ts`; `tests/cms-config.test.mjs` fails if they drift.

## Signing in (GitHub Pages, no server)

Sveltia's GitHub backend supports two methods ([docs](https://sveltiacms.app/docs/backends/github)):

1. **Personal access token** (the one that works here): "you can use a personal access token (PAT) for authentication." and "This method is straightforward and doesn't require setting up an OAuth app or updating the CMS configuration." At `/admin` choose the token option and paste a fine-grained token for this repository with Contents: read and write. Never commit a token.
2. OAuth authorization code flow: "requires you to register a GitHub App or an OAuth app on GitHub and deploy an OAuth client server". Not used, since GitHub Pages has no server.

## Local mode (no sign-in)

[Docs](https://sveltiacms.app/docs/workflows/local): "If you plan to only work with your local repository, you don't need to set up authentication with your Git backend." It "relies on the File System Access API, which only Chromium-based browsers support" (Chrome, Edge, Brave; not Firefox or Safari). Run the site locally (`pnpm dev`), open `/admin/`, click "Work with Local Repository" and pick the repository root. Edits write to your working tree; commit and push yourself.

## How saves deploy

With a token, each save is a commit to `main` made through the GitHub API (`publish_mode: simple`, no draft workflow). A push to `main` triggers `.github/workflows/deploy.yml`, which runs the checks and deploys to GitHub Pages. A bad edit that fails the build or tests is not deployed.

## Limits

- Images go to `src/assets/images/<collection>/` and are referenced as `/images/...`. Videos and GIFs belong in `public/`, so add them by hand.
- Highlight numbers must be unique (1 = first). The CMS does not check this; `pnpm test` does, so a clash fails the deploy rather than reaching the site.
- Not verified: how Sveltia round-trips YAML comments and formatting in `content/*.yaml` (expect comments such as the header in `pubs.yaml` may be dropped on first save).
