import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlistedIds: string[];
  count: number;
  setWishlistedIds: (ids: string[]) => void;
  toggleId: (id: string) => void;
  setCount: (count: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistedIds: [],
      count: 0,
      setWishlistedIds: (ids) => set({ wishlistedIds: ids, count: ids.length }),
      toggleId: (id) => {
        const current = get().wishlistedIds;
        const exists = current.includes(id);
        const updated = exists
          ? current.filter((i) => i !== id)
          : [...current, id];
        set({ wishlistedIds: updated, count: updated.length });
      },
      setCount: (count) => set({ count }),
    }),
    { name: "meowmeal_wishlist" },
  ),
);
