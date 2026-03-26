import { NextResponse } from "next/server";

export const runtime = "edge";

const NAVER_SEARCH = "https://m.search.naver.com/search.naver";
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";

function parseNaverHtml(html: string) {
  // 회차
  const roundMatch = html.match(/data-text="(\d+)회차\s*\((\d{4}\.\d{2}\.\d{2})\.\)"/);
  if (!roundMatch) return null;
  const drwNo = parseInt(roundMatch[1], 10);
  const drwNoDate = roundMatch[2].replace(/\./g, "-");

  // 당첨번호 (class="ball typeN">숫자)
  const ballMatches = [...html.matchAll(/class="ball type\d">(\d+)/g)];
  if (ballMatches.length < 6) return null;

  // 보너스 번호
  const bonusMatch = html.match(/bonus_number">\s*<span class="ball type\d">(\d+)/);
  const bnusNo = bonusMatch ? parseInt(bonusMatch[1], 10) : 0;

  // 메인 번호 (보너스 제외)
  const allNums = ballMatches.map((m) => parseInt(m[1], 10));
  const mainNums = allNums.slice(0, 6);

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

  // 총 판매금액
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const drwNo = searchParams.get("drwNo");

  if (!drwNo || (drwNo !== "latest" && isNaN(Number(drwNo)))) {
    return NextResponse.json({ error: "Invalid drwNo" }, { status: 400 });
  }

  try {
    const query =
      drwNo === "latest"
        ? "로또당첨번호"
        : `로또 ${drwNo}회 당첨번호`;
    const url = `${NAVER_SEARCH}?where=m&query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      return NextResponse.json({ error: "Naver fetch failed" }, { status: 502 });
    }

    const html = await res.text();
    const data = parseNaverHtml(html);
    if (!data) {
      return NextResponse.json(
        { error: "Parse failed", returnValue: "fail" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
