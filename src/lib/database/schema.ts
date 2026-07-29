import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const art = sqliteTable("art", {
  id: text().primaryKey(),
  name: text().notNull(),
  image: text().notNull().unique(),
  order: integer().notNull(),
  featured: integer({ mode: "boolean" }).notNull().default(false),
  hidden: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Art = typeof art.$inferSelect;
export type NewArt = typeof art.$inferInsert;
