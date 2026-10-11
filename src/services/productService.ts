import type { Product } from "../types/product";

const API_BASE_URL = "https://api.example.com";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Service bất đồng bộ tương tác với Product API
 */
export const productService = {
  /**
   * Lấy danh sách sản phẩm từ API (có hỗ trợ lọc theo danh mục)
   */
  async fetchProducts(category?: string): Promise<Product[]> {
    const url = new URL(`${API_BASE_URL}/products`);
    if (category && category !== "Tất cả") {
      url.searchParams.append("category", category);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Không thể tải danh sách sản phẩm: HTTP ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * Lấy chi tiết một sản phẩm theo ID
   */
  async fetchProductById(id: string): Promise<Product> {
    if (!id) {
      throw new Error("Product ID không hợp lệ");
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Không tìm thấy sản phẩm ${id}: HTTP ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  },
};
