import { create } from "zustand";
import type { Product } from "../types/product";

// ─── State Shape ──────────────────────────────────────────────────────────────
interface FavoritesState {
  /** Set of favorited product IDs — O(1) lookup */
  favoriteIds: Set<string>;
  /** Full product objects for display */
  favoriteItems: Product[];
}

// ─── Actions ──────────────────────────────────────────────────────────────────
interface FavoritesActions {
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  clearAll: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useFavoritesStore = create<FavoritesState & FavoritesActions>(
  (set, get) => ({
    // initial state
    favoriteIds: new Set<string>(),
    favoriteItems: [],

    addFavorite: (product) => {
      const { favoriteIds, favoriteItems } = get();
      if (favoriteIds.has(product.id)) return; // idempotent

      const newIds = new Set(favoriteIds);
      newIds.add(product.id);
      set({ favoriteIds: newIds, favoriteItems: [...favoriteItems, product] });
    },

    removeFavorite: (id) => {
      const { favoriteIds, favoriteItems } = get();
      if (!favoriteIds.has(id)) return;

      const newIds = new Set(favoriteIds);
      newIds.delete(id);
      set({
        favoriteIds: newIds,
        favoriteItems: favoriteItems.filter((p) => p.id !== id),
      });
    },

    toggleFavorite: (product) => {
      const { favoriteIds, addFavorite, removeFavorite } = get();
      favoriteIds.has(product.id)
        ? removeFavorite(product.id)
        : addFavorite(product);
    },

    isFavorite: (id) => get().favoriteIds.has(id),

    clearAll: () => set({ favoriteIds: new Set(), favoriteItems: [] }),
  })
);
