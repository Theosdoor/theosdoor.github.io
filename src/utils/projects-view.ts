// Pure helpers for the /projects/ highlights and the "Show N more" divider.
// Kept dependency-free so node tests can import them directly.

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
 * Text for the divider between the highlights and the rest, or null when it
 * should not show. `restMatches` counts non-highlights that pass the current
 * search and filters; `filtering` is true while any search or filter is set.
 */
export function dividerLabel(o: { expanded: boolean; restMatches: number; filtering: boolean }): string | null {
  const n = o.restMatches;
  if (n <= 0) return null;
  if (o.expanded) return 'Show fewer';
  const noun = o.filtering ? (n === 1 ? 'match' : 'matches') : (n === 1 ? 'project' : 'projects');
  return `Show ${n} more ${noun}`;
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
