import { z } from "zod";

const date = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const orderedFields = {
  title: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
  published: z.boolean(),
  startDate: date,
  endDate: date.optional(),
};

export const contentSchemas = {
  work: z.object({
    ...orderedFields,
    organization: z.string().trim().min(1),
    role: z.string().optional(),
    location: z.string().optional(),
  }),
  project: z.object({
    ...orderedFields,
    description: z.string().trim().min(1),
    status: z.enum(["Released", "In development"]),
    sourceUrl: z.url(),
    work: z.string().optional(),
    tools: z.array(z.string()).default([]),
    cover: z.string().min(1),
    gallery: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }),
  education: z.object({
    ...orderedFields,
    organization: z.string().trim().min(1),
  }),
  tool: z.object({
    name: z.string().trim().min(1),
    icon: z.string().optional(),
    url: z.url().optional(),
  }),
  settings: z.object({
    name: z.string().trim().min(1),
    eyebrow: z.string().trim().min(1),
    roles: z.array(z.string().trim().min(1)).min(1),
    bio: z.string().trim().min(1),
    email: z.email(),
    itchUrl: z.url(),
    githubUrl: z.url(),
    linkedinUrl: z.url(),
    seoTitle: z.string().trim().min(1),
    seoDescription: z.string().trim().min(1),
  }),
};

export const artItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  image: z.string().regex(/^[a-z0-9.-]+$/),
  order: z.number().int().nonnegative(),
  featured: z.boolean(),
  hidden: z.boolean(),
});

export const artGallerySchema = z.array(artItemSchema);

export type ContentCollection = keyof typeof contentSchemas;
