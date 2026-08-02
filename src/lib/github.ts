import type { PublishRequest } from "./publishing";
import { PublishConflictError } from "./publishing";

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "User-Agent": "najla-portfolio-bot",
  "X-GitHub-Api-Version": "2022-11-28",
});

const encode = (content: string) =>
  btoa(String.fromCodePoint(...new TextEncoder().encode(content)));

export interface TreeEntry {
  path: string;
  type: "blob" | "tree";
  sha: string;
}

export interface RepositorySnapshot {
  branch: string;
  commit: string;
  tree: string;
  entries: TreeEntry[];
  read: (entry: TreeEntry) => Promise<string>;
}

const decode = (content: string) =>
  new TextDecoder().decode(
    Uint8Array.from(atob(content.replace(/\n/g, "")), (character) => character.charCodeAt(0)),
  );

export class GitHubApiError extends Error {
  constructor(
    readonly status: number,
    readonly operation: string,
    detail: string,
  ) {
    super(`${operation} failed (${status}): ${detail}`);
  }
}

const github = (repository: string, token: string) => {
  const api = `https://api.github.com/repos/${repository}`;
  const request = async <T>(path: string, init?: RequestInit) => {
    const response = await fetch(`${api}${path}`, { ...init, headers: headers(token) });
    if (!response.ok)
      throw new GitHubApiError(
        response.status,
        `${init?.method ?? "GET"} ${path}`,
        await response.text(),
      );
    return response.json() as Promise<T>;
  };
  return { request };
};

export async function getRepositorySnapshot(repository: string, token: string) {
  const { request } = github(repository, token);
  const repositoryInfo = await request<{ default_branch: string }>("");
  const branch = repositoryInfo.default_branch;
  const ref = await request<{ object: { sha: string } }>(`/git/ref/heads/${branch}`);
  const commit = await request<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
  const tree = await request<{ tree: TreeEntry[] }>(`/git/trees/${commit.tree.sha}?recursive=1`);

  return {
    branch,
    commit: ref.object.sha,
    tree: commit.tree.sha,
    entries: tree.tree,
    read: async (entry: TreeEntry) =>
      decode((await request<{ content: string }>(`/git/blobs/${entry.sha}`)).content),
  } satisfies RepositorySnapshot;
}

export async function commitChanges(options: {
  repository: string;
  token: string;
  author: string;
  request: PublishRequest;
  snapshot?: RepositorySnapshot;
}) {
  const { repository, token, author, request: publishRequest } = options;
  const snapshot = options.snapshot ?? (await getRepositorySnapshot(repository, token));
  const { request } = github(repository, token);
  const changes = [
    ...new Map(publishRequest.changes.map((change) => [change.path, change])).values(),
  ];
  const tree = await Promise.all(
    changes.map(async (change) => {
      if ("delete" in change) return { path: change.path, mode: "100644", type: "blob", sha: null };
      const blob = await request<{ sha: string }>("/git/blobs", {
        method: "POST",
        body: JSON.stringify({
          content: "base64" in change ? change.base64 : encode(change.content),
          encoding: "base64",
        }),
      });
      return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );
  const nextTree = await request<{ sha: string }>("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: snapshot.tree, tree }),
  });
  const nextCommit = await request<{ sha: string }>("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message: `${publishRequest.message}\n\nAuthor: ${author}`,
      tree: nextTree.sha,
      parents: [snapshot.commit],
      committer: {
        name: "najla-portfolio-bot",
        email: "najla-portfolio-bot@users.noreply.github.com",
      },
    }),
  });
  try {
    await request(`/git/refs/heads/${snapshot.branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: nextCommit.sha, force: false }),
    });
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 409) throw new PublishConflictError();
    throw error;
  }
  return nextCommit.sha;
}
