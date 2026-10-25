import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/productsData";
import { CATEGORIES } from "@/data/products";
import ProductCatalog from "@/components/ProductCatalog";
import SecurityLayersShowcase from "@/components/SecurityLayersShowcase";

export const metadata: Metadata = {
  title: "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao | LTWNC Tuần 8",
  description:
    "Trang chủ mua sắm thiết bị âm thanh, chuột bàn phím cao cấp. Bảo mật NextAuth phân quyền 2 vai trò Admin và User với Middleware, kiểm tra Server Component và Server Actions.",
  alternates: {
    canonical: "https://techhub-ltwnc.vercel.app",
  },
  openGraph: {
    title: "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao",
    description: "Tích hợp NextAuth, RBAC 2 vai trò Admin & User, SEO tối ưu với JSON-LD.",
    url: "https://techhub-ltwnc.vercel.app",
    siteName: "TechHub Store",
    locale: "vi_VN",
    type: "website",
  },
};

export default function HomePage() {
  const products = getAllProducts();

  // 🏷️ SEO Requirement: JSON-LD Structured Data for Home Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://techhub-ltwnc.vercel.app/#website",
        "url": "https://techhub-ltwnc.vercel.app",
        "name": "TechHub Store",
        "description": "Siêu thị Công nghệ & Phụ kiện Đỉnh cao",
        "publisher": {
          "@type": "Organization",
          "name": "TechHub Việt Nam",
          "url": "https://techhub-ltwnc.vercel.app",
          "logo": {
            "@type": "ImageObject",
            "url": "https://techhub-ltwnc.vercel.app/icon.png",
          },
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://techhub-ltwnc.vercel.app/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://techhub-ltwnc.vercel.app/#itemlist",
        "name": "Danh mục thiết bị công nghệ nổi bật",
        "numberOfItems": products.length,
        "itemListElement": products.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.name,
          "url": `https://techhub-ltwnc.vercel.app/products/${item.id}`,
          "image": item.image,
        })),
      },
    ],
  };

  return (
    <>
      {/* 1. Injected JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge-group">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">LTWNC · BÀI TẬP TUẦN 8 HOÀN THIỆN</span>
            </div>

            <h1 className="hero-headline">
              Tích Hợp NextAuth & Phân Quyền Bảo Mật{" "}
              <span className="hero-headline-gradient">Zero-Trust</span>
            </h1>

            <p className="hero-subtext">
              Hệ thống thương mại điện tử hiện đại kết hợp sức mạnh phân quyền 2 vai trò (Admin & User) qua 3 lớp phòng thủ: <strong>Edge Middleware</strong>, <strong>Page Server Components</strong> và <strong>Server Actions</strong>. Tối ưu SEO vượt trội với Canonical URL, OpenGraph dynamic và JSON-LD Structured Data.
            </p>

            <div className="hero-cta-group">
              <a href="#products" className="btn-primary-hero">
                Khám phá sản phẩm
              </a>
              <Link href="/login" className="btn-secondary-hero">
                🔑 Thử nghiệm Đăng nhập & RBAC
              </Link>
              <Link href="/bao-cao" className="btn-outline-hero">
                📊 Báo cáo & Điểm Lighthouse
              </Link>
            </div>

            {/* Quick Testing shortcuts */}
            <div className="quick-test-bar">
              <span className="quick-test-label">Lối tắt kiểm tra nhanh:</span>
              <div className="quick-test-chips">
                <Link href="/login" className="quick-chip chip-login">
                  🔑 Đăng nhập nhanh 1-Click
                </Link>
                <Link href="/admin" className="quick-chip chip-admin">
                  🛡️ Thử vào /admin (Role: Admin)
                </Link>
                <Link href="/profile" className="quick-chip chip-user">
                  👤 Thử vào /profile (Yêu cầu đăng nhập)
                </Link>
                <Link href="/products/p1" className="quick-chip chip-seo">
                  🏷️ Xem trang SEO Chi tiết (p1)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Security Architecture 3 Layers Showcase */}
        <SecurityLayersShowcase />

        {/* Products Catalog with Zustand Integration */}
        <ProductCatalog initialProducts={products} categories={CATEGORIES} />

        {/* SEO & Structured Data Inspection Section */}
        <section className="seo-inspector-section">
          <div className="inspector-card">
            <div className="inspector-header">
              <div className="inspector-icon">🔍</div>
              <div>
                <h3 className="inspector-title">Kiểm Tra Dữ Liệu SEO Trang Này (Trang Công Khai 1/2)</h3>
                <p className="inspector-sub">
                  Các thẻ meta và JSON-LD Schema.org đã được nhúng tự động trên Server (SSR)
                </p>
              </div>
            </div>

            <div className="inspector-grid">
              <div className="inspector-item">
                <span className="inspector-label">Canonical URL:</span>
                <code className="inspector-code">https://techhub-ltwnc.vercel.app/</code>
              </div>
              <div className="inspector-item">
                <span className="inspector-label">OpenGraph Image:</span>
                <code className="inspector-code">/opengraph-image (Dynamic ImageResponse 1200x630)</code>
              </div>
              <div className="inspector-item">
                <span className="inspector-label">JSON-LD Schemas:</span>
                <span className="inspector-tags">
                  <span className="tag-pill">schema.org/WebSite</span>
                  <span className="tag-pill">schema.org/ItemList ({products.length} items)</span>
                  <span className="tag-pill">schema.org/Organization</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
