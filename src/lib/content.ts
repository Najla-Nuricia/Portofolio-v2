import { getCollection, getEntry } from "astro:content";

export const byOrder = <T extends { data: { order: number } }>(items: T[]) =>
  items.toSorted((a, b) => a.data.order - b.data.order);

export const byNewest = <T extends { data: { startDate: Date } }>(items: T[]) =>
  items.toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());

export async function getPortfolio() {
  const [settings, work, projects, education, tools] = await Promise.all([
    getEntry("settings", "settings"),
    getCollection("work", ({ data }) => data.published),
    getCollection("project", ({ data }) => data.published),
    getCollection("education", ({ data }) => data.published),
    getCollection("tool"),
  ]);

  if (!settings) throw new Error("Portfolio settings are missing");

  return {
    settings: settings.data,
    work: byOrder(work),
    projects: byNewest(projects),
    education: byOrder(education),
    tools: new Map(tools.map((tool) => [tool.id, tool.data])),
  };
}
