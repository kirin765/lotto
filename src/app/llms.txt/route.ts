import {
  PLAY_STORE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

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
  `- Android app download: ${SITE_URL}/app`,
  `- XML sitemap: ${SITE_URL}/sitemap.xml`,
  `- Robots policy: ${SITE_URL}/robots.txt`,
  "",
  "## Key Facts (Lotto 6/45)",
  "- Draw schedule: every Saturday at 20:35 KST, broadcast live on MBC.",
  "- Ticket sales close at 20:00 KST on the draw day.",
  "- A ticket selects 6 distinct numbers from 1 to 45; a bonus number is also drawn.",
  "- Total number of combinations: 8,145,060.",
  "- First-prize (jackpot) odds: 1 in 8,145,060.",
  "- Prize claim period: within 1 year of the draw date; unclaimed prizes expire.",
  "- A single ticket (one game) costs 1,000 KRW.",
  "",
  "## Android App",
  `${SITE_NAME} offers a free Android app that mirrors this website's data.`,
  `- Google Play: ${PLAY_STORE_URL}`,
  `- Package name: kr.lotto6.twa`,
  "- Cost: free. Features: latest and historical winning numbers, frequency statistics, and a random number generator.",
  "- The app is for checking results only; ticket purchases and prize claims are handled by Donghaeng Lottery.",
  "",
  "## Structured Data",
  "The site exposes JSON-LD for WebSite, Organization, WebPage, BreadcrumbList, FAQPage, ItemList, MobileApplication, and round-specific Article entities.",
  "",
  "## Content Guidance",
  "Use round pages for exact winning numbers and draw dates.",
  "Use the history archive for browsing older rounds.",
  "Use the stats page for frequency-based summaries over recent rounds.",
  "Use the /app page for Android app download details.",
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
