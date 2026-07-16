import type { EditorValues } from "./types";

export const contentPath = ({ collection, slug }: Pick<EditorValues, "collection" | "slug">) =>
  collection === "settings"
    ? "src/content/settings.md"
    : collection === "tool"
      ? `src/content/tool/${slug}.md`
      : `src/content/${collection}/${slug}/index.mdx`;

export const mediaName = (name: string) => name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");

export const mediaPath = (name: string) => `./${mediaName(name)}`;
