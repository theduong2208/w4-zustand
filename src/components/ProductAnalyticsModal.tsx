import { useMemo } from "react";
import type { Product } from "../types/product";
import "./ProductAnalyticsModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export default function ProductAnalyticsModal({ open, onClose, products }: Props) {
  if (!open) return null;

  // Tính toán thống kê dữ liệu 10.000 sản phẩm
  const stats = useMemo(() => {
    const totalCount = products.length;
    let totalPrice = 0;
    let totalReviews = 0;
    const catMap: Record<string, number> = {};
    const priceBuckets = {
      "< 1tr": 0,
      "1tr - 5tr": 0,
      "5tr - 15tr": 0,
      "> 15tr": 0,
    };

    for (const p of products) {
      totalPrice += p.price;
      totalReviews += p.reviewCount;
      catMap[p.category] = (catMap[p.category] || 0) + 1;

      if (p.price < 1000000) priceBuckets["< 1tr"]++;
      else if (p.price <= 5000000) priceBuckets["1tr - 5tr"]++;
      else if (p.price <= 15000000) priceBuckets["5tr - 15tr"]++;
      else priceBuckets["> 15tr"]++;
    }

    return {
      totalCount,
      avgPrice: totalCount ? Math.round(totalPrice / totalCount) : 0,
      avgReviews: totalCount ? Math.round(totalReviews / totalCount) : 0,
      catMap,
      priceBuckets,
    };
  }, [products]);

  return (
    <div className="analytics-modal-backdrop" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-modal__header">
          <div>
            <span className="analytics-modal__badge">Code-Splitting Demo</span>
            <h2 className="analytics-modal__title">📊 Phân tích Thống kê 10.000 Sản phẩm</h2>
          </div>
          <button className="analytics-modal__close" onClick={onClose} aria-label="Đóng modal">
            ✕
          </button>
        </div>

        <div className="analytics-modal__body">
          <div className="analytics-grid">
            <div className="analytics-card">
              <span className="analytics-card__label">Tổng số sản phẩm</span>
              <strong className="analytics-card__value">{stats.totalCount.toLocaleString("vi-VN")}</strong>
            </div>
            <div className="analytics-card">
              <span className="analytics-card__label">Giá trung bình</span>
              <strong className="analytics-card__value">{stats.avgPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
            <div className="analytics-card">
              <span className="analytics-card__label">Lượt đánh giá TB</span>
              <strong className="analytics-card__value">{stats.avgReviews.toLocaleString("vi-VN")}</strong>
            </div>
          </div>

          <h3 className="analytics-section-title">Phân bố theo Danh mục</h3>
          <div className="analytics-bars">
            {Object.entries(stats.catMap).map(([category, count]) => {
              const percent = Math.round((count / (stats.totalCount || 1)) * 100);
              return (
                <div key={category} className="analytics-bar-item">
                  <div className="analytics-bar-item__label">
                    <span>{category}</span>
                    <span>{count.toLocaleString("vi-VN")} ({percent}%)</span>
                  </div>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{ width: `${percent * 2.5}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="analytics-section-title">Phân khúc Giá bán</h3>
          <div className="analytics-price-grid">
            {Object.entries(stats.priceBuckets).map(([bucket, count]) => (
              <div key={bucket} className="price-bucket-pill">
                <span className="price-bucket-title">{bucket}</span>
                <span className="price-bucket-count">{count.toLocaleString("vi-VN")} sp</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-modal__footer">
          <p className="analytics-footer-note">
            💡 <em>Lưu ý: Component này chứa biểu đồ thống kê lớn. Khi áp dụng <strong>Code-Splitting (React.lazy)</strong>, bundle chính tải nhanh hơn nhiều vì chunk này chỉ tải khi mở modal!</em>
          </p>
          <button className="analytics-btn-primary" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
