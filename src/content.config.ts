import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const ordered = {
  title: z.string().min(1),
  order: z.number().int().nonnegative(),
  published: z.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
};

const work = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/work" }),
  schema: z.object({
    ...ordered,
    organization: z.string().min(1),
    role: z.string().optional(),
    location: z.string().optional(),
  }),
});

const project = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/project" }),
  schema: ({ image }) =>
    z.object({
      ...ordered,
      description: z.string().min(1),
      status: z.enum(["Released", "In development"]),
      sourceUrl: z.url(),
      work: reference("work").optional(),
      tools: z.array(reference("tool")).default([]),
      cover: image(),
      gallery: z.array(image()).default([]),
      ogImage: image().optional(),
    }),
});

const education = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/education" }),
  schema: z.object({ ...ordered, organization: z.string().min(1) }),
});

const tool = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/tool" }),
  schema: z.object({
    name: z.string().min(1),
    icon: z.string().optional(),
    url: z.url().optional(),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: "settings.md", base: "./src/content" }),
  schema: z.object({
    name: z.string(),
    eyebrow: z.string(),
    roles: z.array(z.string()),
    bio: z.string(),
    email: z.email(),
    itchUrl: z.url(),
    githubUrl: z.url(),
    linkedinUrl: z.url(),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

export const collections = { work, project, education, tool, settings };
