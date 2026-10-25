import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getAllProducts } from "@/lib/productsData";
import FavoriteButton from "@/components/FavoriteButton";

interface Props {
  params: { id: string };
}

// 1. Dynamic Metadata & Canonical URL for Product Detail Page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | TechHub Store",
      description: "Sản phẩm yêu cầu không tồn tại hoặc đã bị gỡ bỏ.",
    };
  }

  const canonicalUrl = `https://techhub-ltwnc.vercel.app/products/${product.id}`;

  return {
    title: `${product.name} | Mua Chính Hãng Giá Tốt tại TechHub`,
    description: `${product.description} Giá ưu đãi: ${product.price.toLocaleString("vi-VN")}₫. Đánh giá ${product.rating} sao từ ${product.reviewCount} khách hàng.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} - Giá ${product.price.toLocaleString("vi-VN")}₫`,
      description: product.description,
      url: canonicalUrl,
      siteName: "TechHub Store",
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | TechHub`,
      description: product.description,
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const canonicalUrl = `https://techhub-ltwnc.vercel.app/products/${product.id}`;

  // 🏷️ 2. SEO Requirement: JSON-LD Product Schema for Product Detail Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": `TECHHUB-${product.id.toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": product.category,
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "VND",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "TechHub Store",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount,
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  return (
    <>
      {/* Injected JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="product-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/#products" className="breadcrumb-link">
            {product.category}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Main Product Details Layout */}
        <div className="product-detail-layout">
          {/* Left: Product Image */}
          <div className="product-image-container">
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-main-image"
                width={600}
                height={450}
              />
              <div className="product-fav-action">
                <FavoriteButton product={product} />
              </div>
            </div>
            <div className="product-badge-overlay">
              <span className="badge-official">✓ Chính hãng 100%</span>
              <span className="badge-warranty">Bảo hành 12 tháng</span>
            </div>
          </div>

          {/* Right: Info and Actions */}
          <div className="product-info-container">
            <div className="product-category-tag">{product.category}</div>
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-rating-row">
              <div className="star-rating-box">
                <span className="star-rating-val">★ {product.rating}</span>
                <span className="star-rating-count">
                  ({product.reviewCount.toLocaleString("vi-VN")} đánh giá từ khách hàng)
                </span>
              </div>
              <span className="stock-status in-stock">
                {product.stock > 0 ? `Còn hàng (Tồn: ${product.stock})` : "Hết hàng"}
              </span>
            </div>

            <div className="product-price-box">
              <span className="price-label">Giá niêm yết:</span>
              <div className="price-row">
                <span className="price-main">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="price-vat">Đã bao gồm VAT</span>
              </div>
            </div>

            <div className="product-description-box">
              <h3 className="desc-heading">Mô tả sản phẩm:</h3>
              <p className="desc-text">{product.description}</p>
              <ul className="feature-bullets">
                <li>Bộ vi xử lý thông minh thế hệ mới, tối ưu hiệu suất và tiết kiệm năng lượng.</li>
                <li>Chất liệu hoàn thiện cao cấp, thiết kế công thái học mang lại cảm giác thoải mái.</li>
                <li>Hỗ trợ kết nối đa nền tảng, tương thích mượt mà với MacOS, Windows, iOS, Android.</li>
              </ul>
            </div>

            <div className="product-actions-group">
              <button className="btn-buy-now">
                ⚡ Mua ngay với giá ưu đãi
              </button>
              <div className="fav-inline-box">
                <FavoriteButton product={product} />
                <span className="fav-inline-label">Lưu vào Yêu thích (Zustand)</span>
              </div>
            </div>

            <div className="policy-guarantee-box">
              <div className="policy-item">
                <span className="policy-icon">🚚</span>
                <span>Giao hàng toàn quốc siêu tốc trong 24h</span>
              </div>
              <div className="policy-item">
                <span className="policy-icon">🛡️</span>
                <span>Bảo hành chính hãng 1 đổi 1 trong 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Inspector Box for This Product Detail Page (Page 2/2) */}
        <section className="seo-inspector-section detail-seo-card">
          <div className="inspector-card">
            <div className="inspector-header">
              <div className="inspector-icon">🎯</div>
              <div>
                <h3 className="inspector-title">Thông Tin SEO Trang Chi Tiết (Trang Công Khai 2/2)</h3>
                <p className="inspector-sub">
                  Trang chi tiết sản phẩm chuẩn SEO theo yêu cầu bài tập: Thẻ Canonical, OpenGraph động và Schema Product
                </p>
              </div>
            </div>

            <div className="inspector-grid">
              <div className="inspector-item">
                <span className="inspector-label">Canonical URL:</span>
                <code className="inspector-code">{canonicalUrl}</code>
              </div>
              <div className="inspector-item">
                <span className="inspector-label">OpenGraph Image động:</span>
                <code className="inspector-code">/products/{product.id}/opengraph-image (Sinh động theo tên & giá)</code>
              </div>
              <div className="inspector-item">
                <span className="inspector-label">JSON-LD Structured Data:</span>
                <span className="inspector-tags">
                  <span className="tag-pill">@type: Product</span>
                  <span className="tag-pill">Price: {product.price.toLocaleString("vi-VN")} VND</span>
                  <span className="tag-pill">Rating: {product.rating} ({product.reviewCount} reviews)</span>
                  <span className="tag-pill">Availability: InStock</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
