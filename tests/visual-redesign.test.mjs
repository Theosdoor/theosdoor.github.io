import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Tailwind v4 exposes semantic runtime theme utilities', async () => {
  const global = await read('src/styles/global.css');

  assert.match(global, /@import "tailwindcss";/);
  assert.doesNotMatch(global, /@custom-variant dark/);
  assert.match(global, /@theme inline/);
  assert.match(global, /--color-canvas:\s*var\(--site-canvas\)/);
  assert.match(global, /--color-safety:\s*var\(--site-safety\)/);
  assert.match(global, /html\[data-theme="dark"\]/);
  assert.match(global, /--site-muted:\s*#d5cad0;/);
  assert.match(global, /outline:\s*2px solid var\(--color-accent\)/);
});

test('Tailwind utilities retain spacing and decorative frames stay anchored in one entrypoint', async () => {
  const global = await read('src/styles/global.css');

  assert.doesNotMatch(global, /margin:\s*0|padding:\s*0/);
  assert.match(global, /@utility deco-frame/);
  assert.match(global, /position:\s*relative;/);
  await assert.rejects(read('src/styles/tokens.css'));
  await assert.rejects(read('src/styles/base.css'));
});

test('Base owns the shared stylesheet, initializes theme, and mounts the sticky header', async () => {
  const base = await read('src/layouts/Base.astro');
  const header = await read('src/components/Header.astro');
  const home = await read('src/pages/index.astro');
  const projectsPage = await read('src/pages/projects/index.astro');
  const cvCss = await read('src/styles/cv.css');

  assert.match(base, /import Header from '\.\.\/components\/Header\.astro'/);
  assert.match(header, /import ThemeToggle from '\.\/ThemeToggle\.astro'/);
  assert.match(base, /import '\.\.\/styles\/global\.css'/);
  assert.doesNotMatch(home, /styles\/global\.css/);
  assert.doesNotMatch(projectsPage, /styles\/global\.css/);
  assert.doesNotMatch(cvCss, /@import "\.\/global\.css";/);
  assert.match(base, /localStorage\.getItem\('theme'\)/);
  assert.match(base, /prefers-color-scheme:\s*dark/);
  assert.match(base, /document\.documentElement\.dataset\.theme/);
  assert.match(base, /<Header hideThemeToggle=\{hideThemeToggle\} \/>/);
});

