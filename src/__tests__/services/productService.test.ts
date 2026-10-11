/**
 * @file src/__tests__/services/productService.test.ts
 * Unit tests bất đồng bộ — productService với fetch API được mock
 */
import { productService, ApiError } from "../../services/productService";
import type { Product } from "../../types/product";

const mockProductsData: Product[] = [
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
];

describe("Unit (Async): productService — fetch được mock", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // TC-13
  it("TC-13: fetchProducts — trả về danh sách sản phẩm khi API thành công (200)", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductsData,
    } as Response);

    const result = await productService.fetchProducts();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("p1");
  });

  // TC-14
  it("TC-14: fetchProducts — ném ApiError khi server trả 500", async () => {
    const errorResponse = { ok: false, status: 500 } as Response;
    // Mock 2 lần vì test gọi fetchProducts() 2 lần
    global.fetch = jest.fn()
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(errorResponse);

    await expect(productService.fetchProducts()).rejects.toThrow(ApiError);
    await expect(productService.fetchProducts()).rejects.toThrow("HTTP 500");
  });

  // TC-15
  it("TC-15: fetchProducts — truyền đúng query param khi lọc theo danh mục", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockProductsData[0]],
    } as Response);

    await productService.fetchProducts("Âm thanh");

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    // Kiểm tra URL có chứa query param category (encode UTF-8)
    expect(calledUrl).toContain("category=");
    expect(calledUrl).toContain("/products");
    // Đảm bảo không truyền category khi là 'Tất cả'
    expect(calledUrl).not.toContain("T%E1%BA%A5t+c%E1%BA%A3");
  });

  // TC-16
  it("TC-16: fetchProductById — trả về đúng sản phẩm khi tìm theo ID hợp lệ", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductsData[0],
    } as Response);

    const result = await productService.fetchProductById("p1");

    expect(result.id).toBe("p1");
    expect(result.name).toBe("Tai nghe Sony WH-1000XM5");
  });

  // TC-17
  it("TC-17: fetchProductById — ném Error khi ID rỗng (validation trước khi gọi API)", async () => {
    global.fetch = jest.fn();

    await expect(productService.fetchProductById("")).rejects.toThrow(
      "Product ID không hợp lệ"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
