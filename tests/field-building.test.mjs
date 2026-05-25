import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('FieldBuilding component exists and implements dynamic loading and premium styling', async () => {
  const component = await read('src/components/FieldBuilding.astro');
  const markdown = await read('content/field-building/durham-ai-safety.md');

  // Verify component structure and logic
  assert.match(component, /import Icon from '\.\/Icon\.astro'/);
  assert.match(component, /import\.meta\.glob/);
  assert.match(component, /formatMonthYear/);
  assert.match(component, /parseStartDateForSort/);
  assert.match(component, /sortedEntries/);

  // Verify premium styling rules
  assert.match(component, /bg-panel border border-rule/);
  assert.match(component, /font-serif text-2xl font-black leading-tight/); // Headline style
  assert.match(component, /prose max-w-none/); // Rich Markdown container
  assert.match(component, /\[&_ul_li::before\]:content-\[''\]/); // Custom list indicator bullets
  assert.match(component, /Visit website/);

  // Verify Markdown content schema
  assert.match(markdown, /projectName:\s*"Durham AI Safety Initiative"/);
  assert.match(markdown, /role:\s*"Lead Organiser"/);
  assert.match(markdown, /startDate:\s*"2023-10"/);
  assert.match(markdown, /endDate:\s*"ongoing"/);
  assert.match(markdown, /url:\s*"https:\/\/durhamaisafety\.uk\/"/);
});

test('Header and Index page integrate the Field-building tab panel and navigation links', async () => {
  const header = await read('src/components/Header.astro');
  const index = await read('src/pages/index.astro');
  const standalone = await read('src/pages/field-building/index.astro');

  // Verify Header links and client-side dynamic switching mappings
  assert.match(header, /data-tab-link="field-building"/);
  assert.match(header, /href="\/#field-building"/);
  assert.match(header, /if\s*\(hash === '#field-building'\)\s*return 'panel-field-building';/);
  assert.match(header, /if\s*\(panelId === 'panel-field-building'\)\s*return '#field-building';/);

  // Verify Homepage integration
  assert.match(index, /import FieldBuilding from '\.\.\/components\/FieldBuilding\.astro'/);
  assert.match(index, /<div id="panel-field-building" role="tabpanel" aria-labelledby="tab-field-building" hidden>/);
  assert.match(index, /<FieldBuilding \/>/);

  // Verify Standalone route
  assert.match(standalone, /import Base from '\.\.\/\.\.\/layouts\/Base\.astro'/);
  assert.match(standalone, /import FieldBuilding from '\.\.\/\.\.\/components\/FieldBuilding\.astro'/);
  assert.match(standalone, /title="Field-building — Theo Farrell"/);
});
