import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

interface SeoParams {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function generateMeta({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  noIndex = false,
}: SeoParams = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateRoundJsonLd(
  roundNo: number,
  date: string,
  numbers: number[],
  bonusNo: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `제 ${roundNo}회 로또 당첨번호`,
    datePublished: date,
    description: `로또 6/45 제 ${roundNo}회 당첨번호: ${numbers.join(", ")} + 보너스 ${bonusNo}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
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
