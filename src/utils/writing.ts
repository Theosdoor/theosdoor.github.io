import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/**
 * Published posts (drafts excluded), newest first.
 * Dates are YYYY-MM-DD, so a string compare is a date compare.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}
