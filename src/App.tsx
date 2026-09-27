import { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES } from "./data/products";
import { useFavoritesStore } from "./store/favoritesStore";
import ProductCard from "./components/ProductCard";
import FavoritesDrawer from "./components/FavoritesDrawer";
import "./App.css";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  // Fine-grained selector: chỉ re-render App khi totalFavorites thay đổi
  const totalFavorites = useFavoritesStore((s) => s.favoriteItems.length);

  // useMemo: filter lại chỉ khi category/search thay đổi
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === "Tất cả" || p.category === activeCategory;
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="brand-logo">Z</div>
            <div>
              <p className="brand-course">LTWNC · Bài tập tuần 4</p>
              <h1 className="brand-name">Zustand Store</h1>
            </div>
          </div>

          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              id="product-search"
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          <button
            id="open-favorites-drawer"
            className="header-fav-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở danh sách yêu thích"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="header-fav-icon">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            {totalFavorites > 0 && (
              <span className="header-fav-badge" key={totalFavorites}>
                {totalFavorites}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Category Filter ── */}
      <nav className="category-nav" aria-label="Lọc theo danh mục">
        <div className="category-nav__inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? "category-chip--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="app-main">
        <div className="products-header">
          <p className="products-count">
            {filteredProducts.length} sản phẩm
            {searchQuery && ` cho "${searchQuery}"`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      <FavoritesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
