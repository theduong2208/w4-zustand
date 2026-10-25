"use client";

import React, { useState, useMemo } from "react";
import type { ExtendedProduct } from "@/lib/productsData";
import ProductCard from "./ProductCard";

interface Props {
  initialProducts: ExtendedProduct[];
  categories: string[];
}

export default function ProductCatalog({ initialProducts, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchCategory =
        selectedCategory === "Tất cả" || product.category === selectedCategory;
      const matchQuery =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <section id="products" className="catalog-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-badge">DANH MỤC SẢN PHẨM</span>
          <h2 className="section-title">Thiết bị Công nghệ Nổi bật</h2>
          <p className="section-desc">
            Dữ liệu SSR tối ưu SEO, hỗ trợ thêm yêu thích tức thì qua Zustand Store
          </p>
        </div>

        {/* Search input */}
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm tai nghe, chuột, màn hình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Tìm kiếm sản phẩm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-chips-list" role="tablist" aria-label="Lọc theo danh mục">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`category-chip ${
              selectedCategory === cat ? "category-chip-active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
            {cat === "Tất cả" && ` (${initialProducts.length})`}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-catalog">
          <div className="empty-catalog-icon">🔍</div>
          <h3 className="empty-catalog-title">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="empty-catalog-desc">
            Hãy thử tìm với từ khóa khác hoặc chuyển sang danh mục "Tất cả".
          </p>
          <button
            onClick={() => {
              setSelectedCategory("Tất cả");
              setSearchQuery("");
            }}
            className="btn-reset-filter"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
