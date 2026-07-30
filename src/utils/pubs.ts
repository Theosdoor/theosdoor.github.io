import { getCollection } from 'astro:content';
import pubsData from '../../content/pubs.yaml';

export interface Pub {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url: string;
  link_label?: string;
  thumbnail?: string;
  'key-role': boolean;
}

/** Site owner's name, as written in content/pubs.yaml. */
export const owner: string = pubsData.owner;

/**
 * Loads every publication from the `pubs` collection, newest year first.
 */
export async function getPublications(): Promise<Pub[]> {
  const raw = await getCollection('pubs');
  return raw
    .map((p) => ({
      title: p.data.title,
      authors: p.data.authors,
      venue: p.data.venue,
      year: p.data.year,
      url: p.data.url,
      link_label: p.data.link_label,
      thumbnail: p.data.thumbnail,
      'key-role': p.data['key-role'],
    }))
    .sort((a, b) => b.year - a.year);
}
