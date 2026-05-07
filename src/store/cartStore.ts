import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart } from "@/types";

interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  clearCart: () => void;
  totalItems: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      totalItems: 0,
      setCart: (cart) =>
        set({ cart, totalItems: cart?.totalItems || 0 }),
      clearCart: () => set({ cart: null, totalItems: 0 }),
    }),
    { name: "meowmeal_cart" }
  )
);