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
    prizes: data.prizes ?? [],
  };
}

export type FetchLottoRoundResult =
  | { status: "success"; round: LottoRound }
  | { status: "not_found" }
  | { status: "error" };

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

  // 1~5등 당첨 정보 파싱
  const prizePattern =
    /<th scope="row" rowspan="\d+">(\d)등<\/th>\s*<td class="sub_title">총 당첨금<\/td>\s*<td>([\d,]+)원<\/td>[\s\S]*?당첨 복권수<\/td>\s*<td>([\d,]+)개<\/td>[\s\S]*?1개당 당첨금<\/td>\s*<td>([\d,]+)원<\/td>/g;
  const prizes = [...html.matchAll(prizePattern)].map((m) => ({
    rank: parseInt(m[1], 10),
    totalAmount: parseInt(m[2].replace(/,/g, ""), 10),
    winnerCount: parseInt(m[3].replace(/,/g, ""), 10),
    perAmount: parseInt(m[4].replace(/,/g, ""), 10),
  }));

  const first = prizes.find((p) => p.rank === 1);
  const firstWinamnt = first?.perAmount ?? 0;
  const firstPrzwnerCo = first?.winnerCount ?? 0;

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
    prizes,
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
): Promise<FetchLottoRoundResult> {
  if (roundNo < 1) return { status: "not_found" };

  // 1차: 네이버 검색 스크래핑 (서버 사이드)
  let data = await fetchFromNaver(roundNo);
  if (data && data.drwNo !== roundNo) return { status: "not_found" };

  // 2차: 자체 프록시 경유
  if (!data) data = await fetchViaProxy(roundNo);
  if (data && data.drwNo !== roundNo) return { status: "not_found" };

  if (!data) return { status: "error" };
  return { status: "success", round: parseLottoResponse(data) };
}

export async function fetchLatestRound(): Promise<LottoRound | null> {
  // 네이버 "로또당첨번호" 검색은 항상 최신 회차를 반환
  const data = await fetchFromNaver("latest");
  if (data) return parseLottoResponse(data);
  // 폴백: 추정 회차로 순차 시도
  const round = estimateLatestRound();
  for (let i = 0; i < 3; i++) {
    const result = await fetchLottoRound(round - i);
    if (result.status === "success") return result.round;
  }
  return null;
}

export async function fetchMultipleRounds(
  startRound: number,
  count: number
): Promise<LottoRound[]> {
  const promises: Promise<FetchLottoRoundResult>[] = [];
  for (let i = 0; i < count; i++) {
    const roundNo = startRound - i;
    if (roundNo < 1) break;
    promises.push(fetchLottoRound(roundNo));
  }
  const results = await Promise.all(promises);
  return results
    .filter(
      (result): result is { status: "success"; round: LottoRound } =>
        result.status === "success"
    )
    .map((result) => result.round);
}
