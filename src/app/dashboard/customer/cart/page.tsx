"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { Cart } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [note, setNote] = useState("");

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      const cartData = res.data.data as Cart;
      setCart(cartData);
      return cartData;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      await api.patch(`/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/cart/${itemId}`);
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/cart");
    },
    onSuccess: () => {
      toast.success("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!cart || cart.items.length === 0) return;

      const providerId = cart.items[0].meal.provider.id;

      await api.post("/orders", {
        providerId,
        deliveryAddress: address,
        deliveryCity: city,
        note,
        items: cart.items.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
      });
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      setCheckoutOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      router.push("/dashboard/customer/orders");
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Add some delicious meals to get started
        </p>
        <Link href="/meals">
          <Button className="bg-primary hover:bg-primary-hover text-white">
            Browse Meals
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Cart</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cart.totalItems} item(s) in your cart
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Image */}
              <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.meal.images[0] || "/placeholder-food.jpg"}
                  alt={item.meal.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.meal.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.meal.provider.shopName}
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  ৳{item.meal.price}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  onClick={() =>
                    item.quantity > 1
                      ? updateMutation.mutate({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        })
                      : removeMutation.mutate(item.id)
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  onClick={() =>
                    updateMutation.mutate({
                      itemId: item.id,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Subtotal */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">
                  ৳{(item.meal.price * item.quantity).toFixed(0)}
                </p>
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  className="text-xs text-destructive hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground truncate flex-1 mr-2">
                  {item.meal.title} x{item.quantity}
                </span>
                <span className="font-medium shrink-0">
                  ৳{(item.meal.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex items-center justify-between font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">
                ৳{cart.totalAmount.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Checkout Dialog */}
          <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white h-11">
                Proceed to Checkout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Order</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Delivery Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Note (Optional)</Label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instructions?"
                  />
                </div>
                <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">
                    ৳{cart.totalAmount.toFixed(0)}
                  </span>
                </div>
                <Button
                  onClick={() => orderMutation.mutate()}
                  disabled={
                    orderMutation.isPending || !address.trim() || !city.trim()
                  }
                  className="w-full bg-primary hover:bg-primary-hover text-white h-11"
                >
                  {orderMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order — Cash on Delivery"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}