import type { Product } from "../types/product";

const CATEGORIES = [
  "Âm thanh",
  "Phụ kiện máy tính",
  "Màn hình",
  "Phụ kiện bàn làm việc",
  "Điện thoại & Tablet",
  "Thiết bị đeo thông minh",
  "Gaming Gears",
  "Nhà thông minh",
];

const ADJECTIVES = [
  "Cao cấp",
  "Pro",
  "Ultra",
  "Max",
  "Studio",
  "Không dây",
  "Chống ồn",
  "Gaming",
  "Thông minh",
  "Siêu mỏng",
  "Ergonomic",
  "RGB",
];

const NOUNS = [
  "Tai nghe",
  "Bàn phím cơ",
  "Chuột quang học",
  "Màn hình 4K",
  "Đèn bàn LED",
  "Giá đỡ hợp kim",
  "Webcam AI",
  "Loa Bluetooth",
  "Hub USB-C",
  "Microphone thu âm",
  "Đồng hồ thông minh",
  "Sạc nhanh GaN",
];

const BRANDS = [
  "Sony",
  "Apple",
  "Logitech",
  "Keychron",
  "LG",
  "Govee",
  "Razer",
  "Corsair",
  "Dell",
  "Samsung",
  "Anker",
  "Asus ROG",
];

// Seeded pseudorandom number generator for consistent data across renders
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateProducts(count = 10000): Product[] {
  const products: Product[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const brand = BRANDS[Math.floor(pseudoRandom(seed * 1) * BRANDS.length)];
    const noun = NOUNS[Math.floor(pseudoRandom(seed * 2) * NOUNS.length)];
    const adj = ADJECTIVES[Math.floor(pseudoRandom(seed * 3) * ADJECTIVES.length)];
    const category = CATEGORIES[Math.floor(pseudoRandom(seed * 4) * CATEGORIES.length)];

    const priceBase = Math.floor(pseudoRandom(seed * 5) * 500 + 10) * 50000;
    const rating = Math.round((3.8 + pseudoRandom(seed * 6) * 1.2) * 10) / 10;
    const reviewCount = Math.floor(pseudoRandom(seed * 7) * 4500) + 12;

    const imgId = (i % 80) + 10;

    products[i] = {
      id: `prod-${i + 1}`,
      name: `${noun} ${brand} ${adj} V${(i % 9) + 1}`,
      price: priceBase,
      category,
      image: `https://picsum.photos/seed/tech-prod-${imgId}/320/240`,
      rating,
      reviewCount,
      description: `Sản phẩm ${noun.toLowerCase()} ${brand} chính hãng, hỗ trợ công nghệ mới nhất 2026. Bảo hành 24 tháng.`,
    };
  }

  return products;
}

// Generate once at module level to avoid re-generating
export const MOCK_10K_PRODUCTS = generateProducts(10000);
export const ALL_CATEGORIES = ["Tất cả", ...CATEGORIES];
