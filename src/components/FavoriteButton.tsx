import type { Product } from "../types/product";
import { useFavoritesStore } from "../store/favoritesStore";
import "./FavoriteButton.css";

interface Props {
  product: Product;
}

export default function FavoriteButton({ product }: Props) {
  // Fine-grained selectors — each component re-renders only when its slice changes
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const liked = isFavorite(product.id);

  return (
    <button
      className={`fav-btn ${liked ? "fav-btn--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(product);
      }}
      title={liked ? "Bỏ yêu thích" : "Thêm yêu thích"}
      aria-label={liked ? "Bỏ yêu thích" : "Thêm yêu thích"}
      aria-pressed={liked}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="fav-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
