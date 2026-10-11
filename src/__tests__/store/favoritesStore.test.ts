/**
 * @file src/__tests__/store/favoritesStore.test.ts
 * Unit tests — Zustand favoritesStore (state & actions)
 */
import { useFavoritesStore } from "../../store/favoritesStore";
import type { Product } from "../../types/product";

const p1: Product = {
  id: "prod-1",
  name: "Tai nghe Sony WH-1000XM5",
  price: 8490000,
  category: "Âm thanh",
  image: "sony.jpg",
  rating: 4.8,
  reviewCount: 2341,
  description: "Chống ồn chủ động",
};

const p2: Product = {
  id: "prod-2",
  name: "Chuột Logitech MX Master 3S",
  price: 2490000,
  category: "Phụ kiện",
  image: "logitech.jpg",
  rating: 4.9,
  reviewCount: 3102,
  description: "Chuột công thái học",
};

describe("Unit: favoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.getState().clearAll();
  });

  // TC-01
  it("TC-01: store khởi tạo với trạng thái rỗng", () => {
    const { favoriteIds, favoriteItems } = useFavoritesStore.getState();
    expect(favoriteIds.size).toBe(0);
    expect(favoriteItems).toEqual([]);
  });

  // TC-02
  it("TC-02: addFavorite — thêm sản phẩm vào danh sách yêu thích", () => {
    useFavoritesStore.getState().addFavorite(p1);
    const { favoriteIds, favoriteItems } = useFavoritesStore.getState();
    expect(favoriteIds.has("prod-1")).toBe(true);
    expect(favoriteItems).toHaveLength(1);
    expect(favoriteItems[0]).toEqual(p1);
  });

  // TC-03
  it("TC-03: addFavorite — idempotent, không thêm trùng lặp", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().addFavorite(p1);
    expect(useFavoritesStore.getState().favoriteIds.size).toBe(1);
    expect(useFavoritesStore.getState().favoriteItems).toHaveLength(1);
  });

  // TC-04
  it("TC-04: removeFavorite — xóa sản phẩm và giữ nguyên sản phẩm khác", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().addFavorite(p2);
    useFavoritesStore.getState().removeFavorite("prod-1");

    const { favoriteIds, favoriteItems } = useFavoritesStore.getState();
    expect(favoriteIds.has("prod-1")).toBe(false);
    expect(favoriteIds.has("prod-2")).toBe(true);
    expect(favoriteItems).toHaveLength(1);
    expect(favoriteItems[0].id).toBe("prod-2");
  });

  // TC-05
  it("TC-05: removeFavorite — không gây lỗi khi xóa id không tồn tại", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().removeFavorite("id-khong-ton-tai");
    expect(useFavoritesStore.getState().favoriteItems).toHaveLength(1);
  });

  // TC-06
  it("TC-06: toggleFavorite — thêm khi chưa có, xóa khi đã có", () => {
    useFavoritesStore.getState().toggleFavorite(p1);
    expect(useFavoritesStore.getState().isFavorite("prod-1")).toBe(true);

    useFavoritesStore.getState().toggleFavorite(p1);
    expect(useFavoritesStore.getState().isFavorite("prod-1")).toBe(false);
    expect(useFavoritesStore.getState().favoriteItems).toHaveLength(0);
  });

  // TC-07
  it("TC-07: isFavorite — trả về đúng trạng thái theo id", () => {
    expect(useFavoritesStore.getState().isFavorite("prod-1")).toBe(false);
    useFavoritesStore.getState().addFavorite(p1);
    expect(useFavoritesStore.getState().isFavorite("prod-1")).toBe(true);
    expect(useFavoritesStore.getState().isFavorite("prod-2")).toBe(false);
  });

  // TC-08
  it("TC-08: clearAll — xóa toàn bộ danh sách yêu thích", () => {
    useFavoritesStore.getState().addFavorite(p1);
    useFavoritesStore.getState().addFavorite(p2);
    useFavoritesStore.getState().clearAll();

    const { favoriteIds, favoriteItems } = useFavoritesStore.getState();
    expect(favoriteIds.size).toBe(0);
    expect(favoriteItems).toEqual([]);
  });
});
