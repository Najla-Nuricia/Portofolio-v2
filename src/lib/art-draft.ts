import type { ArtItem } from "./art";

export interface DraftArt extends ArtItem {
  url: string;
  file?: File;
}

const ordered = (items: DraftArt[]) => items.map((item, order) => ({ ...item, order }));

export const updateDraft = (items: DraftArt[], id: string, fields: Partial<DraftArt>) =>
  items.map((item) => (item.id === id ? { ...item, ...fields } : item));

export const toggleFeatured = (items: DraftArt[], id: string) => {
  const item = items.find((entry) => entry.id === id);
  if (!item) return items;
  const updated = { ...item, featured: !item.featured };
  if (!updated.featured) return updateDraft(items, id, updated);
  return ordered([updated, ...items.filter((entry) => entry.id !== id)]);
};

export const moveDraft = (items: DraftArt[], source: string, target: string) => {
  if (source === target) return items;
  const next = [...items];
  const from = next.findIndex((item) => item.id === source);
  const to = next.findIndex((item) => item.id === target);
  if (from < 0 || to < 0) return items;
  next.splice(to, 0, next.splice(from, 1)[0]);
  return ordered(next);
};

export const artManifest = (items: DraftArt[], names: Record<string, string>) =>
  items.map(({ id, image, featured, hidden }, order) => ({
    id,
    name: names[id].trim(),
    image,
    order,
    featured,
    hidden,
  }));
