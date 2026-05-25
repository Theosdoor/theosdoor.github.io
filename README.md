# theosdoor.github.io

Personal website built with [Astro](https://astro.build), deployed to GitHub Pages.

## Routes

- `/` — Home page with link cards and publications
- `/cv/` — CV viewer with collapsible sidebar
- `/projects/` — Projects (stub)

## Dev

Requires Node 24 (see `.nvmrc`).

```sh
npm install
npm run dev       # localhost:4321
npm run build     # output to dist/
```

## Content

- **Publications**: edit `content/pubs.yaml` — parsed at build time, no HTML changes needed.
- **CV**: replace `public/TheoFarrell_CV.pdf`.

## Acks

- Some icons from https://phosphoricons.com/
