/**
 * @file src/__tests__/utils/productUtils.test.ts
 * Unit tests — Hàm tiện ích: formatCurrency, calculateDiscount, filterProducts, calculateTotalAmount
 */
import {
  formatCurrency,
  calculateDiscount,
  filterProducts,
  calculateTotalAmount,
} from "../../utils/productUtils";
import type { Product } from "../../types/product";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Tai nghe Sony WH-1000XM5",
    price: 8490000,
    category: "Âm thanh",
    image: "sony.jpg",
    rating: 4.8,
    reviewCount: 2341,
    description: "Chống ồn",
  },
  {
    id: "p2",
    name: "Apple AirPods Pro 2",
    price: 6990000,
    category: "Âm thanh",
    image: "airpods.jpg",
    rating: 4.7,
    reviewCount: 1890,
    description: "H2 chip",
  },
  {
    id: "p3",
    name: "Bàn phím Keychron K2",
    price: 2990000,
    category: "Phụ kiện máy tính",
    image: "keychron.jpg",
    rating: 4.6,
    reviewCount: 874,
    description: "Hot-swap RGB",
  },
];

describe("Unit: productUtils", () => {
  // TC-09
  describe("formatCurrency", () => {
    it("TC-09: định dạng số tiền sang chuẩn VND (có dấu ₫)", () => {
      const result = formatCurrency(1000000);
      expect(result).toContain("1.000.000");
      expect(result).toContain("₫");
    });

    it("trả về '0₫' khi giá trị âm hoặc NaN", () => {
      expect(formatCurrency(-100)).toBe("0₫");
      expect(formatCurrency(NaN)).toBe("0₫");
    });
  });

  // TC-10
  describe("calculateDiscount", () => {
    it("TC-10: tính đúng giá sau giảm 20%", () => {
      expect(calculateDiscount(1000000, 20)).toBe(800000);
    });

    it("giữ nguyên giá gốc khi discount = 0", () => {
      expect(calculateDiscount(1000000, 0)).toBe(1000000);
    });

    it("trả về 0 khi discount = 100%", () => {
      expect(calculateDiscount(1000000, 100)).toBe(0);
    });

    it("trả về 0 khi giá âm", () => {
      expect(calculateDiscount(-5000, 10)).toBe(0);
    });
  });

  // TC-11
  describe("filterProducts", () => {
    it("TC-11: 'Tất cả' trả về toàn bộ sản phẩm", () => {
      expect(filterProducts(mockProducts, "Tất cả", "")).toHaveLength(3);
    });

    it("lọc đúng theo danh mục cụ thể", () => {
      const result = filterProducts(mockProducts, "Âm thanh", "");
      expect(result).toHaveLength(2);
      result.forEach((p) => expect(p.category).toBe("Âm thanh"));
    });

    it("lọc theo từ khóa không phân biệt chữ hoa/thường", () => {
      const result = filterProducts(mockProducts, "Tất cả", "SONY");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("p1");
    });

    it("trả về mảng rỗng khi không khớp điều kiện", () => {
      expect(filterProducts(mockProducts, "Phụ kiện máy tính", "airpods")).toHaveLength(0);
    });
  });

  // TC-12
  describe("calculateTotalAmount", () => {
    it("TC-12: tính đúng tổng tiền toàn bộ danh sách", () => {
      const total = calculateTotalAmount(mockProducts);
      expect(total).toBe(8490000 + 6990000 + 2990000);
    });

    it("trả về 0 khi danh sách rỗng", () => {
      expect(calculateTotalAmount([])).toBe(0);
    });
  });
});
