import { z } from 'astro/zod';

// Plain zod schemas, kept free of `astro:content` so the node tests can import them and
// compare them with public/admin/config.yml (the Sveltia CMS field definitions).
// `src/content.config.ts` wraps these in collections.

// Key each YAML file keeps its list under.
export const yamlKeys = {
  projects: 'projects',
  talks: 'talks',
  pubs: 'publications',
  reviewing: 'reviewing',
} as const;

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.url().optional(),
  image: z.string().nullable().optional(),
  role: z.enum(['lead', 'contributor']),
  category: z.enum(['research', 'side-project', 'coursework']),
  // Nullable as well: Sveltia stores a cleared optional number as null
  highlight: z.number().int().positive().nullable().optional(),
  year: z.number().nullable().optional(),
  languages: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  venue: z.string().optional(),
  ais: z.boolean().optional(),
});

export const fieldBuildingSchema = z.object({
  projectName: z.string(),
  headline: z.string(),
  // A project can span several roles; they are displayed newest first.
  roles: z
    .array(
      z.object({
        title: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .min(1),
  url: z.url().optional(),
  // Short blurb for the homepage; entries without one are not highlighted there.
  summary: z.string().optional(),
});

export const talkSchema = z.object({
  id: z.string(),
  date: z.string(),
  event: z.string(),
  venue: z.string(),
  topic: z.enum(['research', 'other']),
  description: z.string(),
});

export const pubSchema = z.object({
  id: z.string(),
  title: z.string(),
  'key-role': z.boolean(),
  authors: z.array(z.string()),
  venue: z.string(),
  year: z.number(),
  url: z.url(),
  link_label: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const reviewingSchema = z.object({ name: z.string() });

// Front matter of content/intro.md: the single source for the current position.
// The homepage meta description and JSON-LD `affiliation` are read from here.
export const affiliationTypes = ['CollegeOrUniversity', 'ResearchOrganization', 'Organization', 'Corporation'] as const;

export const introSchema = z.object({
  name: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  affiliations: z.array(z.object({ name: z.string().min(1), type: z.enum(affiliationTypes) })).min(1),
});
