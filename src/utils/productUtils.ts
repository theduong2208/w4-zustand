import type { Product } from "../types/product";

/**
 * Format số tiền sang định dạng tiền tệ Việt Nam đồng
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount < 0) return "0₫";
  return `${amount.toLocaleString("vi-VN")}₫`;
}

/**
 * Tính giá sau khi áp dụng phần trăm giảm giá (0 - 100%)
 */
export function calculateDiscount(price: number, discountPercent: number): number {
  if (price < 0) return 0;
  if (discountPercent <= 0) return price;
  if (discountPercent >= 100) return 0;
  return Math.round(price * (1 - discountPercent / 100));
}

/**
 * Lọc danh sách sản phẩm theo danh mục và từ khóa tìm kiếm
 */
export function filterProducts(
  products: Product[],
  category: string,
  searchQuery: string
): Product[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products.filter((p) => {
    const matchCategory =
      category === "Tất cả" || p.category.toLowerCase() === category.toLowerCase();
    const matchQuery =
      normalizedQuery === "" || p.name.toLowerCase().includes(normalizedQuery);

    return matchCategory && matchQuery;
  });
}

/**
 * Tính tổng tiền các sản phẩm trong giỏ/danh sách yêu thích
 */
export function calculateTotalAmount(items: Product[]): number {
  return items.reduce((total, item) => total + (item.price || 0), 0);
}