test('Base serves the goat favicon package from public assets', async () => {
  const base = await read('src/layouts/Base.astro');
  const favicon = await read('public/favicon.svg');
  const manifest = JSON.parse(await read('public/site.webmanifest'));

  assert.match(base, /rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/);
  assert.match(base, /rel="icon" type="image\/x-icon" href="\/favicon\.ico"/);
  assert.match(base, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
  assert.match(base, /rel="manifest" href="\/site\.webmanifest"/);
  assert.match(base, /name="theme-color" content="#7d3c52"/);
  assert.doesNotMatch(base, /data:image\/svg\+xml/);
  assert.match(favicon, /🐐/);
  assert.equal(manifest.theme_color, '#7d3c52');
  assert.deepEqual(
    manifest.icons.map((icon) => icon.src),
    ['/icon-192.png', '/icon-512.png'],
  );
  await readFile(new URL('../public/favicon.ico', import.meta.url));
  await readFile(new URL('../public/apple-touch-icon.png', import.meta.url));
  await readFile(new URL('../public/icon-192.png', import.meta.url));
  await readFile(new URL('../public/icon-512.png', import.meta.url));
});

test('YAML content remains authorable with only project-specific type declarations', async () => {
  const envTypes = await read('src/env.d.ts');
  const projects = await read('src/components/Projects.astro');
  const publications = await read('src/components/Publications.astro');

  assert.doesNotMatch(envTypes, /reference types="astro\/client"/);
  assert.match(envTypes, /declare module "\*\.yaml"/);
  assert.doesNotMatch(envTypes, /declare module "\*\.yml"/);
  assert.match(projects, /content\/projects\.yaml/);
  assert.match(publications, /content\/pubs\.yaml/);
});

test('ThemeToggle supports alternating light and dark themes via sun and moon icons', async () => {
  const toggle = await read('src/components/ThemeToggle.astro');

  assert.match(toggle, /data-theme-toggle/);
  assert.match(toggle, /data-sun-icon/);
  assert.match(toggle, /data-moon-icon/);
  assert.match(toggle, /localStorage\.setItem\('theme', next\)/);
  assert.match(toggle, /Switch to/);
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
  assert.doesNotMatch(index, /icon="resume"/);
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
  assert.match(projects, /proj-card-body flex flex-1 flex-col p-5/);
  assert.match(projects, /proj-chips mt-auto flex flex-wrap gap-2 pt-4/);
  assert.match(projects, /proj-tags mt-2 flex flex-wrap gap-2/);
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
  assert.match(cvPage, /class="chevron w-\[90%\] h-auto"/);
  assert.doesNotMatch(cvPage, /<em>Farrell<\/em>/);
  assert.match(cvPage, /<Icon name="linkedin"/);
  assert.doesNotMatch(cvPage, /images\/icons|<img class="size-4/);
  assert.doesNotMatch(cvCss, /@import "\.\/global\.css";/);
  assert.doesNotMatch(cvCss, /--copper|--parchment|--ink/);
});

test('contact email is centralized, obfuscated text only, with no copy affordance', async () => {
  const footer = await read('src/components/Footer.astro');
  const cvPage = await read('src/pages/cv/index.astro');
  const emailComponent = await read('src/components/ContactEmail.astro');
  const base = await read('src/layouts/Base.astro');
  const icon = await read('src/components/Icon.astro');
  const constants = await read('src/utils/constants.ts');
  const source = [footer, cvPage, emailComponent, base, icon, constants].join('\n');

  assert.match(constants, /'theo\.farrell99'/);
  assert.match(constants, /'outlook\.com'/);
  assert.match(constants, /\[at\]/);
  assert.match(constants, /\[dot\]/);
  assert.match(emailComponent, /\{contactConfig\.emailObfuscatedText\}/);
  assert.match(footer, /<ContactEmail/);
  assert.match(cvPage, /<ContactEmail/);
  assert.doesNotMatch(source, /theo\.farrell99@outlook\.com|mailto:/);
  assert.doesNotMatch(source, /navigator\.clipboard|js-email-btn|email-copy|name="copy"|'copy'/);
  await assert.rejects(read('src/scripts/email-copy.ts'));
  await assert.rejects(read('public/images/icons/copy.svg'));
});

test('legacy palette and superseded component styles are removed', async () => {
  const sourceFiles = [
    'src/styles/global.css',
    'src/styles/cv.css',
    'src/pages/index.astro',
    'src/pages/projects/index.astro',
    'src/pages/cv/index.astro',
    'src/components/Card.astro',
    'src/components/Icon.astro',
    'src/components/TabNav.astro',
    'src/components/Publications.astro',
    'src/components/Projects.astro',
  ];
  const source = (await Promise.all(sourceFiles.map(read))).join('\n');

  assert.doesNotMatch(source, /--(?:ink|parchment|cream|copper|copper-light|rule|mono|aisafety)\b/);
  assert.doesNotMatch(source, /images\/icons|filter:/);
  assert.doesNotMatch(source, /(?:text|bg|border)-\$\{/);
  await assert.rejects(read('src/styles/tokens.css'));
  await assert.rejects(read('src/styles/base.css'));
  await assert.rejects(read('src/styles/home.css'));
  await assert.rejects(read('src/styles/projects.css'));
  await assert.rejects(read('public/images/icons/resume.svg'));
  await assert.rejects(read('public/images/icons/linkedin.svg'));
  await assert.rejects(read('public/images/icons/github.svg'));
  await assert.rejects(read('public/images/icons/gscholar.svg'));
  await assert.rejects(read('public/images/icons/globe.svg'));
  await assert.rejects(read('public/images/icons/external-link.svg'));
});
