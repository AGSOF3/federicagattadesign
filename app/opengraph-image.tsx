import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Federica Gatta Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f0e7",
        color: "#44372e",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px",
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 8, marginBottom: 60 }}>
        FEDERICA GATTA DESIGN
      </div>
      <div
        style={{
          fontSize: 92,
          fontFamily: "serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Creative design</span>
        <span>for your brand.</span>
      </div>
      <div style={{ fontSize: 20, marginTop: 55 }}>
        GRAPHIC DESIGN · VISUAL IDENTITIES · DIGITAL RESOURCES
      </div>
    </div>,
    size,
  );
}
