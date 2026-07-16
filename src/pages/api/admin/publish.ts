import type { APIRoute } from "astro";
import { z } from "zod";
import { resolveContentChanges } from "../../../lib/content-mutations";
import { commitChanges, getRepositorySnapshot } from "../../../lib/github";
import {
  ContentReferencedError,
  PublishConflictError,
  type PublishRequest,
} from "../../../lib/publishing";

const path = z.string().regex(/^src\/content\/[a-z-]+\/[a-z0-9-]+(?:\/[a-z0-9.-]+|\.md)$/);
const change = z.union([
  z.object({ path, content: z.string() }).strict(),
  z.object({ path, base64: z.string() }).strict(),
  z.object({ path, delete: z.literal(true) }).strict(),
]);
const publishRequest = z.object({
  changes: z.array(change).min(1).max(50),
  message: z.string().min(1).max(120),
});

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GITHUB_TOKEN;
  const repository = import.meta.env.GITHUB_REPOSITORY;
  if (!token || !repository)
    return Response.json({ error: "GitHub publishing is not configured" }, { status: 503 });

  const author = request.headers.get("cf-access-authenticated-user-email") ?? "local-author";
  const parsed = publishRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "Invalid publishing request", issues: parsed.error.issues },
      { status: 400 },
    );

  try {
    const snapshot = await getRepositorySnapshot(repository, token);
    const publish = parsed.data as PublishRequest;
    const changes = await resolveContentChanges(publish, snapshot);
    const sha = await commitChanges({
      repository,
      token,
      author,
      snapshot,
      request: { ...publish, changes },
    });
    return Response.json({ published: true, sha });
  } catch (error) {
    if (error instanceof PublishConflictError)
      return Response.json(
        { error: "Publish conflict. Refresh and reapply your edits." },
        { status: 409 },
      );
    if (error instanceof ContentReferencedError)
      return Response.json({ error: error.message }, { status: 422 });
    console.error(error);
    return Response.json({ error: "GitHub rejected the publishing commit" }, { status: 502 });
  }
};
