import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { estimateDrawDate, estimateLatestRound } from "@/lib/utils";

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

  // 유효한 전체 회차를 sitemap에 포함
  const roundPages: MetadataRoute.Sitemap = [];
  for (let roundNo = latestRound; roundNo >= 1; roundNo--) {
    const drawDate = estimateDrawDate(roundNo);
    roundPages.push({
      url: `${SITE_URL}/lotto/${roundNo}`,
      lastModified: `${drawDate}T00:00:00+09:00`,
      changeFrequency: roundNo === latestRound ? "daily" : "yearly",
      priority: roundNo === latestRound ? 0.9 : 0.5,
    });
  }

  return [...staticPages, ...roundPages];
}
