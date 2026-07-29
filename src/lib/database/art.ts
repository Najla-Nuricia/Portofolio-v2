import { asc, desc, eq } from "drizzle-orm";
import { database } from "./client";
import { art, type NewArt } from "./schema";

export const listArt = () =>
  database().select().from(art).orderBy(desc(art.featured), asc(art.order)).all();

export const createArt = (items: NewArt[]) =>
  items.length ? database().insert(art).values(items).returning() : Promise.resolve([]);

export const deleteArt = (id: string) => database().delete(art).where(eq(art.id, id)).returning();
