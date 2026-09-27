import type { Product } from "../types/product";
import FavoriteButton from "./FavoriteButton";
import "./ProductCard.css";

interface Props {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i <= Math.round(rating) ? "#facc15" : "none"}
          stroke={i <= Math.round(rating) ? "#facc15" : "#6b7280"}
          strokeWidth={1.5}
          className="star-icon"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
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
          <StarRating rating={product.rating} />
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
