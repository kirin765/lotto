import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
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
            "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 64, 175) 45%, rgb(56, 189, 248) 100%)",
          color: "white",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        <div style={{ fontSize: 38, opacity: 0.9 }}>동행복권 로또 6/45</div>
        <div style={{ fontSize: 78, fontWeight: 800, marginTop: 16 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 34, marginTop: 24, opacity: 0.95 }}>
          최신 당첨번호, 회차별 조회, 번호 통계
        </div>
      </div>
    ),
    size
  );
}
