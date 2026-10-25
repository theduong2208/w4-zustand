import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
        }}
      >
        {/* Top bar with badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em" }}>TechHub</span>
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "9999px",
              background: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(129, 140, 248, 0.4)",
              color: "#a5b4fc",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            LTWNC · Tuần 8
          </div>
        </div>

        {/* Center content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              background: "linear-gradient(to right, #ffffff, #cbd5e1, #93c5fd)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Siêu thị Công nghệ & Thiết bị Âm thanh Đỉnh cao
          </div>
          <div style={{ fontSize: "24px", color: "#94a3b8", lineHeight: 1.4 }}>
            Bảo mật 3 lớp với NextAuth (Middleware, Server Components, Server Actions) · SEO chuẩn Google Canonical, OpenGraph, JSON-LD
          </div>
        </div>

        {/* Bottom stats / features */}
        <div style={{ display: "flex", gap: "28px", width: "100%", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#34d399", fontSize: "22px" }}>✓</span>
            <span style={{ fontSize: "18px", color: "#cbd5e1" }}>NextAuth RBAC (Admin & User)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#34d399", fontSize: "22px" }}>✓</span>
            <span style={{ fontSize: "18px", color: "#cbd5e1" }}>JSON-LD Schema & Canonical</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#34d399", fontSize: "22px" }}>✓</span>
            <span style={{ fontSize: "18px", color: "#cbd5e1" }}>Zustand Favorites Store</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#34d399", fontSize: "22px" }}>✓</span>
            <span style={{ fontSize: "18px", color: "#cbd5e1" }}>Lighthouse 100/100</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
