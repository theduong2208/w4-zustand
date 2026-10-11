import React, { useState, useMemo, useDeferredValue, useEffect, useRef, Suspense } from "react";
import { MOCK_10K_PRODUCTS, ALL_CATEGORIES } from "./data/mockProducts";
import { useFavoritesStore } from "./store/favoritesStore";
import OptimizedProductCard from "./components/OptimizedProductCard";
import UnoptimizedProductCard from "./components/UnoptimizedProductCard";
import BenchmarkToolbar from "./components/BenchmarkToolbar";
import FavoritesDrawer from "./components/FavoritesDrawer";
import { useVirtualGrid } from "./hooks/useVirtualGrid";
import "./App.css";

// Dynamic Import (Code-Splitting) cho chế độ Optimized
const LazyAnalyticsModal = React.lazy(
  () => import("./components/ProductAnalyticsModal")
);

export default function App() {
  // Xác định chế độ tối ưu ban đầu từ URL ?mode=unoptimized hoặc mặc định là true (optimized)
  const [isOptimized, setIsOptimized] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "unoptimized") return false;
      if (params.get("mode") === "optimized") return true;
    }
    return true; // Mặc định mở ở chế độ đã tối ưu để trải nghiệm ban đầu tốt nhất
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [renderDuration, setRenderDuration] = useState(0);

  // Kỹ thuật 4: Concurrent React - useDeferredValue giảm giật lag khi gõ tìm kiếm
  const deferredSearch = useDeferredValue(searchQuery);
  const effectiveSearch = isOptimized ? deferredSearch : searchQuery;

  // Selector Zustand tối ưu
  const totalFavorites = useFavoritesStore((s) => s.favoriteItems.length);

  // Cập nhật URL khi chuyển chế độ để tiện đo Lighthouse từng URL
  const handleToggleMode = (optimized: boolean) => {
    setIsOptimized(optimized);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", optimized ? "optimized" : "unoptimized");
    window.history.replaceState({}, "", url.toString());
  };

  // Kỹ thuật 2: Memoization cho quá trình lọc dữ liệu 10.000 sản phẩm
  const filteredProducts = useMemo(() => {
    const q = effectiveSearch.toLowerCase().trim();
    return MOCK_10K_PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === "Tất cả" || p.category === activeCategory;
      const matchSearch = !q || p.name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, effectiveSearch]);

  // Kỹ thuật 1: List Virtualization (Windowing) cho 10.000 sản phẩm
  const {
    totalHeight,
    startIndex,
    endIndex,
    visibleCount,
    getItemStyle,
  } = useVirtualGrid({
    totalItems: filteredProducts.length,
    itemHeight: 420,
    gap: 20,
    overscan: 2,
  });

  // Đo thời gian render thực tế (Main-thread render time)
  const renderStartTime = useRef(performance.now());
  useEffect(() => {
    const duration = performance.now() - renderStartTime.current;
    setRenderDuration(duration);
  });
  renderStartTime.current = performance.now();

  // Ước tính DOM Nodes đang được gắn vào DOM
  const renderedDomNodes = isOptimized
    ? visibleCount * 7 + 120
    : filteredProducts.length * 7 + 120;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="brand-logo">Z</div>
            <div>
              <p className="brand-course">LTWNC · BÀI TẬP TUẦN 5</p>
              <h1 className="brand-name">React Performance Lab (10.000 SP)</h1>
            </div>
          </div>

          <div className="search-wrap">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              id="product-search"
              type="text"
              className="search-input"
              placeholder={`Tìm trong 10.000 sản phẩm... ${isOptimized ? "(useDeferredValue)" : "(Laggy)"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Xoá tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <button
            id="open-favorites-drawer"
            className="header-fav-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở danh sách yêu thích"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="header-fav-icon"
            >
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

      {/* ── Benchmark Control Toolbar ── */}
      <BenchmarkToolbar
        isOptimized={isOptimized}
        onToggleMode={handleToggleMode}
        totalProducts={MOCK_10K_PRODUCTS.length}
        filteredCount={filteredProducts.length}
        renderedDomNodes={renderedDomNodes}
        renderDuration={renderDuration}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
      />

      {/* ── Category Filter ── */}
      <nav className="category-nav" aria-label="Lọc theo danh mục">
        <div className="category-nav__inner">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${
                activeCategory === cat ? "category-chip--active" : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="app-main">
        {/* Banner hướng dẫn đo Lighthouse */}
        <div className="lighthouse-guide-card">
          <div>
            <strong>📌 Hướng dẫn đo kiểm thử Lighthouse:</strong> Mở Chrome DevTools (F12) &gt; Tab <strong>Lighthouse</strong> &gt; Chọn <strong>Navigation / Desktop hoặc Mobile</strong> &gt; Bấm <strong>Analyze page load</strong>.
            Hiện tại đang ở chế độ: <span style={{ color: isOptimized ? "#34d399" : "#f87171", fontWeight: 700 }}>{isOptimized ? "ĐÃ TỐI ƯU (Optimized)" : "CHƯA TỐI ƯU (Unoptimized)"}</span>.
          </div>
          <span className="lighthouse-guide-badge">
            {isOptimized ? "⚡ Virtual Grid Active" : "⚠️ 10.000 Full DOM Active"}
          </span>
        </div>

        <div className="products-header">
          <p className="products-count">
            Hiển thị {filteredProducts.length.toLocaleString("vi-VN")} /{" "}
            {MOCK_10K_PRODUCTS.length.toLocaleString("vi-VN")} sản phẩm
            {searchQuery && ` cho từ khoá "${searchQuery}"`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : isOptimized ? (
          /* ⚡ CHẾ ĐỘ ĐÃ TỐI ƯU: Virtual Grid Windowing (Chỉ render 15-30 card trong viewport) */
          <div
            className="virtual-grid-container"
            style={{ height: `${totalHeight}px` }}
          >
            {filteredProducts.slice(startIndex, endIndex).map((product, idx) => {
              const actualIndex = startIndex + idx;
              return (
                <OptimizedProductCard
                  key={product.id}
                  product={product}
                  style={getItemStyle(actualIndex)}
                />
              );
            })}
          </div>
        ) : (
          /* ⚠️ CHẾ ĐỘ CHƯA TỐI ƯU: Render thẳng 10.000 sản phẩm vào DOM (Nghẽn Main-thread & DOM size bùng nổ) */
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <UnoptimizedProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Báo cáo kỹ thuật đối chiếu ── */}
        <section className="commentary">
          <div className="commentary__header">
            <span className="commentary__badge">LTWNC · Báo cáo tối ưu tuần 5</span>
            <h2 className="commentary__title">
              Các kỹ thuật tối ưu hóa hiệu năng đã áp dụng
            </h2>
          </div>

          <div className="commentary__grid">
            <div className="commentary__col">
              <h3 className="commentary__col-title">1. List Virtualization (Windowing)</h3>
              <ul>
                <li>
                  <strong>Vấn đề:</strong> Render cùng lúc 10.000 sản phẩm tạo ra hơn <strong>70.000 DOM nodes</strong>. Trình duyệt bị nghẽn bộ nhớ, DOM Size cảnh báo đỏ, scroll giật lag và TBT tăng vọt.
                </li>
                <li>
                  <strong>Giải pháp:</strong> Xây dựng custom hook <code>useVirtualGrid</code> chỉ render ~25 items trong viewport màn hình. DOM nodes giảm từ 70.000 xuống <strong>&lt; 300 nodes</strong>, scroll mượt mà 60 FPS.
                </li>
              </ul>
            </div>

            <div className="commentary__col">
              <h3 className="commentary__col-title">2. Memoization (React.memo, useMemo, useCallback)</h3>
              <ul>
                <li>
                  <strong>Vấn đề:</strong> Mỗi khi người dùng gõ tìm kiếm hoặc click favorite 1 sản phẩm, toàn bộ danh sách 10.000 card đều bị re-render và thực thi lại các phép tính lặp lại.
                </li>
                <li>
                  <strong>Giải pháp:</strong> Bọc <code>OptimizedProductCard</code> trong <code>React.memo</code> với comparator tùy biến. Dùng <code>useMemo</code> cache kết quả lọc sản phẩm.
                </li>
              </ul>
            </div>

            <div className="commentary__col">
              <h3 className="commentary__col-title">3. Code-Splitting (React.lazy & Suspense)</h3>
              <ul>
                <li>
                  <strong>Vấn đề:</strong> Module thống kê biểu đồ (<code>ProductAnalyticsModal</code>) có dung lượng lớn bị gom vào main bundle, làm tăng Initial Bundle Size và kéo dài FCP/LCP.
                </li>
                <li>
                  <strong>Giải pháp:</strong> Tách module bằng dynamic <code>import()</code> và <code>React.lazy()</code>, chỉ tải khi người dùng nhấn nút mở modal.
                </li>
              </ul>
            </div>

            <div className="commentary__col">
              <h3 className="commentary__col-title">4. Concurrent React (useDeferredValue)</h3>
              <ul>
                <li>
                  <strong>Vấn đề:</strong> Gõ input tìm kiếm gây block luồng chính (Main Thread) vì phải lọc lại danh sách lớn ngay lập tức.
                </li>
                <li>
                  <strong>Giải pháp:</strong> Dùng <code>useDeferredValue</code> để hoãn việc tính toán lọc danh sách, ưu tiên phản hồi ngay lập tức cho ký tự người dùng vừa nhập vào ô input.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ── Drawers & Modals ── */}
      <FavoritesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Code-Splitting Demo */}
      {analyticsOpen && (
        <Suspense
          fallback={
            <div className="analytics-modal-backdrop">
              <div style={{ color: "#fff", padding: "40px" }}>
                ⏳ Đang tải module phân tích (Dynamic Import Chunk)...
              </div>
            </div>
          }
        >
          <LazyAnalyticsModal
            open={analyticsOpen}
            onClose={() => setAnalyticsOpen(false)}
            products={MOCK_10K_PRODUCTS}
          />
        </Suspense>
      )}
    </div>
  );
}
