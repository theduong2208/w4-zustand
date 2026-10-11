/**
 * @file src/__tests__/components/FavoriteButton.test.tsx
 * Integration tests — FavoriteButton component với React Testing Library
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteButton from "../../components/FavoriteButton";
import { useFavoritesStore } from "../../store/favoritesStore";
import type { Product } from "../../types/product";

const mockProduct: Product = {
  id: "test-p1",
  name: "Tai nghe Sony WH-1000XM5",
  price: 8490000,
  category: "Âm thanh",
  image: "sony.jpg",
  rating: 4.8,
  reviewCount: 2341,
  description: "Chống ồn chủ động",
};

describe("Integration: FavoriteButton component", () => {
  beforeEach(() => {
    useFavoritesStore.getState().clearAll();
  });

  // TC-20
  it("TC-20: hiển thị đúng aria-label 'Thêm yêu thích' khi sản phẩm chưa được yêu thích", () => {
    render(<FavoriteButton product={mockProduct} />);

    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-label", "Thêm yêu thích");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).not.toHaveClass("fav-btn--active");
  });

  // TC-21
  it("TC-21: click vào nút thêm sản phẩm vào store và cập nhật aria-label thành 'Bỏ yêu thích'", () => {
    render(<FavoriteButton product={mockProduct} />);

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(useFavoritesStore.getState().isFavorite("test-p1")).toBe(true);
    expect(btn).toHaveAttribute("aria-label", "Bỏ yêu thích");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveClass("fav-btn--active");
  });

  // TC-22
  it("TC-22: click lần 2 bỏ yêu thích, nút trở về trạng thái ban đầu", () => {
    render(<FavoriteButton product={mockProduct} />);
    const btn = screen.getByRole("button");

    fireEvent.click(btn); // thêm
    fireEvent.click(btn); // bỏ

    expect(useFavoritesStore.getState().isFavorite("test-p1")).toBe(false);
    expect(btn).toHaveAttribute("aria-label", "Thêm yêu thích");
    expect(btn).not.toHaveClass("fav-btn--active");
  });

  // TC-23
  it("TC-23: sự kiện click được stopPropagation — không lan ra phần tử cha", () => {
    const parentClickHandler = jest.fn();
    render(
      <div onClick={parentClickHandler}>
        <FavoriteButton product={mockProduct} />
      </div>
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
