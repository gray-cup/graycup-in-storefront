import { ImageResponse } from "next/og";

export const guideOgImageSize = {
  width: 1200,
  height: 630,
};

export function renderGuideOgImage(title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafafa",
          padding: "72px",
        }}
      >
        <span
          style={{
            fontSize: "36px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#141414",
          }}
        >
          Gray Cup
        </span>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#141414",
            lineHeight: 1.15,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h1>
      </div>
    ),
    { ...guideOgImageSize },
  );
}
