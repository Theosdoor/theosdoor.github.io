import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatMonthYear, parseStartDateForSort, formatAuthors, parseMarkdownLinks } from '../src/utils/formatters.ts';

test('formatDate works correctly', () => {
  assert.equal(formatDate('2026-05-05'), '5 May 2026');
});

test('formatMonthYear works correctly', () => {
  assert.equal(formatMonthYear('2023-10'), 'October 2023');
  assert.equal(formatMonthYear('ongoing'), 'Ongoing');
});

test('parseStartDateForSort calculates rank', () => {
  assert.equal(parseStartDateForSort('2023-10'), 202310);
});

test('formatAuthors bolds owner name', () => {
  const list = ['Theo Farrell', 'Patrick Leask'];
  assert.equal(formatAuthors(list, 'Theo Farrell'), '<strong>Theo Farrell</strong>, Patrick Leask');
});

test('parseMarkdownLinks parses links', () => {
  const raw = 'Visit [GitHub](https://github.com)';
  assert.match(parseMarkdownLinks(raw), /<a.*href="https:\/\/github.com"/);
});
