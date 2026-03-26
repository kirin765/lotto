import type { LottoRound, DhlotteryApiResponse } from "@/types/lotto";
import { estimateLatestRound, sortNumbers } from "./utils";

const API_BASE = "https://www.dhlottery.co.kr/common.do";

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

export async function fetchLottoRound(
  roundNo: number
): Promise<LottoRound | null> {
  try {
    const res = await fetch(
      `${API_BASE}?method=getLottoNumber&drwNo=${roundNo}`,
      { next: { revalidate: roundNo < estimateLatestRound() ? false : 3600 } }
    );
    if (!res.ok) return null;
    const data: DhlotteryApiResponse = await res.json();
    if (data.returnValue !== "success") return null;
    return parseLottoResponse(data);
  } catch {
    return null;
  }
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
