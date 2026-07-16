import { parseDocument } from "yaml";
import type { RepositorySnapshot } from "./github";
import type { GitChange, PublishRequest } from "./publishing";
import { ContentReferencedError } from "./publishing";

const projectPath = /^src\/content\/project\/([^/]+)\/index\.mdx$/;

const split = (content: string) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("Project frontmatter is missing");
  return { source: match[1], start: match.index ?? 0, length: match[0].length };
};

const projects = async (snapshot: RepositorySnapshot) => {
  const entries = snapshot.entries.flatMap((entry) => {
    const match = entry.type === "blob" && entry.path.match(projectPath);
    return match ? [{ slug: match[1], entry }] : [];
  });
  return Promise.all(
    entries.map(async (project) => ({ ...project, content: await snapshot.read(project.entry) })),
  );
};

export async function resolveContentChanges(
  request: PublishRequest,
  snapshot: RepositorySnapshot,
): Promise<GitChange[]> {
  const deletion = request.changes.find((change) => "delete" in change);
  if (!deletion) return request.changes;
  if (request.changes.length !== 1) throw new Error("Delete requests must contain one change");

  if (deletion.path.startsWith("src/content/project/")) {
    const prefix = deletion.path.replace(/index\.mdx$/, "");
    return snapshot.entries.flatMap((entry) =>
      entry.type === "blob" && entry.path.startsWith(prefix)
        ? [{ path: entry.path, delete: true as const }]
        : [],
    );
  }

  const entries = await projects(snapshot);
  if (deletion.path.startsWith("src/content/tool/")) {
    const slug = deletion.path.split("/").at(-1)?.replace(/\.md$/, "");
    const references = entries.filter(({ content }) => {
      const document = parseDocument(split(content).source);
      const tools = document.toJS().tools;
      return Array.isArray(tools) && tools.includes(slug);
    });
    if (references.length)
      throw new ContentReferencedError(
        `Tool is used by ${references.map(({ slug: project }) => project).join(", ")}`,
      );
    return request.changes;
  }

  if (deletion.path.startsWith("src/content/work/")) {
    const slug = deletion.path.split("/")[3];
    const updates = entries.flatMap(({ entry, content }) => {
      const frontmatter = split(content);
      const document = parseDocument(frontmatter.source);
      const work = document
        .get("work")
        ?.toString()
        .replace(/\/index$/, "");
      if (work !== slug) return [];
      document.delete("work");
      const next = `---\n${document.toString().trimEnd()}\n---`;
      return [
        {
          path: entry.path,
          content: `${content.slice(0, frontmatter.start)}${next}${content.slice(frontmatter.start + frontmatter.length)}`,
        },
      ];
    });
    return [...request.changes, ...updates];
  }

  return request.changes;
}
