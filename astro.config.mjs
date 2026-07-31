// @ts-check
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://theosdoor.github.io',
  output: 'static',

  // Keeps the old /cv/ URL working now that the CV is served as the PDF itself.
  redirects: {
    '/cv': '/cv/TheoFarrell_CV.pdf',
  },

  vite: {
    plugins: [yaml(), tailwindcss()],
  },

  integrations: [sitemap()],
});