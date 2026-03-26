import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { estimateLatestRound } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestRound = estimateLatestRound();
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/history`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/stats`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/generator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 최근 200회차만 sitemap에 포함 (검색엔진 효율)
  const roundPages: MetadataRoute.Sitemap = [];
  const count = Math.min(latestRound, 200);
  for (let i = 0; i < count; i++) {
    const roundNo = latestRound - i;
    roundPages.push({
      url: `${SITE_URL}/lotto/${roundNo}`,
      lastModified: now,
      changeFrequency: roundNo === latestRound ? "daily" : "yearly",
      priority: roundNo === latestRound ? 0.9 : 0.5,
    });
  }

  return [...staticPages, ...roundPages];
}
