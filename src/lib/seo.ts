import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

interface SeoParams {
  title?: string;
  description?: string;
  path?: string;
  canonical?: string;
  noIndex?: boolean;
  robots?: Metadata["robots"];
  openGraphType?: "website" | "article";
  images?: string[];
}

export function generateMeta({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  canonical,
  noIndex = false,
  robots,
  openGraphType = "website",
  images = [],
}: SeoParams = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalPath = canonical ?? path;
  const url = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${SITE_URL}${canonicalPath}`;
  const ogImages = images.map((image) =>
    image.startsWith("http") ? image : `${SITE_URL}${image}`
  );

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: openGraphType,
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    robots:
      robots ??
      (noIndex
        ? { index: false, follow: false }
        : { index: true, follow: true }),
  };
}

export function generateRoundJsonLd(
  roundNo: number,
  date: string,
  numbers: number[],
  bonusNo: number
) {
  const pageUrl = `${SITE_URL}/lotto/${roundNo}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `제 ${roundNo}회 로또 당첨번호`,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: date,
    dateModified: date,
    description: `로또 6/45 제 ${roundNo}회 당첨번호: ${numbers.join(", ")} + 보너스 ${bonusNo}`,
    image: `${pageUrl}/opengraph-image`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
