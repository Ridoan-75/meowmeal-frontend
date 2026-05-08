"use client";

import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/axios";
import { Cart } from "@/types";
import { useEffect } from "react";

export const useCart = () => {
  const { isAuthenticated, user } = useAuth();
  const { setCart, cart, totalItems } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.data as Cart;
    },
    enabled: isAuthenticated && user?.role === "CUSTOMER",
  });

  useEffect(() => {
    if (data) {
      setCart(data);
    }
  }, [data]);

  return { cart, totalItems, isLoading };
};