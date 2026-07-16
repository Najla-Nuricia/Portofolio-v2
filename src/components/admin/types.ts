export type CollectionName = "work" | "project" | "education" | "tool" | "settings";

export interface MediaAsset {
  name: string;
  path: string;
  url: string;
}

export interface PendingMedia extends MediaAsset {
  file: File;
}

export interface ContentRow {
  collection: CollectionName;
  slug: string;
  title: string;
  status: string;
  order?: number;
  content: string;
  media: MediaAsset[];
}

export interface EditorValues {
  collection: CollectionName;
  slug: string;
  content: string;
}

export const collections: CollectionName[] = ["project", "work", "education", "tool"];

export const collectionLabel: Record<CollectionName, string> = {
  project: "Project",
  work: "Work",
  education: "Education",
  tool: "Tool",
  settings: "Settings",
};

const today = () => new Date().toISOString().slice(0, 10);

export const blankContent: Record<CollectionName, string> = {
  work: `---\ntitle: \norganization: \nrole: \nstartDate: ${today()}\norder: 0\npublished: false\n---\n\n`,
  project: `---\ntitle: \ndescription: \nstatus: In development\nsourceUrl: https://\ntools: []\ncover: ./cover.png\nstartDate: ${today()}\norder: 0\npublished: false\n---\n\n`,
  education: `---\ntitle: \norganization: \nstartDate: ${today()}\norder: 0\npublished: false\n---\n\n`,
  tool: `---\nname: \n---\n`,
  settings: "",
};
