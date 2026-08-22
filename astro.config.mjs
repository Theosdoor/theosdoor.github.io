// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Stamped by the deploy pipeline; keeps the stable /cv link on the dated PDF.
const cvMeta = JSON.parse(readFileSync(new URL('./src/data/cv-meta.json', import.meta.url), 'utf8'));

// https://astro.build/config
export default defineConfig({
  site: 'https://theosdoor.github.io',
  output: 'static',

  // Keeps the short /cv URL working, pointing at the current dated PDF.
  redirects: {
    '/cv': `/cv/${cvMeta.file}`,
  },

  vite: {
    plugins: [yaml(), tailwindcss()],
  },

  integrations: [sitemap()],
});