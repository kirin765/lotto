import { NextResponse } from "next/server";

// Vercel 한국 리전에서 실행 → 동행복권 API IP 차단 우회
export const runtime = "edge";
export const preferredRegion = "icn1";

const API_BASE = "https://www.dhlottery.co.kr/common.do";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const drwNo = searchParams.get("drwNo");

  if (!drwNo || isNaN(Number(drwNo))) {
    return NextResponse.json({ error: "Invalid drwNo" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_BASE}?method=getLottoNumber&drwNo=${drwNo}`,
      {
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      }
    );

    // 302 리다이렉트 = IP 차단
    if (res.status === 302) {
      return NextResponse.json(
        { error: "API blocked (region)" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}
