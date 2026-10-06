import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Base restores the 2000s era before first paint and mounts both retro parts', async () => {
  const base = await read('src/layouts/Base.astro');

  assert.match(base, /localStorage\.getItem\('era'\) === '2000s'/);
  assert.match(base, /document\.documentElement\.dataset\.era = '2000s'/);
  // Imported after global.css so its unlayered overrides are the last word.
  assert.match(base, /import '\.\.\/styles\/global\.css';\nimport '\.\.\/styles\/retro\.css';/);
  assert.match(base, /<RetroMode part="top" \/>\s*<Header \/>/);
  assert.match(base, /<slot \/>\s*<RetroMode part="bottom" \/>\s*<Footer \/>/);
});

test('the footer trigger is a button, with the repository as a separate link', async () => {
  const footer = await read('src/components/Footer.astro');

  assert.match(footer, /<button type="button" data-era-trigger/);
  assert.match(footer, /<span class="modern-only">\{lastUpdated\}<\/span>/);
  assert.match(footer, /<span class="retro-only">14 Mar 2004<\/span>/);
  assert.match(footer, /href="https:\/\/github\.com\/Theosdoor\/theosdoor\.github\.io"[^>]*>\s*Source/);
});

test('RetroMode toggles via triple click, Konami code and an exit button', async () => {
  const retro = await read('src/components/RetroMode.astro');

  assert.match(retro, /\[data-era-trigger\]/);
  assert.match(retro, /clicks >= 3/);
  assert.match(retro, /'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'/);
  assert.match(retro, /data-era-exit/);
  assert.match(retro, /Return to 2026/);
  assert.match(retro, /localStorage\.setItem\('era', ERA\)/);
  assert.match(retro, /localStorage\.removeItem\('era'\)/);
  // Konami must not fire while someone is typing.
  assert.match(retro, /input, textarea, select, \[contenteditable\]/);
});

test('retro.css overrides tokens for both themes, hides the theme toggle and respects reduced motion', async () => {
  const css = await read('src/styles/retro.css');
  const header = await read('src/components/Header.astro');
  const divider = await read('src/components/DecoDivider.astro');

  assert.match(css, /:root:not\(\[data-era="2000s"\]\) \.retro-only/);
  assert.match(css, /:root\[data-era="2000s"\] \.modern-only/);
  assert.match(css, /:root\[data-era="2000s"\] \[data-theme-toggle\]/);
  assert.match(css, /--site-canvas:\s*#000018;/);
  assert.match(css, /--font-merriweather:\s*"Comic Sans MS"/);
  // One palette, no dark variant (the header comment explains why, so skip comments).
  const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(rules, /data-theme="dark"|prefers-color-scheme/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none/);
  // System fonts only: nothing fetched.
  assert.doesNotMatch(rules, /@import|@font-face|url\(/);
  assert.match(header, /<header data-site-header/);
  assert.match(header, /data-brand/);
  assert.match(divider, /data-deco-divider/);
});
