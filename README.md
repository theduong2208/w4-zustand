# LTWNC · Bài tập tuần 4 — Zustand Store

> **Môn:** Lập trình Web nâng cao  
> **Tuần:** 4 — Quản lý state với Zustand  
> **Tính năng chính:** Sản phẩm yêu thích (thêm / bỏ khỏi danh sách)

---

## 🚀 Khởi chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại **http://localhost:5173**

---

## 📁 Cấu trúc thư mục

```
src/
├── store/
│   └── favoritesStore.ts      # ← Zustand store (state + actions)
├── components/
│   ├── FavoriteButton.tsx     # Nút ♥ toggle yêu thích
│   ├── FavoriteButton.css
│   ├── ProductCard.tsx        # Card sản phẩm
│   ├── ProductCard.css
│   ├── FavoritesDrawer.tsx    # Drawer danh sách yêu thích
│   └── FavoritesDrawer.css
├── data/
│   └── products.ts            # Dữ liệu mẫu 8 sản phẩm
├── types/
│   └── product.ts             # Interface Product
├── App.tsx                    # Root component
└── index.css                  # Global styles
```

---

## 🗂️ Cách hoạt động của `favoritesStore`

Sử dụng **Zustand** với pattern `create((set, get) => ({ ... }))`:

```ts
// src/store/favoritesStore.ts
export const useFavoritesStore = create<FavoritesState & FavoritesActions>(
  (set, get) => ({
    favoriteIds:   new Set<string>(),   // O(1) lookup
    favoriteItems: [],

    toggleFavorite: (product) => {
      get().favoriteIds.has(product.id)
        ? get().removeFavorite(product.id)
        : get().addFavorite(product);
    },

    isFavorite: (id) => get().favoriteIds.has(id),
    clearAll:   ()   => set({ favoriteIds: new Set(), favoriteItems: [] }),
    // ...
  })
);
```

Dùng **fine-grained selector** để tránh re-render thừa:

```tsx
// Chỉ re-render khi đúng slice thay đổi
const liked        = useFavoritesStore((s) => s.isFavorite(product.id));
const totalFavs    = useFavoritesStore((s) => s.favoriteItems.length);
const removeFav    = useFavoritesStore((s) => s.removeFavorite);
```

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| ♥ Toggle yêu thích | Nhấn icon tim trên card để thêm/bỏ |
| Badge số lượng | Header hiển thị tổng số sản phẩm yêu thích |
| Drawer slide-in | Nhấn nút tim ở header để xem danh sách |
| Xoá từng sản phẩm | Nút ✕ trong drawer |
| Xoá tất cả | Nút "Xoá tất cả" trong drawer |
| Tìm kiếm | Lọc sản phẩm theo tên real-time |
| Lọc danh mục | Category chips ở thanh navigation |

---

## 📝 Nhận xét kỹ thuật: Zustand `favoritesStore` vs Redux Toolkit

### ✅ Ưu điểm của Zustand

- **Zero boilerplate:** Toàn bộ state và action nằm trong một `create()` duy nhất — không cần `actionCreators`, `reducers`, `combineReducers`, hay `configureStore` riêng biệt như RTK.

- **Selector tối ưu sẵn:** `useFavoritesStore(s => s.favoriteItems)` chỉ re-render component khi đúng slice đó thay đổi, tương đương `useSelector` của RTK nhưng không cần cấu hình thêm bất cứ thứ gì.

- **Bundle nhẹ (~1 KB gzip):** Không phụ thuộc Immer, không bắt buộc Redux DevTools middleware — phù hợp app vừa và nhỏ, thời gian load trang nhanh hơn.

- **Không cần Provider:** Store là singleton global, có thể gọi `useFavoritesStore` ở bất kỳ component nào mà không cần bọc `<Provider>` ở root.

### ⚠️ Nhược điểm so với Redux Toolkit

- **DevTools thủ công:** RTK tự kết nối Redux DevTools Extension cho phép time-travel debug và inspect state history; Zustand cần cài thêm middleware `devtools()` và wrap thủ công.

- **Không có Immer tích hợp:** RTK dùng Immer bên dưới, cho phép "mutate" trực tiếp bên trong `createSlice`; Zustand yêu cầu spread object hoặc tự cài thư viện `immer` riêng.

- **Khó onboard team lớn:** RTK chuẩn hoá `createSlice`, `createAsyncThunk`, `createEntityAdapter` — quy ước rõ ràng, dễ code review; Zustand tự do hơn nhưng dễ thiếu nhất quán khi nhiều người cùng viết store.

### 🏁 Kết luận

> Với tính năng đơn lẻ như **"Sản phẩm yêu thích"**, Zustand là lựa chọn **tối ưu** — ít code, bundle nhẹ, không cần Provider. Khi dự án mở rộng với **≥ 5 slice** tương tác lẫn nhau, cần async thunk phức tạp và debug nghiêm túc, nên chuyển sang **Redux Toolkit**.

---

## 🛠️ Tech stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Zustand** — global state management
- **Vanilla CSS** — không dùng Tailwind
- **Inter** (Google Fonts)
