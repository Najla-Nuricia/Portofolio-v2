import { ApiError } from "../../schema/api";
import * as Effect from "effect/Effect";

export { ApiError };

export const json = <A>(effect: Effect.Effect<A, ApiError>) =>
  Effect.runPromise(
    effect.pipe(
      Effect.map((value) => Response.json(value)),
      Effect.catchTag("ApiError", ({ message, status }) =>
        Effect.succeed(Response.json({ error: message }, { status })),
      ),
    ),
  );

export const attempt = <A>(
  evaluate: () => Promise<A>,
  error: { message: string; status: number },
) =>
  Effect.tryPromise({
    try: evaluate,
    catch: () => new ApiError(error),
  });
