import { ImageResponse } from "next/og";
import { getProductById } from "@/lib/productsData";

export const runtime = "edge";
export const alt = "Chi tiết sản phẩm TechHub";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  const title = product?.name || "Sản phẩm công nghệ";
  const category = product?.category || "Thiết bị cao cấp";
  const price = product ? `${product.price.toLocaleString("vi-VN")}₫` : "Liên hệ";
  const rating = product?.rating || 5.0;
  const reviews = product?.reviewCount || 100;

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
          background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #1f2937 100%)",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: "32px", fontWeight: 800 }}>TechHub Store</span>
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(96, 165, 250, 0.5)",
              color: "#93c5fd",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>

        {/* Center: Product Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "8px" }}>
            <span
              style={{
                fontSize: "44px",
                fontWeight: 800,
                color: "#38bdf8",
              }}
            >
              {price}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.08)",
                fontSize: "22px",
              }}
            >
              <span style={{ color: "#fbbf24" }}>★</span>
              <span style={{ fontWeight: 700 }}>{rating}</span>
              <span style={{ color: "#9ca3af" }}>({reviews.toLocaleString("vi-VN")} đánh giá)</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#9ca3af" }}>
            Trang chi tiết chuẩn SEO · Canonical & JSON-LD Product Schema
          </span>
          <span style={{ fontSize: "18px", color: "#34d399", fontWeight: 600 }}>
            ✓ Hàng chính hãng 100% · Bảo hành 12 tháng
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
