import { artImageName } from "../../../../schema/api";
import { ApiError, attempt } from "@/lib/api";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";

const objectResponse = (object: R2Object | R2ObjectBody | null) =>
  Match.value(object).pipe(
    Match.when(Match.null, () => new Response(null, { status: 404 })),
    Match.when({ body: Match.defined }, (body) => {
      const headers = new Headers();
      body.writeHttpMetadata(headers);
      headers.set("etag", body.httpEtag);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      return new Response(body.body, { status: 200, headers });
    }),
    Match.orElse((metadata) => {
      const headers = new Headers();
      metadata.writeHttpMetadata(headers);
      headers.set("etag", metadata.httpEtag);
      return new Response(null, { status: 412, headers });
    }),
  );

export const GET: APIRoute = ({ params, request }) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const image = yield* Match.value(params.image).pipe(
        Match.when(
          (value): value is string => typeof value === "string" && artImageName.test(value),
          (value) => Effect.succeed(value),
        ),
        Match.orElse(() => Effect.fail(new ApiError({ message: "Image not found", status: 404 }))),
      );
      const object = yield* attempt(
        () =>
          env.ART_BUCKET.get(`art/${image}`, { range: request.headers, onlyIf: request.headers }),
        { message: "Image storage unavailable", status: 502 },
      );
      return objectResponse(object);
    }).pipe(
      Effect.catchTag("ApiError", (error) =>
        Effect.succeed(new Response(error.message, { status: error.status })),
      ),
    ),
  );
