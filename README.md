# LTWNC · Bài tập tuần 6 — Testing với Jest & React Testing Library

<div align="center">

![Tests](https://img.shields.io/badge/tests-39%20passed-brightgreen?style=for-the-badge&logo=jest)
![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?style=for-the-badge&logo=codecov)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge&logo=redux)
![Testing Library](https://img.shields.io/badge/Testing%20Library-React%20v16-E33332?style=for-the-badge&logo=testinglibrary)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)

</div>

> **Môn:** Lập trình Web Nâng Cao (LTWNC)  
> **Tuần:** 6 — Automated Testing (Unit Tests & Integration Tests)  
> **Framework kiểm thử:** Jest 29 + React Testing Library (RTL) + ts-jest  
> **Độ bao phủ (Code Coverage):** **99.07% Statements · 98.95% Lines · 100% Functions** (39/39 test cases PASS)

---

## 📌 Mục tiêu bài tập Tuần 6

Kế thừa và mở rộng ứng dụng e-commerce (Zustand Store) từ tuần 4, triển khai hệ thống kiểm thử toàn diện gồm:
1. **Unit Testing:**
   - **Store (Zustand):** Kiểm thử state management, tính bất biến, idempotency và các actions.
   - **Utilities:** Kiểm thử hàm tính toán giá, định dạng tiền tệ (VND), bộ lọc và tổng tiền.
   - **Services (Async/API):** Mocking `fetch` API, xử lý kết quả thành công và ngoại lệ `ApiError`.
   - **Custom Hooks:** Kiểm thử lifecycle, loading state, error handling với `renderHook` và `act`.
2. **Integration Testing:**
   - **Components:** Kiểm thử render DOM, accessibility (`aria-label`, `aria-pressed`), tương tác người dùng, sự kiện click (`stopPropagation`), đồng bộ giữa UI và Zustand store.

---

## 🚀 Khởi chạy & Kiểm thử

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy toàn bộ Test Suites
```bash
npm test
```

### 3. Chạy kiểm thử kèm báo cáo Coverage
```bash
npm run test:coverage
```
> Báo cáo HTML trực quan được sinh ra tại thư mục `coverage/index.html`.

### 4. Khởi chạy ứng dụng (Development)
```bash
npm run dev
```
Truy cập ứng dụng tại: **http://localhost:5173**

---

## 📁 Cấu trúc thư mục dự án

```text
d:/w4-web/
├── src/
│   ├── __tests__/                     # 🧪 Toàn bộ 7 Test Suites
│   │   ├── components/
│   │   │   ├── FavoriteButton.test.tsx    # Integration test nút yêu thích (TC-20 → TC-23)
│   │   │   ├── FavoritesDrawer.test.tsx   # Integration test drawer yêu thích (TC-24 → TC-28)
│   │   │   └── ProductCard.test.tsx       # Integration test thẻ sản phẩm (TC-29 → TC-31)
│   │   ├── hooks/
│   │   │   └── useProducts.test.ts        # Unit test custom hook useProducts (TC-18 → TC-19)
│   │   ├── services/
│   │   │   └── productService.test.ts     # Unit test API client & error handling (TC-13 → TC-17)
│   │   ├── store/
│   │   │   └── favoritesStore.test.ts     # Unit test Zustand store (TC-01 → TC-08)
│   │   └── utils/
│   │       └── productUtils.test.ts       # Unit test tiện ích tính toán (TC-09 → TC-12)
│   ├── components/
│   │   ├── FavoriteButton.tsx         # Component nút Favorite
│   │   ├── FavoritesDrawer.tsx        # Drawer hiển thị sản phẩm yêu thích
│   │   └── ProductCard.tsx            # Thẻ hiển thị sản phẩm & rating sao
│   ├── hooks/
│   │   └── useProducts.ts             # Hook nạp dữ liệu sản phẩm bất đồng bộ
│   ├── services/
│   │   └── productService.ts          # Service API sản phẩm
│   ├── store/
│   │   └── favoritesStore.ts          # Zustand Store (Favorites)
│   ├── utils/
│   │   └── productUtils.ts            # Các hàm helper tính toán
│   ├── jest.d.ts                      # Khai báo type jest-dom matchers
│   ├── App.tsx                        # Root Component
│   └── index.css                      # Global styles
├── jest.config.cjs                    # Cấu hình Jest & ts-jest
├── jest.setup.ts                      # Cấu hình jest-dom & fetch polyfill
└── package.json
```

---

## 📋 Danh sách Test Cases (39 Tests — 100% Passed)

### 1. Zustand Store (`favoritesStore.test.ts`)
| Mã TC | Mô tả Test Case | Kết quả |
|---|---|:---:|
| **TC-01** | Store khởi tạo với trạng thái rỗng (`favoriteIds.size = 0`, `favoriteItems = []`) | ✅ PASS |
| **TC-02** | `addFavorite`: Thêm sản phẩm mới vào store chính xác | ✅ PASS |
| **TC-03** | `addFavorite`: Đảm bảo tính idempotent, không thêm sản phẩm trùng lặp | ✅ PASS |
| **TC-04** | `removeFavorite`: Xóa sản phẩm theo ID và giữ nguyên sản phẩm còn lại | ✅ PASS |
| **TC-05** | `removeFavorite`: An toàn, không gây lỗi khi xóa ID không tồn tại | ✅ PASS |
| **TC-06** | `toggleFavorite`: Tự động thêm khi chưa có và gỡ bỏ khi đã có | ✅ PASS |
| **TC-07** | `isFavorite`: Trả về đúng `true`/`false` theo ID sản phẩm | ✅ PASS |
| **TC-08** | `clearAll`: Reset toàn bộ danh sách và Set ID về rỗng | ✅ PASS |

### 2. Utility Functions (`productUtils.test.ts`)
| Mã TC | Mô tả Test Case | Kết quả |
|---|---|:---:|
| **TC-09** | `formatCurrency`: Định dạng chuẩn tiền tệ VND (phân cách hàng nghìn, ký hiệu `₫`) | ✅ PASS |
| *Edge* | `formatCurrency`: Xử lý giá trị âm hoặc `NaN` trả về `'0₫'` | ✅ PASS |
| **TC-10** | `calculateDiscount`: Tính đúng giá bán sau chiết khấu (20%) | ✅ PASS |
| *Edge* | `calculateDiscount`: Giữ nguyên giá khi discount = 0%, trả về 0 khi discount = 100% hoặc giá âm | ✅ PASS |
| **TC-11** | `filterProducts`: Trả về toàn bộ danh sách khi chọn 'Tất cả' | ✅ PASS |
| *Case* | `filterProducts`: Lọc chính xác theo danh mục và từ khóa tìm kiếm (không phân biệt hoa/thường) | ✅ PASS |
| **TC-12** | `calculateTotalAmount`: Tính chính xác tổng tiền của danh sách sản phẩm | ✅ PASS |
| *Edge* | `calculateTotalAmount`: Trả về 0 khi danh sách rỗng | ✅ PASS |

### 3. API Services & Mocking (`productService.test.ts`)
| Mã TC | Mô tả Test Case | Kết quả |
|---|---|:---:|
| **TC-13** | `fetchProducts`: Trả về danh sách sản phẩm khi API phản hồi 200 OK | ✅ PASS |
| **TC-14** | `fetchProducts`: Ném ngoại lệ `ApiError` với status 500 khi server lỗi | ✅ PASS |
| **TC-15** | `fetchProducts`: Nối đúng query parameter `?category=...` khi lọc | ✅ PASS |
| **TC-16** | `fetchProductById`: Trả về đúng chi tiết sản phẩm theo ID hợp lệ | ✅ PASS |
| **TC-17** | `fetchProductById`: Kiểm tra validation đầu vào, ném Error khi ID rỗng | ✅ PASS |

### 4. Custom Hook Testing (`useProducts.test.ts`)
| Mã TC | Mô tả Test Case | Kết quả |
|---|---|:---:|
| **TC-18** | `useProducts`: Khởi tạo với `loading: true`, sau đó cập nhật dữ liệu và `loading: false` | ✅ PASS |
| **TC-19** | `useProducts`: Gán thông báo lỗi vào `error` khi API thất bại, không làm crash ứng dụng | ✅ PASS |

### 5. Integration Components (`FavoriteButton`, `FavoritesDrawer`, `ProductCard`)
| Mã TC | Mô tả Test Case | Kết quả |
|---|---|:---:|
| **TC-20** | `FavoriteButton`: Hiển thị đúng `aria-label="Thêm yêu thích"` và `aria-pressed="false"` khi chưa like | ✅ PASS |
| **TC-21** | `FavoriteButton`: Click nút thêm vào store, cập nhật `aria-label="Bỏ yêu thích"` và class active | ✅ PASS |
| **TC-22** | `FavoriteButton`: Click lần 2 bỏ yêu thích, trạng thái nút quay lại ban đầu | ✅ PASS |
| **TC-23** | `FavoriteButton`: Sự kiện click được `stopPropagation`, không lan lên phần tử cha | ✅ PASS |
| **TC-24** | `FavoritesDrawer`: Hiển thị thông báo trạng thái rỗng khi chưa có sản phẩm | ✅ PASS |
| **TC-25** | `FavoritesDrawer`: Render danh sách sản phẩm yêu thích khi store có dữ liệu | ✅ PASS |
| **TC-26** | `FavoritesDrawer`: Nhấn nút ✕ xóa sản phẩm khỏi store và cập nhật UI | ✅ PASS |
| **TC-27** | `FavoritesDrawer`: Nhấn nút "Xoá tất cả" đưa giao diện về trạng thái rỗng | ✅ PASS |
| **TC-28** | `FavoritesDrawer`: Nhấn nút đóng drawer kích hoạt hàm callback `onClose` | ✅ PASS |
| **TC-29** | `ProductCard`: Render đầy đủ thông tin (tên, mô tả, danh mục, giá VND, ảnh lazy load, nút Mua) | ✅ PASS |
| **TC-30** | `ProductCard`: Hiển thị chính xác số sao đánh giá (`StarRating`) và lượt review | ✅ PASS |
| **TC-31** | `ProductCard`: Tích hợp `FavoriteButton` trong card, tương tác toggle yêu thích mượt mà | ✅ PASS |

---

## 📊 Báo cáo kết quả Code Coverage

| File / Module | % Statements | % Branches | % Functions | % Lines | Trạng thái |
|---|:---:|:---:|:---:|:---:|:---:|
| **Toàn bộ dự án (All files)** | **99.07%** | **84.09%** | **100.00%** | **98.95%** | 🟢 **Gần như tuyệt đối** |
| `src/store/favoritesStore.ts` | 100.00% | 100.00% | 100.00% | 100.00% | 🟢 Tối đa |
| `src/utils/productUtils.ts` | 100.00% | 92.85% | 100.00% | 100.00% | 🟢 Tối đa |
| `src/components/FavoriteButton.tsx`| 100.00% | 100.00% | 100.00% | 100.00% | 🟢 Tối đa |
| `src/components/ProductCard.tsx`   | 100.00% | 50.00% | 100.00% | 100.00% | 🟢 Tối đa |
| `src/components/FavoritesDrawer.tsx`| 100.00% | 66.66% | 100.00% | 100.00% | 🟢 Xuất sắc |
| `src/hooks/useProducts.ts` | 100.00% | 50.00% | 100.00% | 100.00% | 🟢 Xuất sắc |
| `src/services/productService.ts` | 95.23% | 83.33% | 100.00% | 95.23% | 🟢 Xuất sắc |

> **Tổng kết:** **7/7 Test Suites PASS**, **39/39 Test Cases PASS**, độ bao phủ dòng lệnh đạt **98.95%** và hàm đạt **100%**.

---

## 🛠️ Kỹ thuật kiểm thử áp dụng

1. **Test Isolation:** Sử dụng `beforeEach(() => { useFavoritesStore.getState().clearAll(); })` và `jest.clearAllMocks()` trước mỗi test để đảm bảo tính độc lập tuyệt đối giữa các test case.
2. **Mocking Global Fetch:** Giả lập API trong môi trường JSDOM thông qua `global.fetch = jest.fn()` kết hợp mock `Promise.resolve` và `Promise.reject`.
3. **Asynchronous Testing:** Sử dụng `waitFor`, `act` và `async/await` để kiểm thử chính xác các hành vi bất đồng bộ trong Custom Hooks và API Services.
4. **Accessible Testing:** Tuân thủ tiêu chuẩn W3C WAI-ARIA khi truy vấn phần tử bằng `getByRole('button')`, kiểm tra thuộc tính `aria-label` và `aria-pressed` thông qua `@testing-library/jest-dom`.
5. **Event Handling & Isolation:** Kiểm tra sự kiện click, ngăn chặn nổi bọt (`event.stopPropagation()`) bảo vệ UX khi click nút yêu thích nằm lồng bên trong card sản phẩm.

---

## 💻 Môi trường & Công nghệ sử dụng

- **Runtime & Bundler:** Node.js, Vite 5
- **Ngôn ngữ:** TypeScript 5.6
- **Thư viện UI & State:** React 18.3, Zustand 5.0
- **Testing Engine:** Jest 29, ts-jest 29, jsdom
- **Testing Utilities:** React Testing Library 16, `@testing-library/jest-dom` 7, `@testing-library/user-event` 14
