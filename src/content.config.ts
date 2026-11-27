import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { load as loadYaml } from 'js-yaml';
import {
  yamlKeys,
  projectSchema,
  fieldBuildingSchema,
  talkSchema,
  pubSchema,
  reviewingSchema,
} from './content-schemas';

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
  loader: yamlList<{ title: string }>('content/projects.yaml', yamlKeys.projects, (p) => slugify(p.title)),
  schema: projectSchema,
});

const fieldBuilding = defineCollection({
  loader: glob({ pattern: '*.md', base: 'content/field-building' }),
  schema: fieldBuildingSchema,
});

const talks = defineCollection({
  loader: yamlList<{ event?: string; date: string }>('content/talks.yaml', yamlKeys.talks, (t) =>
    t.event ? `${slugify(t.event)}-${t.date}` : '',
  ),
  schema: talkSchema,
});

const pubs = defineCollection({
  loader: yamlList<{ title: string }>('content/pubs.yaml', yamlKeys.pubs, (p) => slugify(p.title)),
  schema: pubSchema,
});

// Plain strings in the YAML; wrapped as { name } so each is a collection entry.
const reviewing = defineCollection({
  loader: file('content/reviewing.yaml', {
    parser: (text) => {
      const parsed = loadYaml(text) as Record<string, string[] | undefined> | null;
      return (parsed?.[yamlKeys.reviewing] ?? []).map((name) => ({ id: slugify(name), name }));
    },
  }),
  schema: reviewingSchema,
});

export const collections = { projects, fieldBuilding, talks, pubs, reviewing };
