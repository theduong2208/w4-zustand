/**
 * @file src/__tests__/hooks/useProducts.test.ts
 * Unit tests — Custom hook useProducts với productService được mock
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../services/productService";
import type { Product } from "../../types/product";

// Mock toàn bộ module productService
jest.mock("../../services/productService");
const mockFetchProducts = productService.fetchProducts as jest.MockedFunction<
  typeof productService.fetchProducts
>;

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Tai nghe Sony",
    price: 8490000,
    category: "Âm thanh",
    image: "sony.jpg",
    rating: 4.8,
    reviewCount: 100,
    description: "Chống ồn",
  },
];

describe("Unit: useProducts hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC-18
  it("TC-18: trả về loading=true ban đầu, sau đó điền dữ liệu sản phẩm sau khi resolve", async () => {
    mockFetchProducts.mockResolvedValueOnce(sampleProducts);

    const { result } = renderHook(() => useProducts());

    // Ngay lúc mount: đang loading
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();

    // Sau khi fetch xong
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].id).toBe("p1");
    expect(result.current.error).toBeNull();
  });

  // TC-19
  it("TC-19: gán error message khi API thất bại, không crash ứng dụng", async () => {
    mockFetchProducts.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.products).toEqual([]);
  });
});
