// Pure helpers for the /projects/ "Show: Highlights | Everything" switch.
// Kept dependency-free so node tests can import them directly.

export type ProjectsView = 'highlights' | 'all';

export interface ProjectLike {
  highlight?: number | null;
}

/** Highlighted projects in highlight order (1 first); everything else dropped. */
export function highlightOrder<T extends ProjectLike>(projects: T[]): T[] {
  return projects
    .filter((p) => typeof p.highlight === 'number')
    .sort((a, b) => (a.highlight as number) - (b.highlight as number));
}

/** Highlight numbers used more than once (empty when all are unique). */
export function duplicateHighlights(projects: ProjectLike[]): number[] {
  const seen = new Set<number>();
  const dupes = new Set<number>();
  for (const { highlight } of projects) {
    if (typeof highlight !== 'number') continue;
    if (seen.has(highlight)) dupes.add(highlight);
    seen.add(highlight);
  }
  return [...dupes];
}

/**
 * How many cards match the current search/filters but are hidden because the
 * Highlights view is active. `matchesFilters` is true for each card that passes
 * search and filters, `isHighlight` for each highlighted card (same order).
 */
export function moreInEverythingCount(
  view: ProjectsView,
  cards: { matchesFilters: boolean; isHighlight: boolean }[],
): number {
  if (view !== 'highlights') return 0;
  return cards.filter((c) => c.matchesFilters && !c.isHighlight).length;
}

/** Curated order: highlights by number, then the rest newest year first, ties by title. */
export function curatedCompare(
  a: { highlight?: number | null; year?: number | null; title: string },
  b: { highlight?: number | null; year?: number | null; title: string },
): number {
  const ah = typeof a.highlight === 'number';
  const bh = typeof b.highlight === 'number';
  if (ah && bh) return (a.highlight as number) - (b.highlight as number);
  if (ah !== bh) return ah ? -1 : 1;
  return newestCompare(a, b);
}

/** Newest year first (missing year last), ties by title. */
export function newestCompare(
  a: { year?: number | null; title: string },
  b: { year?: number | null; title: string },
): number {
  const yd = (b.year ?? 0) - (a.year ?? 0);
  return yd !== 0 ? yd : a.title.localeCompare(b.title);
}

export type ProjectsSort = 'curated' | 'newest';

/** Reads ?sort=. `recent` was the old name for Newest, so shared links keep working. */
export function parseSort(value: string | null): ProjectsSort {
  return value === 'newest' || value === 'recent' ? 'newest' : 'curated';
}
