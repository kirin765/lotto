import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI 학습 크롤러 차단
      { userAgent: "GPTBot", disallow: ["/"] },
      { userAgent: "OAI-SearchBot", disallow: ["/"] },
      { userAgent: "ChatGPT-User", disallow: ["/"] },
      { userAgent: "ClaudeBot", disallow: ["/"] },
      { userAgent: "anthropic-ai", disallow: ["/"] },
      { userAgent: "Claude-Web", disallow: ["/"] },
      { userAgent: "CCBot", disallow: ["/"] },
      { userAgent: "Google-Extended", disallow: ["/"] },
      { userAgent: "Bytespider", disallow: ["/"] },
      { userAgent: "FacebookBot", disallow: ["/"] },
      { userAgent: "Applebot-Extended", disallow: ["/"] },
      { userAgent: "cohere-ai", disallow: ["/"] },
      { userAgent: "PerplexityBot", disallow: ["/"] },
      { userAgent: "YouBot", disallow: ["/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
