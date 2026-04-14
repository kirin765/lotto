import type { Metadata, Viewport } from "next";
import {
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 동행복권 로또 6/45 최신 결과`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "로또",
    "로또 당첨번호",
    "로또 6/45",
    "동행복권",
    "이번주 로또번호",
    "로또 번호 생성기",
    "로또 통계",
    "로또 결과",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 동행복권 로또 6/45`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="df1237c3d3cee087725d449c4ec8b4532f189628"
        />
        {/* Pretendard 폰트 CDN preconnect + preload */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="KR-11" />
        <meta name="geo.placename" content="Seoul" />
        <meta name="language" content="Korean" />
        <meta httpEquiv="content-language" content={SITE_LANGUAGE} />
        <JsonLd data={generateWebsiteJsonLd()} />
        <JsonLd data={generateOrganizationJsonLd()} />
      </head>
      <body className="min-h-dvh flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
