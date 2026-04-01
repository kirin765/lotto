import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const NAVER_SEARCH = "https://m.search.naver.com/search.naver";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15";

function ballColor(num: number) {
  if (num <= 10) return { bg: "#FACC15", text: "#713F12" };
  if (num <= 20) return { bg: "#3B82F6", text: "#FFFFFF" };
  if (num <= 30) return { bg: "#EF4444", text: "#FFFFFF" };
  if (num <= 40) return { bg: "#6B7280", text: "#FFFFFF" };
  return { bg: "#22C55E", text: "#FFFFFF" };
}

async function fetchLatestNumbers(): Promise<{ numbers: number[]; bonusNo: number; roundNo: number } | null> {
  try {
    const url = `${NAVER_SEARCH}?where=m&query=${encodeURIComponent("로또당첨번호")}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const roundMatch = html.match(/data-text="(\d+)회차/);
    const ballMatches = [...html.matchAll(/class="ball type\d">(\d+)/g)];
    const bonusMatch = html.match(/bonus_number">\s*<span class="ball type\d">(\d+)/);
    if (!roundMatch || ballMatches.length < 6) return null;
    return {
      roundNo: parseInt(roundMatch[1], 10),
      numbers: ballMatches.slice(0, 6).map((m) => parseInt(m[1], 10)).sort((a, b) => a - b),
      bonusNo: bonusMatch ? parseInt(bonusMatch[1], 10) : 0,
    };
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const data = await fetchLatestNumbers();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "64px",
          background: "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 64, 175) 45%, rgb(56, 189, 248) 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.85 }}>동행복권 로또 6/45</div>
        <div style={{ fontSize: 60, fontWeight: 800, marginTop: 12 }}>{SITE_NAME}</div>
        {data ? (
          <>
            <div style={{ fontSize: 26, marginTop: 8, opacity: 0.8 }}>제 {data.roundNo}회 최신 당첨번호</div>
            <div style={{ display: "flex", gap: 14, marginTop: 28, alignItems: "center" }}>
              {data.numbers.map((num) => {
                const { bg, text } = ballColor(num);
                return (
                  <div
                    key={num}
                    style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: bg, color: text,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 34, fontWeight: 800,
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              <div style={{ fontSize: 28, opacity: 0.6, margin: "0 4px" }}>+</div>
              {(() => {
                const { bg, text } = ballColor(data.bonusNo);
                return (
                  <div
                    style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: bg, color: text, opacity: 0.75,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 34, fontWeight: 800,
                      border: "3px dashed rgba(255,255,255,0.5)",
                    }}
                  >
                    {data.bonusNo}
                  </div>
                );
              })()}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 34, marginTop: 24, opacity: 0.95 }}>최신 당첨번호, 회차별 조회, 번호 통계</div>
        )}
        <div style={{ position: "absolute", bottom: 48, right: 64, fontSize: 22, opacity: 0.5 }}>
          {new URL(SITE_URL).hostname}
        </div>
      </div>
    ),
    size
  );
}
