import * as Data from "effect/Data";
import { z } from "zod";

export class ApiError extends Data.TaggedError("ApiError")<{
  message: string;
  status: number;
}> {}

const contentPath = z
  .string()
  .regex(/^src\/content\/(?:settings\.md|[a-z-]+\/[a-z0-9-]+(?:\/[a-z0-9.-]+|\.md))$/);

const contentChange = z.union([
  z.object({ path: contentPath, content: z.string() }).strict(),
  z.object({ path: contentPath, base64: z.string() }).strict(),
  z.object({ path: contentPath, delete: z.literal(true) }).strict(),
]);

export const publishRequestSchema = z.object({
  changes: z.array(contentChange).min(1).max(50),
  message: z.string().min(1).max(120),
});

export const artImageName = /^[a-z0-9.-]+$/;
