import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'js-yaml';
import {
  curatedCompare,
  duplicateHighlights,
  highlightOrder,
  moreInEverythingCount,
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

test('moreInEverythingCount counts matching non-highlights only in the Highlights view', () => {
  const cards = [
    { matchesFilters: true, isHighlight: true },
    { matchesFilters: true, isHighlight: false },
    { matchesFilters: true, isHighlight: false },
    { matchesFilters: false, isHighlight: false },
    { matchesFilters: false, isHighlight: true },
  ];
  assert.equal(moreInEverythingCount('highlights', cards), 2);
  assert.equal(moreInEverythingCount('all', cards), 0);
  assert.equal(moreInEverythingCount('highlights', cards.filter((c) => c.isHighlight)), 0);
  assert.equal(moreInEverythingCount('highlights', []), 0);
});
