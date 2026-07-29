import { describe, expect, it } from "vitest";
import { resolveContentChanges } from "../src/lib/content-mutations";
import type { RepositorySnapshot } from "../src/lib/github";

const snapshot: RepositorySnapshot = {
  branch: "main",
  commit: "commit",
  tree: "tree",
  entries: [
    { path: "src/content/project/kuda/index.mdx", type: "blob", sha: "mdx" },
    { path: "src/content/project/kuda/cover.png", type: "blob", sha: "cover" },
  ],
  read: async () => "",
};

describe("resolveContentChanges", () => {
  it("does not treat an image deletion as deleting the project", async () => {
    const changes = [
      { path: "src/content/project/kuda/index.mdx", content: "content" },
      { path: "src/content/project/kuda/cover.png", delete: true as const },
    ];

    await expect(
      resolveContentChanges({ changes, message: "Update project: kuda" }, snapshot),
    ).resolves.toEqual(changes);
  });

  it("expands project content deletion to its whole directory", async () => {
    await expect(
      resolveContentChanges(
        {
          changes: [{ path: "src/content/project/kuda/index.mdx", delete: true }],
          message: "Delete project: kuda",
        },
        snapshot,
      ),
    ).resolves.toEqual([
      { path: "src/content/project/kuda/index.mdx", delete: true },
      { path: "src/content/project/kuda/cover.png", delete: true },
    ]);
  });
});
