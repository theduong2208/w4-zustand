/**
 * @file src/__tests__/components/ProductCard.test.tsx
 * Integration tests — ProductCard component với React Testing Library
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../../components/ProductCard";
import { useFavoritesStore } from "../../store/favoritesStore";
import type { Product } from "../../types/product";

const mockProduct: Product = {
  id: "card-p1",
  name: "Bàn phím cơ Keychron Q1 Pro",
  price: 4990000,
  category: "Bàn phím",
  image: "keychron-q1.jpg",
  rating: 4.6,
  reviewCount: 1250,
  description: "Bàn phím cơ custom không dây",
};

describe("Integration: ProductCard component", () => {
  beforeEach(() => {
    useFavoritesStore.getState().clearAll();
  });

  // TC-29
  it("TC-29: render đầy đủ thông tin cơ bản của sản phẩm", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(mockProduct.name);
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();

    const img = screen.getByRole("img", { name: mockProduct.name });
    expect(img).toHaveAttribute("src", mockProduct.image);
    expect(img).toHaveAttribute("loading", "lazy");

    expect(screen.getByText("4.990.000₫")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mua ngay" })).toBeInTheDocument();
  });

  // TC-30
  it("TC-30: hiển thị đúng đánh giá sao và số lượt đánh giá", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByLabelText("4.6 sao")).toBeInTheDocument();
    expect(screen.getByText(/4\.6\s*\(1\.250\)/)).toBeInTheDocument();
  });

  // TC-31
  it("TC-31: tích hợp FavoriteButton và toggle trạng thái yêu thích thành công", () => {
    render(<ProductCard product={mockProduct} />);

    const favBtn = screen.getByRole("button", { name: "Thêm yêu thích" });
    expect(favBtn).toBeInTheDocument();

    fireEvent.click(favBtn);

    expect(useFavoritesStore.getState().isFavorite("card-p1")).toBe(true);
    expect(screen.getByRole("button", { name: "Bỏ yêu thích" })).toBeInTheDocument();
  });
});
