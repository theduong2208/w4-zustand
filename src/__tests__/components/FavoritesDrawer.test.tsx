/**
 * @file src/__tests__/components/FavoritesDrawer.test.tsx
 * Integration tests — FavoritesDrawer component với React Testing Library
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoritesDrawer from "../../components/FavoritesDrawer";
import { useFavoritesStore } from "../../store/favoritesStore";
import type { Product } from "../../types/product";

const p1: Product = {
  id: "d-p1",
  name: "Màn hình LG UltraWide",
  price: 14990000,
  category: "Màn hình",
  image: "lg.jpg",
  rating: 4.5,
  reviewCount: 512,
  description: "34 inch 21:9",
};

const p2: Product = {
  id: "d-p2",
  name: "Webcam Logitech Brio 4K",
  price: 4290000,
  category: "Âm thanh",
  image: "brio.jpg",
  rating: 4.5,
  reviewCount: 1023,
  description: "4K 30fps HDR",
};

const mockOnClose = jest.fn();

describe("Integration: FavoritesDrawer component", () => {
  beforeEach(() => {
    useFavoritesStore.getState().clearAll();
    jest.clearAllMocks();
  });

  // TC-24
  it("TC-24: hiển thị trạng thái rỗng khi chưa có sản phẩm yêu thích", () => {
    render(<FavoritesDrawer open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Chưa có sản phẩm yêu thích")).toBeInTheDocument();
    expect(screen.getByText(/Nhấn ♥ trên sản phẩm để thêm vào đây/)).toBeInTheDocument();
  });

  // TC-25
  it("TC-25: hiển thị danh sách sản phẩm yêu thích khi store có dữ liệu", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().addFavorite(p2);

    render(<FavoritesDrawer open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Màn hình LG UltraWide")).toBeInTheDocument();
    expect(screen.getByText("Webcam Logitech Brio 4K")).toBeInTheDocument();
    expect(screen.getByText(/Xem tất cả \(2\)/)).toBeInTheDocument();
  });

  // TC-26
  it("TC-26: nhấn nút Xóa từng sản phẩm — xóa khỏi store và khỏi UI", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().addFavorite(p2);

    render(<FavoritesDrawer open={true} onClose={mockOnClose} />);

    const removeBtn = screen.getByLabelText(`Xóa ${p1.name}`);
    fireEvent.click(removeBtn);

    expect(screen.queryByText("Màn hình LG UltraWide")).not.toBeInTheDocument();
    expect(screen.getByText("Webcam Logitech Brio 4K")).toBeInTheDocument();
    expect(useFavoritesStore.getState().favoriteItems).toHaveLength(1);
  });

  // TC-27
  it("TC-27: nhấn 'Xoá tất cả' — xóa toàn bộ và hiển thị màn hình rỗng", () => {
    useFavoritesStore.getState().addFavorite(p1);
    render(<FavoritesDrawer open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Xoá tất cả"));

    expect(useFavoritesStore.getState().favoriteItems).toHaveLength(0);
    expect(screen.getByText("Chưa có sản phẩm yêu thích")).toBeInTheDocument();
  });

  // TC-28
  it("TC-28: nhấn nút đóng gọi callback onClose", () => {
    render(<FavoritesDrawer open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByLabelText("Đóng"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
