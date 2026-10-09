import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(), // <title> / SEO title
    h1: z.string(), // on-page headline
    description: z.string(), // meta description
    summary: z.string(), // hub-card blurb
    order: z.number().default(99), // hub sort order
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { services };
