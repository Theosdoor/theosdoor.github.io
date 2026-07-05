import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Skills content configuration and collection schema is correctly defined', async () => {
  const contentConfig = await read('src/content.config.ts');

  assert.match(contentConfig, /const skills = defineCollection\(\{/);
  assert.match(contentConfig, /loader: file\('content\/skills\.yaml'/);
  assert.match(contentConfig, /name: z\.string\(\)/);
  assert.match(contentConfig, /rating: z\.number\(\)\.min\(1\)\.max\(5\)/);
  assert.match(contentConfig, /ais: z\.boolean\(\)/);
  assert.match(contentConfig, /tags: z\.array\(z\.string\(\)\)/);
  assert.match(contentConfig, /export const collections = \{.*skills.*\}/);
});

test('Skills page route resolves and embeds the Skills component within Base layout', async () => {
  const page = await read('src/pages/skills/index.astro');

  assert.match(page, /import Base from '\.\.\/\.\.\/layouts\/Base\.astro'/);
  assert.match(page, /import Skills from '\.\.\/\.\.\/components\/Skills\.astro'/);
  assert.match(page, /<Base/);
  assert.match(page, /title="Skills — Theo Farrell"/);
  assert.match(page, /ogUrl="https:\/\/theosdoor\.github\.io\/skills\/"/);
  assert.match(page, /<Skills headingLevel="h1" \/>/);
});

test('Skills rendering component includes interactive search, toggle, and card elements', async () => {
  const component = await read('src/components/Skills.astro');

  assert.match(component, /id="skills-search"/);
  assert.match(component, /id="skills-ais-toggle"/);
  assert.match(component, /id="skills-container"/);
  assert.match(component, /id="skills-empty-state"/);
  assert.match(component, /class=".*skill-card.*"/);
  assert.match(component, /data-name=\{skill\.name\}/);
  assert.match(component, /data-ais=\{skill\.ais \? 'true' : 'false'\}/);
  assert.match(component, /data-tags=\{skill\.tags\.join\(','\)\}/);
  assert.match(component, /data-rating=\{skill\.rating\}/);
  assert.match(component, /data-ais-tag=/);
  assert.match(component, /show-ais-glow/);
  assert.match(component, /id="skills-sort-btn"/);
  assert.match(component, /Confidence Ratings:/);
  assert.match(component, /import \{ initializeSkillsFilter \} from '\.\.\/scripts\/skills'/);
});

test('SkillIcon component correctly renders external images and code placeholder fallback', async () => {
  const iconComp = await read('src/components/SkillIcon.astro');

  assert.match(iconComp, /iconUrl/);
  assert.match(iconComp, /<img/);
  assert.match(iconComp, /onerror=/);
  assert.match(iconComp, /polyline/);
  assert.match(iconComp, /points="16 18 22 12 16 6"/);
});

test('Skills script supports URL restoration, search syncing, and filtering logic', async () => {
  const script = await read('src/scripts/skills.ts');

  assert.match(script, /export function initializeSkillsFilter\(\)/);
  assert.match(script, /const q = state\.text\.toLowerCase\(\)\.trim\(\)/);
  assert.match(script, /restoreFromUrl\(\)/);
  assert.match(script, /syncToUrl\(\)/);
  assert.match(script, /document\.getElementById\('skills-search'\)/);
  assert.match(script, /document\.getElementById\('skills-ais-toggle'\)/);
  assert.match(script, /document\.getElementById\('skills-debug-tags'\)/);
  assert.match(script, /document\.getElementById\('skills-debug-container'\)/);
});
