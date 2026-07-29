export interface ArtItem {
  id: string;
  name: string;
  image: string;
  order: number;
  featured: boolean;
  hidden: boolean;
}

export const artUrl = (image: string) =>
  `${import.meta.env.DEV ? "https://nacia.ryuko.my.id" : ""}/media/art/${encodeURIComponent(image)}`;
