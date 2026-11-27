import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'js-yaml';
import {
  curatedCompare,
  dividerLabel,
  duplicateHighlights,
  highlightOrder,
  parseSort,
} from '../src/utils/projects-view.ts';

const { projects } = load(await readFile(new URL('../content/projects.yaml', import.meta.url), 'utf8'));

const EXPECTED = [
  'MOBench',
  'Bipedal Walking with RL',
  'Graded Latents',
  'Order by Scale',
  'Ghost Marks in the Machine',
  'Challenges of Evaluating LLM Safety for User Welfare',
  'Programmable Matter Lab',
];

test('exactly the seven highlights, in order', () => {
  assert.deepEqual(highlightOrder(projects).map((p) => p.title), EXPECTED);
  assert.deepEqual(highlightOrder(projects).map((p) => p.highlight), [1, 2, 3, 4, 5, 6, 7]);
});

test('highlight numbers are unique, and a clash is detected', () => {
  assert.deepEqual(duplicateHighlights(projects), []);
  assert.deepEqual(duplicateHighlights([{ highlight: 2 }, { highlight: 2 }, { highlight: 1 }, {}]), [2]);
});

test('featured is gone from the data', () => {
  assert.ok(projects.every((p) => !('featured' in p)));
});

test('curated order: highlights first, then newest year, ties by title', () => {
  const sorted = [...projects].sort(curatedCompare);
  assert.deepEqual(sorted.slice(0, 7).map((p) => p.title), EXPECTED);
  const rest = sorted.slice(7);
  for (let i = 1; i < rest.length; i++) {
    const [a, b] = [rest[i - 1], rest[i]];
    assert.ok((a.year ?? 0) > (b.year ?? 0) || ((a.year ?? 0) === (b.year ?? 0) && a.title.localeCompare(b.title) <= 0));
  }
});

test('divider label counts the hidden non-highlights, and hides when there are none', () => {
  assert.equal(dividerLabel({ expanded: false, restMatches: 12, filtering: false }), 'Show 12 more projects');
  assert.equal(dividerLabel({ expanded: false, restMatches: 1, filtering: false }), 'Show 1 more project');
  assert.equal(dividerLabel({ expanded: false, restMatches: 3, filtering: true }), 'Show 3 more matches');
  assert.equal(dividerLabel({ expanded: false, restMatches: 1, filtering: true }), 'Show 1 more match');
  assert.equal(dividerLabel({ expanded: true, restMatches: 12, filtering: false }), 'Show fewer');
  assert.equal(dividerLabel({ expanded: true, restMatches: 0, filtering: true }), null);
  assert.equal(dividerLabel({ expanded: false, restMatches: 0, filtering: true }), null);
});

test('old ?sort=recent links open Newest', () => {
  assert.equal(parseSort('recent'), 'newest');
  assert.equal(parseSort('newest'), 'newest');
  assert.equal(parseSort(null), 'curated');
  assert.equal(parseSort('bogus'), 'curated');
});

test('sort is a Curated/Newest switch, not a dropdown', async () => {
  const astro = await readFile(new URL('../src/components/Projects.astro', import.meta.url), 'utf8');
  const script = await readFile(new URL('../src/scripts/projects.ts', import.meta.url), 'utf8');
  assert.match(astro, /id="proj-sort-switch"[\s\S]*?role="switch"/);
  assert.doesNotMatch(astro, /proj-sort-panel|data-sort=/);
  // Newest lists everything in one run, so the divider split is Curated-only
  assert.match(script, /const split = state\.sort === 'curated';/);
});
