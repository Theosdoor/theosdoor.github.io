import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import { load as loadYaml } from 'js-yaml';

// Helper to safely slugify text for unique content collection IDs
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Clean leading/trailing hyphens
}

// Each content YAML file holds one list under a named key (e.g. `projects:`);
// this turns that list into collection entries with stable, unique ids.
function yamlList<T extends object>(path: string, key: string, idOf: (item: T) => string) {
  return file(path, {
    parser: (text) => {
      const parsed = loadYaml(text) as Record<string, T[] | undefined> | null;
      return (parsed?.[key] ?? []).map((item, index) => ({ id: idOf(item) || String(index), ...item }));
    },
  });
}

const projects = defineCollection({
  loader: yamlList<{ title: string }>('content/projects.yaml', 'projects', (p) => slugify(p.title)),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    url: z.url().optional(),
    image: z.string().nullable().optional(),
    role: z.enum(['lead', 'contributor']),
    category: z.enum(['research', 'side-project', 'coursework']),
    featured: z.boolean().optional(),
    year: z.number().nullable().optional(),
    languages: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    venue: z.string().optional(),
    ais: z.boolean().optional(),
  }),
});

const fieldBuilding = defineCollection({
  loader: glob({ pattern: '*.md', base: 'content/field-building' }),
  schema: z.object({
    projectName: z.string(),
    headline: z.string(),
    // A project can span several roles; they are displayed newest first.
    roles: z
      .array(
        z.object({
          title: z.string(),
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .min(1),
    url: z.url().optional(),
    // Short blurb for the homepage; entries without one are not highlighted there.
    summary: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: yamlList<{ event?: string; date: string }>('content/talks.yaml', 'talks', (t) =>
    t.event ? `${slugify(t.event)}-${t.date}` : '',
  ),
  schema: z.object({
    id: z.string(),
    date: z.string(),
    event: z.string(),
    venue: z.string(),
    topic: z.enum(['research', 'other']),
    description: z.string(),
  }),
});

const pubs = defineCollection({
  loader: yamlList<{ title: string }>('content/pubs.yaml', 'publications', (p) => slugify(p.title)),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    'key-role': z.boolean(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    url: z.url(),
    link_label: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

// Plain strings in the YAML; wrapped as { name } so each is a collection entry.
const reviewing = defineCollection({
  loader: file('content/reviewing.yaml', {
    parser: (text) => {
      const parsed = loadYaml(text) as { reviewing?: string[] } | null;
      return (parsed?.reviewing ?? []).map((name) => ({ id: slugify(name), name }));
    },
  }),
  schema: z.object({ name: z.string() }),
});

export const collections = { projects, fieldBuilding, talks, pubs, reviewing };
