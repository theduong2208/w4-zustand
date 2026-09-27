import { useFavoritesStore } from "../store/favoritesStore";
import "./FavoritesDrawer.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ open, onClose }: Props) {
  const favoriteItems = useFavoritesStore((s) => s.favoriteItems);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const clearAll = useFavoritesStore((s) => s.clearAll);

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? "drawer-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? "drawer--open" : ""}`}
        role="dialog"
        aria-label="Sản phẩm yêu thích"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer__header">
          <div className="drawer__title-row">
            <svg viewBox="0 0 24 24" fill="currentColor" className="drawer__heart-icon">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <h2 className="drawer__title">Yêu thích</h2>
            <span className="drawer__count">{favoriteItems.length}</span>
          </div>
          <button className="drawer__close-btn" onClick={onClose} aria-label="Đóng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="drawer__body">
          {favoriteItems.length === 0 ? (
            <div className="drawer__empty">
              <div className="drawer__empty-icon">💔</div>
              <p className="drawer__empty-title">Chưa có sản phẩm yêu thích</p>
              <p className="drawer__empty-sub">Nhấn ♥ trên sản phẩm để thêm vào đây</p>
            </div>
          ) : (
            <>
              <ul className="drawer__list">
                {favoriteItems.map((item) => (
                  <li key={item.id} className="drawer__item">
                    <img src={item.image} alt={item.name} className="drawer__item-img" />
                    <div className="drawer__item-info">
                      <p className="drawer__item-name">{item.name}</p>
                      <p className="drawer__item-category">{item.category}</p>
                      <p className="drawer__item-price">
                        {item.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                    <button
                      className="drawer__remove-btn"
                      onClick={() => removeFavorite(item.id)}
                      aria-label={`Xóa ${item.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="drawer__footer">
                <button className="drawer__clear-btn" onClick={clearAll}>
                  Xoá tất cả
                </button>
                <button className="drawer__checkout-btn">
                  Xem tất cả ({favoriteItems.length})
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
