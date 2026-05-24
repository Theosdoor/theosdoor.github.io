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
  assert.match(tokens, /--focus-color:\s*#ad627d/);
  assert.match(tokens, /outline:\s*2px solid var\(--focus-color\)/);
});
