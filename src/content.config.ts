import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

// Helper to safely slugify text for unique content collection IDs
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Clean leading/trailing hyphens
}

const projects = defineCollection({
  loader: file('content/projects.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as { projects?: any[] } | null;
      const list = parsed?.projects ?? [];
      return list.map((item, index) => ({
        id: slugify(item.title) || String(index),
        ...item,
      }));
    }
  }),
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
    role: z.string(),
    headline: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    url: z.url().optional(),
    // Short blurb for the homepage; entries without one are not highlighted there.
    summary: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: file('content/talks.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as { talks?: any[] } | null;
      const list = parsed?.talks ?? [];
      return list.map((item, index) => ({
        id: item.event ? `${slugify(item.event)}-${item.date}` : String(index),
        ...item,
      }));
    }
  }),
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
  loader: file('content/pubs.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as { publications?: any[] } | null;
      const list = parsed?.publications ?? [];
      return list.map((item, index) => ({
        id: slugify(item.title) || String(index),
        ...item,
      }));
    }
  }),
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

export const collections = { projects, fieldBuilding, talks, pubs };
