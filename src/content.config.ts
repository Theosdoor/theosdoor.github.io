import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const projects = defineCollection({
  loader: file('content/projects.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as { projects: any[] };
      return parsed.projects.map((item, index) => ({
        id: item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : String(index),
        ...item,
      }));
    }
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
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
    url: z.string().url().optional(),
  }),
});

const talks = defineCollection({
  loader: file('content/talks.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as { talks: any[] };
      return parsed.talks.map((item, index) => ({
        id: item.event ? `${item.event.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.date}` : String(index),
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
      const parsed = yaml.load(text) as { publications: any[] };
      return parsed.publications.map((item, index) => ({
        id: item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : String(index),
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
    url: z.string().url(),
    link_label: z.string().optional(),
  }),
});

export const collections = { projects, fieldBuilding, talks, pubs };
