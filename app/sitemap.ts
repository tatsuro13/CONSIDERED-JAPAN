import { MetadataRoute } from "next";
import { getSeasonPicks, getJournalPosts } from "@/lib/notion";

const BASE_URL = "https://considered-japan-git-main-tatsuro13s-projects.vercel.app";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/season`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/buy-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [picks, posts] = await Promise.all([getSeasonPicks(), getJournalPosts()]);

    const seasonRoutes: MetadataRoute.Sitemap = picks.map((pick) => ({
      url: `${BASE_URL}/season/${pick.slug}`,
      lastModified: pick.date ? new Date(pick.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const journalRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/journal/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...seasonRoutes, ...journalRoutes];
  } catch {
    return staticRoutes;
  }
}
