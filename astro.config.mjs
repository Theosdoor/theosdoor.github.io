// @ts-check
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Inline integration to register our skills debug toolbar app in development
const skillsDebugToolbar = () => ({
  name: 'skills-debug-toolbar',
  hooks: {
    'astro:config:setup': ({ addDevToolbarApp, command }) => {
      if (command === 'dev') {
        addDevToolbarApp({
          id: 'skills-debug',
          name: 'Skills Debug',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M244,124.81,131.19,12A16,16,0,0,0,120,7.19L24,7.82a16,16,0,0,0-16,16L8.81,120a16,16,0,0,0,4.81,11.19L126.81,244a16,16,0,0,0,22.38,0l94.8-94.8a16,16,0,0,0,0-24.39ZM138,232.83,24.83,119.66,24,23.83l95.83.83,113.17,113.17ZM72,60A12,12,0,1,1,60,72,12,12,0,0,1,72,60Z"></path></svg>',
          entrypoint: fileURLToPath(new URL('./src/dev-toolbar/skills-debug.ts', import.meta.url)),
        });
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://theosdoor.github.io',
  output: 'static',

  vite: {
    plugins: [yaml(), tailwindcss()],
  },

  integrations: [sitemap(), skillsDebugToolbar()],
});