import { getCollection } from "astro:content";
import type { ContentRow, MediaAsset } from "@/components/admin/types";

const sources = import.meta.glob<string>("../content/**/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});
const mediaModules = import.meta.glob<{ default: { src: string } }>(
  "../content/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true },
);
const source = (path: string) => sources[`../content/${path}`] ?? "";
const media = (collection: string, slug: string): MediaAsset[] =>
  Object.entries(mediaModules)
    .filter(([path]) => path.startsWith(`../content/${collection}/${slug}/`))
    .map(([path, module]) => {
      const name = path.split("/").at(-1) ?? "image";
      return { name, path: `./${name}`, url: module.default.src };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

export async function getAdminRows(): Promise<ContentRow[]> {
  const [work, projects, education, tools] = await Promise.all([
    getCollection("work"),
    getCollection("project"),
    getCollection("education"),
    getCollection("tool"),
  ]);
  const ordered = (
    collection: "work" | "project" | "education",
    items: { id: string; data: { title: string; published: boolean; order: number } }[],
  ) =>
    items.map((item) => {
      const slug = item.id.replace(/\/index$/, "");
      return {
        collection,
        slug,
        title: item.data.title,
        status: item.data.published ? "Published" : "Unpublished",
        order: item.data.order,
        content: source(`${collection}/${slug}/index.mdx`),
        media: media(collection, slug),
      } satisfies ContentRow;
    });

  return [
    ...ordered("work", work),
    ...ordered("project", projects),
    ...ordered("education", education),
    ...tools.map(
      (item) =>
        ({
          collection: "tool",
          slug: item.id,
          title: item.data.name,
          status: "Published",
          content: source(`tool/${item.id}.md`),
          media: [],
        }) satisfies ContentRow,
    ),
    {
      collection: "settings",
      slug: "settings",
      title: "Portfolio settings",
      status: "Published",
      content: source("settings.md"),
      media: [],
    },
  ];
}
