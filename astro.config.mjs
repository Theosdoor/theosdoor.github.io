// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';

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

  // Self-hosted at build time: no render-blocking Google Fonts stylesheet, and
  // metric-matched fallbacks keep layout still while the files load.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Merriweather',
      cssVariable: '--font-merriweather',
      weights: [400, 700, 900],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Raleway',
      cssVariable: '--font-raleway',
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  // Static multi-page site: fetch a page when its link is hovered or focused.
  prefetch: true,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});