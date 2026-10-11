import React from "react";
import type { Product } from "../types/product";
import FavoriteButton from "./FavoriteButton";
import "./ProductCard.css";

interface Props {
  product: Product;
  style?: React.CSSProperties;
}

// ⭐ ĐÃ TỐI ƯU: Sử dụng React.memo để ngăn re-render khi props không thay đổi
const OptimizedProductCard = React.memo(
  function OptimizedProductCard({ product, style }: Props) {
    return (
      <article className="product-card" style={style}>
        <div className="product-card__image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
            decoding="async"
          />
          <div className="product-card__fav-overlay">
            <FavoriteButton product={product} />
          </div>
          <span className="product-card__category">{product.category}</span>
        </div>

        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__desc">{product.description}</p>

          <div className="product-card__rating">
            <span className="stars">⭐</span>
            <span className="product-card__rating-text">
              {product.rating} ({product.reviewCount.toLocaleString("vi-VN")})
            </span>
          </div>

          <div className="product-card__footer">
            <span className="product-card__price">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
            <button className="product-card__buy-btn">Mua ngay</button>
          </div>
        </div>
      </article>
    );
  },
  (prev, next) => {
    // Chỉ re-render khi id hoặc giá hoặc style thay đổi
    return (
      prev.product.id === next.product.id &&
      prev.product.price === next.product.price &&
      prev.style?.top === next.style?.top &&
      prev.style?.left === next.style?.left
    );
  }
);

export default OptimizedProductCard;
