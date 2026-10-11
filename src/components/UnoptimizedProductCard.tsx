import type { Product } from "../types/product";
import FavoriteButton from "./FavoriteButton";
import "./ProductCard.css";

interface Props {
  product: Product;
  style?: React.CSSProperties;
}

// ⚠️ CHƯA TỐI ƯU: Không có React.memo, mỗi lần cha re-render thì card này đều re-render lại
export default function UnoptimizedProductCard({ product, style }: Props) {
  // Giả lập phép tính format / tax / discount chưa tối ưu lặp lại mỗi render
  let hash = 0;
  for (let i = 0; i < 15000; i++) {
    hash += Math.sin(i + product.price);
  }

  return (
    <article className="product-card" style={style}>
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
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
}
