import type { LottoRound, DhlotteryApiResponse } from "@/types/lotto";
import { estimateLatestRound, sortNumbers } from "./utils";
import { SITE_URL } from "./constants";

const DHLOTTERY_API = "https://www.dhlottery.co.kr/common.do";

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

/** 동행복권 직접 호출 (redirect:manual로 302 감지) */
async function fetchDirect(roundNo: number): Promise<DhlotteryApiResponse | null> {
  try {
    const res = await fetch(
      `${DHLOTTERY_API}?method=getLottoNumber&drwNo=${roundNo}`,
      {
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: roundNo < estimateLatestRound() ? false : 3600 },
      }
    );
    if (res.status === 302 || !res.ok) return null;
    const data: DhlotteryApiResponse = await res.json();
    if (data.returnValue !== "success") return null;
    return data;
  } catch {
    return null;
  }
}

/** 자체 API Route를 통한 프록시 호출 (Vercel ICN 리전) */
async function fetchViaProxy(roundNo: number): Promise<DhlotteryApiResponse | null> {
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
  // 1차: 동행복권 직접 호출
  let data = await fetchDirect(roundNo);
  // 2차: 자체 프록시 경유 (한국 리전)
  if (!data) data = await fetchViaProxy(roundNo);
  if (!data) return null;
  return parseLottoResponse(data);
}

export async function fetchLatestRound(): Promise<LottoRound | null> {
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
