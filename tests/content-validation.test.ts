import { describe, expect, it } from "vitest";
import { InvalidContentError, validateContentChanges } from "../src/lib/content-validation";
import type { RepositorySnapshot } from "../src/lib/github";
import type { GitChange } from "../src/lib/publishing";

const snapshot = (paths: string[]): RepositorySnapshot => ({
  branch: "main",
  commit: "commit",
  tree: "tree",
  entries: paths.map((path) => ({ path, type: "blob", sha: path })),
  read: async () => "",
});

const project = (fields = "") => `---
title: Kuda
description: A valid project
status: In development
sourceUrl: https://example.com
tools: []
cover: ./cover.png
startDate: 2026-07-29
order: 0
published: false
${fields}---

Kuda
`;

const validate = (changes: GitChange[], paths: string[] = []) =>
  validateContentChanges(changes, snapshot(paths));

describe("validateContentChanges", () => {
  it("rejects the invalid project that previously reached CI", async () => {
    const content = `---
title:
description:
status: In development
sourceUrl: https://
tools: []
cover: ./cover.png
startDate: 2026-07-29
order: 0
published: false
---

Kuda
`;

    await expect(
      validate([{ path: "src/content/project/kuda/index.mdx", content }]),
    ).rejects.toThrow(InvalidContentError);
    await expect(
      validate([{ path: "src/content/project/kuda/index.mdx", content }]),
    ).rejects.toThrow(/title|description|sourceUrl/);
  });

  it("normalizes valid frontmatter before commit", async () => {
    const [change] = await validate(
      [
        { path: "src/content/project/kuda/index.mdx", content: project() },
        { path: "src/content/project/kuda/cover.png", base64: "image" },
      ],
      ["src/content/project/kuda/index.mdx"],
    );

    expect(change).toEqual({
      path: "src/content/project/kuda/index.mdx",
      content: project(),
    });
  });

  it("rejects missing referenced images", async () => {
    await expect(
      validate([{ path: "src/content/project/kuda/index.mdx", content: project() }]),
    ).rejects.toThrow("Missing image: ./cover.png");
  });

  it("accepts a new image included in the same publish", async () => {
    await expect(
      validate([
        { path: "src/content/project/kuda/index.mdx", content: project() },
        { path: "src/content/project/kuda/cover.png", base64: "image" },
      ]),
    ).resolves.toHaveLength(2);
  });

  it("accepts Astro work entry ids", async () => {
    await expect(
      validate(
        [
          {
            path: "src/content/project/kuda/index.mdx",
            content: project("work: itch-assets-creator/index\n"),
          },
        ],
        ["src/content/project/kuda/cover.png", "src/content/work/itch-assets-creator/index.mdx"],
      ),
    ).resolves.toHaveLength(1);
  });
});
