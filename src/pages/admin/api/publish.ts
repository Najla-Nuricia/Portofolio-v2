import { publishRequestSchema } from "../../../../schema/api";
import { ApiError, attempt, json } from "@/lib/api";
import { resolveContentChanges } from "@/lib/content-mutations";
import { InvalidContentError, validateContentChanges } from "@/lib/content-validation";
import { commitChanges, getRepositorySnapshot, GitHubApiError } from "@/lib/github";
import {
  ContentReferencedError,
  PublishConflictError,
  type PublishRequest,
} from "@/lib/publishing";
import type { APIRoute } from "astro";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";

const publishError = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      Match.instanceOf(InvalidContentError),
      (failure) => new ApiError({ message: failure.message, status: 422 }),
    ),
    Match.when(
      Match.instanceOf(PublishConflictError),
      () =>
        new ApiError({
          message: "Publish conflict. Refresh and reapply your edits.",
          status: 409,
        }),
    ),
    Match.when(
      Match.instanceOf(ContentReferencedError),
      (failure) => new ApiError({ message: failure.message, status: 422 }),
    ),
    Match.when(
      Match.instanceOf(GitHubApiError),
      (failure) => new ApiError({ message: failure.message, status: 502 }),
    ),
    Match.orElse(() => new ApiError({ message: "Publishing failed", status: 502 })),
  );

export const POST: APIRoute = ({ request }) =>
  json(
    Effect.gen(function* () {
      const token = import.meta.env.GITHUB_TOKEN;
      const repository = import.meta.env.GITHUB_REPOSITORY;
      if (!token || !repository)
        return yield* new ApiError({ message: "GitHub publishing is not configured", status: 503 });

      const body = yield* attempt(() => request.json(), {
        message: "Invalid publishing request",
        status: 400,
      });
      const parsed = publishRequestSchema.safeParse(body);
      if (!parsed.success)
        return yield* new ApiError({ message: "Invalid publishing request", status: 400 });

      const author = request.headers.get("cf-access-authenticated-user-email") ?? "local-author";
      const result = yield* Effect.tryPromise({
        try: async () => {
          const snapshot = await getRepositorySnapshot(repository, token);
          const publish = parsed.data as PublishRequest;
          const resolved = await resolveContentChanges(publish, snapshot);
          const changes = await validateContentChanges(resolved, snapshot);
          const sha = await commitChanges({
            repository,
            token,
            author,
            snapshot,
            request: { ...publish, changes },
          });
          return { published: true, sha };
        },
        catch: publishError,
      });
      return result;
    }),
  );
