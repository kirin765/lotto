import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/constants";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

const NAVER_SEARCH = "https://m.search.naver.com/search.naver";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15";

function ballColor(num: number) {
  if (num <= 10) return { bg: "#FACC15", text: "#713F12" };
  if (num <= 20) return { bg: "#3B82F6", text: "#FFFFFF" };
  if (num <= 30) return { bg: "#EF4444", text: "#FFFFFF" };
  if (num <= 40) return { bg: "#6B7280", text: "#FFFFFF" };
  return { bg: "#22C55E", text: "#FFFFFF" };
}

async function fetchRoundNumbers(roundNo: number): Promise<{ numbers: number[]; bonusNo: number; drawDate: string } | null> {
  try {
    const query = `로또 ${roundNo}회 당첨번호`;
    const url = `${NAVER_SEARCH}?where=m&query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const roundMatch = html.match(/data-text="(\d+)회차\s*\((\d{4}\.\d{2}\.\d{2})\.\)"/);
    if (!roundMatch || parseInt(roundMatch[1], 10) !== roundNo) return null;
    const ballMatches = [...html.matchAll(/class="ball type\d">(\d+)/g)];
    const bonusMatch = html.match(/bonus_number">\s*<span class="ball type\d">(\d+)/);
    if (ballMatches.length < 6) return null;
    return {
      drawDate: roundMatch[2],
      numbers: ballMatches.slice(0, 6).map((m) => parseInt(m[1], 10)).sort((a, b) => a - b),
      bonusNo: bonusMatch ? parseInt(bonusMatch[1], 10) : 0,
    };
  } catch {
    return null;
  }
}

interface OpenGraphImageProps {
  params: Promise<{ round: string }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { round } = await params;
  const roundNo = parseInt(round, 10);
  const label = Number.isNaN(roundNo) ? "회차 정보" : `제 ${roundNo}회`;

  const data = !Number.isNaN(roundNo) ? await fetchRoundNumbers(roundNo) : null;

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
          background: "linear-gradient(135deg, rgb(10, 10, 10) 0%, rgb(31, 41, 55) 45%, rgb(59, 130, 246) 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.8 }}>동행복권 로또 6/45</div>
        <div style={{ fontSize: 52, fontWeight: 800, marginTop: 12 }}>{label} 당첨번호</div>
        {data ? (
          <>
            <div style={{ fontSize: 24, marginTop: 6, opacity: 0.7 }}>{data.drawDate} 추첨</div>
            <div style={{ display: "flex", gap: 14, marginTop: 28, alignItems: "center" }}>
              {data.numbers.map((num) => {
                const { bg, text } = ballColor(num);
                return (
                  <div
                    key={num}
                    style={{
                      width: 84, height: 84, borderRadius: "50%",
                      background: bg, color: text,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 36, fontWeight: 800,
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
                      width: 84, height: 84, borderRadius: "50%",
                      background: bg, color: text, opacity: 0.75,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 36, fontWeight: 800,
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
          <div style={{ fontSize: 30, marginTop: 24, opacity: 0.9 }}>당첨번호, 보너스 번호, 당첨금 정보</div>
        )}
        <div style={{ position: "absolute", bottom: 48, right: 64, fontSize: 22, opacity: 0.5 }}>
          {new URL(SITE_URL).hostname}
        </div>
      </div>
    ),
    size
  );
}
