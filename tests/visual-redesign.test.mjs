import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Tailwind v4 exposes semantic runtime theme utilities', async () => {
  const global = await read('src/styles/global.css');
  const tokens = await read('src/styles/tokens.css');

  assert.match(global, /@import "tailwindcss";/);
  assert.match(global, /@custom-variant dark/);
  assert.match(global, /@theme inline/);
  assert.match(global, /--color-canvas:\s*var\(--bg-primary\)/);
  assert.match(global, /--color-safety:\s*var\(--tag-safety\)/);

  assert.match(tokens, /html\[data-theme="dark"\]/);
  assert.match(tokens, /--focus-color:\s*#ad627d;/);
  assert.match(tokens, /outline:\s*2px solid var\(--focus-color\)/);
});

test('Base initializes theme before render and mounts the global toggle', async () => {
  const base = await read('src/layouts/Base.astro');

  assert.match(base, /import ThemeToggle from '\.\.\/components\/ThemeToggle\.astro'/);
  assert.match(base, /localStorage\.getItem\('theme'\)/);
  assert.match(base, /prefers-color-scheme:\s*dark/);
  assert.match(base, /document\.documentElement\.dataset\.theme/);
  assert.match(base, /<ThemeToggle \/>/);
});

test('ThemeToggle supports system, light, and dark without storing system mode', async () => {
  const toggle = await read('src/components/ThemeToggle.astro');

  assert.match(toggle, /data-theme-toggle/);
  assert.match(toggle, /\['system', 'light', 'dark'\]/);
  assert.match(toggle, /localStorage\.removeItem\('theme'\)/);
  assert.match(toggle, /localStorage\.setItem\('theme', next\)/);
  assert.match(toggle, /Switch to \$\{next/);
  assert.doesNotMatch(toggle, /Click to/);
});

test('home UI is composed from DecoDivider and semantic Tailwind surfaces', async () => {
  const divider = await read('src/components/DecoDivider.astro');
  const icon = await read('src/components/Icon.astro');
  const card = await read('src/components/Card.astro');
  const publications = await read('src/components/Publications.astro');
  const index = await read('src/pages/index.astro');

  assert.match(divider, /aria-hidden="true"/);
  assert.match(divider, /border-accent/);
  assert.match(icon, /fill-current/);
  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /'external-link'/);
  assert.match(icon, /fontawesome\.com\/license\/free/);
  assert.match(card, /import Icon/);
  assert.match(card, /<Icon name=\{icon\}/);
  assert.doesNotMatch(card, /images\/icons|<img/);
  assert.match(publications, /<Icon name="external-link"/);
  assert.match(card, /border-rule/);
  assert.match(card, /bg-panel/);
  assert.match(index, /import DecoDivider/);
  assert.match(index, /icon="resume"/);
  assert.doesNotMatch(index, /<em>Farrell<\/em>/);
});

test('projects retains data behavior hooks while using semantic utilities', async () => {
  const projects = await read('src/components/Projects.astro');

  assert.match(projects, /data-url-sync/);
  assert.match(projects, /setupPillGroup\('filter-role', 'role'\)/);
  assert.match(projects, /restoreFromUrl\(\)/);
  assert.match(projects, /bg-panel/);
  assert.match(projects, /border-rule/);
  assert.match(projects, /text-safety/);
  assert.match(projects, /classList\.toggle\('border-accent', active\)/);
  assert.doesNotMatch(projects, /(?:text|bg|border)-\$\{/);
});

test('CV composes the redesigned shell and retains sidebar persistence', async () => {
  const cvPage = await read('src/pages/cv/index.astro');
  const cvCss = await read('src/styles/cv.css');

  assert.match(cvPage, /import DecoDivider/);
  assert.match(cvPage, /import Icon/);
  assert.match(cvPage, /localStorage\.getItem\('sidebarHidden'\)/);
  assert.match(cvPage, /localStorage\.setItem\('sidebarHidden'/);
  assert.match(cvPage, /TheoFarrell_CV\.pdf/);
  assert.doesNotMatch(cvPage, /<em>Farrell<\/em>/);
  assert.match(cvPage, /<Icon name="linkedin"/);
  assert.doesNotMatch(cvPage, /images\/icons|<img class="size-4/);
  assert.match(cvCss, /@import "\.\/global\.css";/);
  assert.doesNotMatch(cvCss, /--copper|--parchment|--ink/);
});


