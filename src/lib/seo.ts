import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TOPIC,
  SITE_URL,
} from "./constants";

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
      locale: SITE_LOCALE,
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
        ? { index: false, follow: true }
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
    keywords: ["로또", "로또 당첨번호", "로또 6/45", `제${roundNo}회`, "동행복권"],
    inLanguage: "ko",
    image: `${pageUrl}/opengraph-image`,
    author: {
      "@type": "Organization",
      name: "동행복권",
      url: "https://dhlottery.co.kr",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-192.png`,
        width: 192,
        height: 192,
      },
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
    inLanguage: SITE_LANGUAGE,
    about: SITE_TOPIC,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    knowsAbout: [
      "로또 6/45 당첨번호",
      "회차별 로또 결과",
      "로또 번호 통계",
      "로또 번호 생성",
    ],
  };
}

interface WebPageJsonLdParams {
  title: string;
  description: string;
  path?: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage";
}

export function generateWebPageJsonLd({
  title,
  description,
  path = "",
  type = "WebPage",
}: WebPageJsonLdParams) {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    url,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: SITE_TOPIC,
    inLanguage: SITE_LANGUAGE,
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

export function generateFAQJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateItemListJsonLd(
  name: string,
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
