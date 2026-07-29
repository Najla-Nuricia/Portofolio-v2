import { contentSchemas, type ContentCollection } from "../../schema/content";
import { parseDocument } from "yaml";
import { z } from "zod";
import type { RepositorySnapshot } from "./github";
import type { GitChange } from "./publishing";

const contentFile =
  /^(?:src\/content\/(work|project|education)\/([^/]+)\/index\.mdx|src\/content\/tool\/([^/]+)\.md|src\/content\/(settings)\.md)$/;

const split = (content: string) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("Frontmatter is missing");
  return { source: match[1], body: content.slice(match[0].length) };
};

const issueText = (error: z.ZodError) =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");

export class InvalidContentError extends Error {}

export async function validateContentChanges(
  changes: GitChange[],
  snapshot: RepositorySnapshot,
): Promise<GitChange[]> {
  const paths = new Set(
    snapshot.entries.filter(({ type }) => type === "blob").map(({ path }) => path),
  );
  for (const change of changes) {
    if ("delete" in change) paths.delete(change.path);
    else paths.add(change.path);
  }

  return Promise.all(
    changes.map(async (change) => {
      if (!("content" in change)) return change;
      const match = change.path.match(contentFile);
      if (!match) return change;
      const collection = (match[1] ?? (match[3] ? "tool" : match[4])) as ContentCollection;
      const slug = match[2] ?? match[3] ?? "settings";

      try {
        const { source, body } = split(change.content);
        const document = parseDocument(source);
        if (document.errors.length) throw new Error(document.errors[0].message);
        const parsed = contentSchemas[collection].safeParse(document.toJS());
        if (!parsed.success) throw new Error(issueText(parsed.error));

        if (collection === "project") {
          const data = parsed.data as z.infer<typeof contentSchemas.project>;
          const directory = `src/content/project/${slug}/`;
          const media = [data.cover, ...data.gallery, ...(data.ogImage ? [data.ogImage] : [])];
          const missingMedia = media.find(
            (path) => !paths.has(`${directory}${path.replace(/^\.\//, "")}`),
          );
          if (missingMedia) throw new Error(`Missing image: ${missingMedia}`);
          const missingTool = data.tools.find((tool) => !paths.has(`src/content/tool/${tool}.md`));
          if (missingTool) throw new Error(`Unknown tool: ${missingTool}`);
          if (data.work && !paths.has(`src/content/work/${data.work}/index.mdx`))
            throw new Error(`Unknown work: ${data.work}`);
        }

        return {
          ...change,
          content: `---\n${document.toString().trimEnd()}\n---\n${body.replace(/^\r?\n*/, "\n").trimEnd()}\n`,
        };
      } catch (error) {
        throw new InvalidContentError(
          `${collection} “${slug}”: ${error instanceof Error ? error.message : "Invalid content"}`,
        );
      }
    }),
  );
}
