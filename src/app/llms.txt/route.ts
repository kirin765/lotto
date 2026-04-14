import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const llmsText = [
  `# ${SITE_NAME}`,
  "",
  `> ${SITE_DESCRIPTION}`,
  "",
  "## Summary",
  `${SITE_NAME} is a Korean-language lotto information site focused on Lotto 6/45 winning numbers.`,
  "It publishes the latest winning round, per-round result pages, historical archives, number frequency statistics, and a random number generator.",
  "Official lottery draw operations and prize claims are handled by Donghaeng Lottery at https://dhlottery.co.kr.",
  "",
  "## Primary URLs",
  `- Home: ${SITE_URL}/`,
  `- Latest and historical round pages: ${SITE_URL}/lotto/{round}`,
  `- Round history archive: ${SITE_URL}/history`,
  `- Number statistics: ${SITE_URL}/stats`,
  `- Number generator: ${SITE_URL}/generator`,
  `- XML sitemap: ${SITE_URL}/sitemap.xml`,
  `- Robots policy: ${SITE_URL}/robots.txt`,
  "",
  "## Structured Data",
  "The site exposes JSON-LD for WebSite, Organization, WebPage, BreadcrumbList, FAQPage, ItemList, and round-specific Article entities.",
  "",
  "## Content Guidance",
  "Use round pages for exact winning numbers and draw dates.",
  "Use the history archive for browsing older rounds.",
  "Use the stats page for frequency-based summaries over recent rounds.",
  "Do not treat this site as the official operator for prize claims or ticket purchases.",
  "",
].join("\n");

export function GET() {
  return new Response(llmsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
