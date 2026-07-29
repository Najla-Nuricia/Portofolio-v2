import { describe, expect, it } from "vitest";
import {
  artManifest,
  moveDraft,
  toggleFeatured,
  updateDraft,
  type DraftArt,
} from "../src/lib/art-draft";

const item = (id: string, order: number, featured = false): DraftArt => ({
  id,
  name: id,
  image: `${id}.webp`,
  order,
  featured,
  hidden: false,
  url: `/${id}.webp`,
});

const gallery = [item("a", 0, true), item("b", 1), item("c", 2)];

describe("art draft", () => {
  it("features an artwork and moves it first", () => {
    const result = toggleFeatured(gallery, "c");
    expect(result.map(({ id }) => id)).toEqual(["c", "a", "b"]);
    expect(result[0].featured).toBe(true);
  });

  it("unfeatures without changing its position", () => {
    const result = toggleFeatured(gallery, "a");
    expect(result.map(({ id }) => id)).toEqual(["a", "b", "c"]);
    expect(result[0].featured).toBe(false);
  });

  it("renames without changing feature or order", () => {
    const result = updateDraft(gallery, "a", { name: "Renamed" });
    expect(result[0]).toMatchObject({ name: "Renamed", featured: true, order: 0 });
  });

  it("moves one artwork and normalizes order", () => {
    const result = moveDraft(gallery, "c", "a");
    expect(result.map(({ id, order }) => [id, order])).toEqual([
      ["c", 0],
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("saves edited form names without replacing card objects", () => {
    const names = Object.fromEntries(gallery.map(({ id, name }) => [id, name]));
    names.b = "  New name  ";
    const result = artManifest(gallery, names);
    expect(result).toHaveLength(3);
    expect(result[1]).toMatchObject({ name: "New name", featured: false, order: 1 });
  });
});
