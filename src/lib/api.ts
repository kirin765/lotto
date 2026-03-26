import type { LottoRound, DhlotteryApiResponse } from "@/types/lotto";
import { estimateLatestRound, sortNumbers } from "./utils";
import { SITE_URL } from "./constants";

const NAVER_SEARCH = "https://m.search.naver.com/search.naver";
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15";

function parseLottoResponse(data: DhlotteryApiResponse): LottoRound {
  return {
    roundNo: data.drwNo,
    drawDate: data.drwNoDate,
    numbers: sortNumbers([
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ]),
    bonusNo: data.bnusNo,
    totalSalesAmount: data.totSellamnt,
    firstPrizeAmount: data.firstWinamnt,
    firstPrizeWinners: data.firstPrzwnerCo,
  };
}

function parseNaverHtml(html: string): DhlotteryApiResponse | null {
  const roundMatch = html.match(
    /data-text="(\d+)회차\s*\((\d{4}\.\d{2}\.\d{2})\.\)"/
  );
  if (!roundMatch) return null;

  const drwNo = parseInt(roundMatch[1], 10);
  const drwNoDate = roundMatch[2].replace(/\./g, "-");

  const ballMatches = [...html.matchAll(/class="ball type\d">(\d+)/g)];
  if (ballMatches.length < 6) return null;

  const bonusMatch = html.match(
    /bonus_number">\s*<span class="ball type\d">(\d+)/
  );
  const bnusNo = bonusMatch ? parseInt(bonusMatch[1], 10) : 0;

  const mainNums = ballMatches.slice(0, 6).map((m) => parseInt(m[1], 10));

  const prizeMatch = html.match(
    /1등 당첨금[\s\S]*?([\d,]+)\s*원[\s\S]*?당첨 복권수\s*(\d+)/
  );
  const firstWinamnt = prizeMatch
    ? parseInt(prizeMatch[1].replace(/,/g, ""), 10)
    : 0;
  const firstPrzwnerCo = prizeMatch ? parseInt(prizeMatch[2], 10) : 0;

  const amounts = [...html.matchAll(/([\d,]+)원/g)].map((m) =>
    parseInt(m[1].replace(/,/g, ""), 10)
  );
  const totSellamnt = amounts.length > 0 ? Math.max(...amounts) : 0;

  return {
    returnValue: "success",
    drwNo,
    drwNoDate,
    drwtNo1: mainNums[0],
    drwtNo2: mainNums[1],
    drwtNo3: mainNums[2],
    drwtNo4: mainNums[3],
    drwtNo5: mainNums[4],
    drwtNo6: mainNums[5],
    bnusNo,
    firstPrzwnerCo,
    firstWinamnt,
    firstAccumamnt: firstWinamnt * firstPrzwnerCo,
    totSellamnt,
  };
}

/** 네이버 검색에서 특정 회차 데이터 스크래핑 */
async function fetchFromNaver(
  roundNo: number | "latest"
): Promise<DhlotteryApiResponse | null> {
  try {
    const query =
      roundNo === "latest"
        ? "로또당첨번호"
        : `로또 ${roundNo}회 당첨번호`;
    const url = `${NAVER_SEARCH}?where=m&query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      next: { revalidate: roundNo === "latest" ? 3600 : false },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return parseNaverHtml(html);
  } catch {
    return null;
  }
}

/** 자체 API Route를 통한 프록시 호출 */
async function fetchViaProxy(
  roundNo: number | "latest"
): Promise<DhlotteryApiResponse | null> {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : SITE_URL;
    const res = await fetch(`${base}/api/lotto?drwNo=${roundNo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || data.returnValue !== "success") return null;
    return data as DhlotteryApiResponse;
  } catch {
    return null;
  }
}

export async function fetchLottoRound(
  roundNo: number
): Promise<LottoRound | null> {
  // 1차: 네이버 검색 스크래핑 (서버 사이드)
  let data = await fetchFromNaver(roundNo);
  // 2차: 자체 프록시 경유
  if (!data) data = await fetchViaProxy(roundNo);
  if (!data) return null;
  return parseLottoResponse(data);
}

export async function fetchLatestRound(): Promise<LottoRound | null> {
  // 네이버 "로또당첨번호" 검색은 항상 최신 회차를 반환
  const data = await fetchFromNaver("latest");
  if (data) return parseLottoResponse(data);
  // 폴백: 추정 회차로 순차 시도
  const round = estimateLatestRound();
  for (let i = 0; i < 3; i++) {
    const result = await fetchLottoRound(round - i);
    if (result) return result;
  }
  return null;
}

export async function fetchMultipleRounds(
  startRound: number,
  count: number
): Promise<LottoRound[]> {
  const promises: Promise<LottoRound | null>[] = [];
  for (let i = 0; i < count; i++) {
    const roundNo = startRound - i;
    if (roundNo < 1) break;
    promises.push(fetchLottoRound(roundNo));
  }
  const results = await Promise.all(promises);
  return results.filter((r): r is LottoRound => r !== null);
}
