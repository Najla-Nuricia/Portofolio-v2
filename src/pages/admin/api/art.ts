import { artImageName } from "../../../../schema/api";
import { artGallerySchema } from "../../../../schema/content";
import { ApiError, attempt, json } from "@/lib/api";
import { database } from "@/lib/database/client";
import { art } from "@/lib/database/schema";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { eq, notInArray } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { z } from "zod";

const idSchema = z.object({ id: z.string().min(1) });

export const POST: APIRoute = ({ request }) =>
  json(
    Effect.gen(function* () {
      const form = yield* attempt(() => request.formData(), {
        message: "Invalid upload request",
        status: 400,
      });
      const manifest = yield* Effect.try({
        try: () => artGallerySchema.parse(JSON.parse(String(form.get("manifest") ?? "null"))),
        catch: () => new ApiError({ message: "Invalid art gallery", status: 400 }),
      });
      const uploads = form.getAll("images");
      if (uploads.length > 50)
        return yield* new ApiError({ message: "Too many images", status: 400 });
      if (
        uploads.some(
          (upload) =>
            !(upload instanceof File) ||
            !upload.type.startsWith("image/") ||
            !artImageName.test(upload.name),
        )
      )
        return yield* new ApiError({ message: "Invalid image upload", status: 400 });

      const db = database();
      const now = new Date();
      yield* attempt(
        async () => {
          const uploaded = uploads as File[];
          await Promise.all(
            uploaded.map((upload) =>
              env.ART_BUCKET.put(`art/${upload.name}`, upload.stream(), {
                httpMetadata: {
                  contentType: upload.type,
                  cacheControl: "public, max-age=31536000, immutable",
                },
              }),
            ),
          );
          const queries = manifest.map((item) =>
            db
              .insert(art)
              .values({ ...item, createdAt: now, updatedAt: now })
              .onConflictDoUpdate({
                target: art.id,
                set: {
                  name: item.name,
                  image: item.image,
                  order: item.order,
                  featured: item.featured,
                  hidden: item.hidden,
                  updatedAt: now,
                },
              }),
          );
          try {
            if (queries.length) await db.batch(queries as [(typeof queries)[0], ...typeof queries]);
            const ids = manifest.map((item) => item.id);
            if (ids.length) await db.delete(art).where(notInArray(art.id, ids)).run();
          } catch (error) {
            await Promise.all(
              uploaded.map((upload) => env.ART_BUCKET.delete(`art/${upload.name}`)),
            );
            throw error;
          }
        },
        { message: "Gallery save failed", status: 502 },
      );
      return { uploaded: uploads.length, items: manifest.length };
    }),
  );

export const DELETE: APIRoute = ({ request }) =>
  json(
    Effect.gen(function* () {
      const body = yield* attempt(() => request.json(), {
        message: "Invalid gallery deletion",
        status: 400,
      });
      const parsed = idSchema.safeParse(body);
      if (!parsed.success)
        return yield* new ApiError({ message: "Invalid artwork id", status: 400 });

      const db = database();
      const item = yield* attempt(
        () => db.select().from(art).where(eq(art.id, parsed.data.id)).get(),
        {
          message: "Gallery database unavailable",
          status: 502,
        },
      );
      if (!item) return yield* new ApiError({ message: "Artwork not found", status: 404 });

      yield* attempt(
        async () => {
          await env.ART_BUCKET.delete(`art/${item.image}`);
          await db.delete(art).where(eq(art.id, item.id)).run();
        },
        { message: "Artwork deletion failed", status: 502 },
      );
      return { deleted: item.id };
    }),
  );
