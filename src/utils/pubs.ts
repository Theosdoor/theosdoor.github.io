import { getCollection, type CollectionEntry } from 'astro:content';
export { owner } from './constants';

export type Pub = Omit<CollectionEntry<'pubs'>['data'], 'id'>;

/**
 * Loads every publication from the `pubs` collection, newest year first.
 */
export async function getPublications(): Promise<Pub[]> {
  const raw = await getCollection('pubs');
  return raw
    .map(({ data: { id: _id, ...pub } }): Pub => pub)
    .sort((a, b) => b.year - a.year);
}
