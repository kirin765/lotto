import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

interface OpenGraphImageProps {
  params: Promise<{ round: string }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { round } = await params;
  const roundNo = parseInt(round, 10);
  const label = Number.isNaN(roundNo) ? "회차 정보" : `제 ${roundNo}회`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background:
            "linear-gradient(135deg, rgb(10, 10, 10) 0%, rgb(31, 41, 55) 45%, rgb(59, 130, 246) 100%)",
          color: "white",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        <div style={{ fontSize: 44, opacity: 0.9 }}>{label} 로또 당첨번호</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginTop: 16 }}>동행복권 로또 6/45</div>
        <div style={{ fontSize: 30, marginTop: 24, opacity: 0.95 }}>
          당첨번호, 보너스 번호, 당첨금 정보
        </div>
      </div>
    ),
    size
  );
}
