import { MetadataRoute } from "next";

const BASE_URL = "https://considered-japan-git-main-tatsuro13s-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
