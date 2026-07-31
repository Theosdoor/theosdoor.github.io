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
  assert.match(component, /formatRole/);
  assert.match(component, /parseRolesForSort/);
  assert.match(component, /sortRolesByRecency/);
  assert.match(component, /sortedEntries/);

  // Verify premium styling rules
  assert.match(component, /bg-panel border border-rule/);
  assert.match(component, /font-serif text-2xl font-black leading-tight/); // Headline style
  assert.match(component, /prose max-w-none/); // Rich Markdown container
  assert.match(component, /\[&_ul_li::before\]:content-\[''\]/); // Custom list indicator bullets
  assert.match(component, /Visit website/);

  // Verify Markdown content schema: a project carries a list of roles
  assert.match(markdown, /projectName:\s*"Durham AI Safety Initiative"/);
  assert.match(markdown, /^roles:$/m);
  assert.match(markdown, /- title: "Advisor"\n\s+startDate: "2026-02"\n\s+endDate: "ongoing"/);
  assert.match(markdown, /- title: "Lead Organiser"\n\s+startDate: "2023-10"\n\s+endDate: "2026-02"/);
  assert.match(markdown, /url:\s*"https:\/\/durhamaisafety\.uk\/"/);
  // The flat single-role fields are gone.
  assert.doesNotMatch(markdown, /^role:|^startDate:|^endDate:/m);
});

test('roles are ordered newest first and rank a project by its latest one', async () => {
  const { sortRolesByRecency, parseRolesForSort, formatRole } = await import(
    '../src/utils/formatters.ts'
  );
  const roles = [
    { title: 'Lead Organiser', startDate: '2023-10', endDate: '2026-02' },
    { title: 'Advisor', startDate: '2026-02', endDate: 'ongoing' },
  ];

  assert.deepEqual(
    sortRolesByRecency(roles).map((r) => r.title),
    ['Advisor', 'Lead Organiser']
  );
  // Sorting must not mutate the caller's array.
  assert.equal(roles[0].title, 'Lead Organiser');
  // A project ranks by its most recent role, not its first.
  assert.equal(parseRolesForSort(roles), 202602);
  assert.equal(parseRolesForSort([]), 0);
  assert.equal(formatRole(roles[1]), 'Advisor · February 2026 — Ongoing');
});

test('Field-building is reached by its own route from the navigation', async () => {
  const header = await read('src/components/Header.astro');
  const footer = await read('src/components/Footer.astro');
  const index = await read('src/pages/index.astro');
  const standalone = await read('src/pages/field-building/index.astro');

  // Verify navigation links point at the real route, not a homepage tab
  assert.match(header, /href: '\/field-building\/'/);
  assert.match(footer, /href="\/field-building\/"/);
  assert.doesNotMatch(header, /#field-building|data-tab-link/);
  assert.doesNotMatch(footer, /#field-building|data-tab-link/);

  // The homepage links to the section rather than duplicating it: it may show the
  // short SelectedFieldBuilding highlight, but never the full FieldBuilding listing.
  assert.doesNotMatch(index, /tabpanel/);
  assert.doesNotMatch(index, /(?<!Selected)FieldBuilding/);
  assert.match(index, /<SelectedFieldBuilding \/>/);

  // Verify Standalone route
  assert.match(standalone, /import Base from '\.\.\/\.\.\/layouts\/Base\.astro'/);
  assert.match(standalone, /import FieldBuilding from '\.\.\/\.\.\/components\/FieldBuilding\.astro'/);
  assert.match(standalone, /title="Field-building — Theo Farrell"/);
});
