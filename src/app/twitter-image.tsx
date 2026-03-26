import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 600,
};

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px",
          background:
            "linear-gradient(130deg, rgb(30, 58, 138) 0%, rgb(37, 99, 235) 55%, rgb(125, 211, 252) 100%)",
          color: "white",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.92 }}>로또 당첨번호 확인</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 12 }}>{SITE_NAME}</div>
      </div>
    ),
    size
  );
}
