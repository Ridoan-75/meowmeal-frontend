"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  MapPin,
  FileText,
  ArrowRight,
  Store,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { Cart } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
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
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      await api.patch(`/cart/${itemId}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/cart/${itemId}`);
    },
    onSuccess: () => {
      toast.success("Item removed", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/cart");
    },
    onSuccess: () => {
      toast.success("Cart cleared", { duration: 2000 });
      setClearConfirm(false);
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
      toast.success("Order placed successfully!", { duration: 2000 });
      setCheckoutOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      router.push("/dashboard/customer/orders");
    },
    onError: () => toast.error("Failed to place order. Please try again."),
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
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Add some delicious meals to get started
          </p>
        </div>
        <Link
          href="/meals"
          className="flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          Browse Meals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Cart</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cart.totalItems} item{cart.totalItems > 1 ? "s" : ""} from{" "}
            {cart.items[0]?.meal.provider.shopName}
          </p>
        </div>
        <button
          onClick={() => setClearConfirm(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all cursor-pointer border border-destructive/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {/* Provider Info */}
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">{cart.items[0]?.meal.provider.shopName}</p>
              <p className="text-xs text-muted-foreground">All items from this restaurant</p>
            </div>
          </div>

          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-all"
            >
              {/* Image */}
              <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                <Image
                  src={item.meal.images[0] || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"}
                  alt={item.meal.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.meal.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.meal.provider.shopName}</p>
                <p className="text-sm font-extrabold text-primary mt-1">৳{item.meal.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                      : removeMutation.mutate(item.id)
                  }
                  className="h-8 w-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                  className="h-8 w-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Subtotal + Remove */}
              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold">৳{(item.meal.price * item.quantity).toFixed(0)}</p>
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  className="text-xs text-destructive hover:underline mt-1 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="font-bold">Order Summary</h2>

            <div className="flex flex-col gap-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-muted-foreground truncate flex-1">
                    {item.meal.title} ×{item.quantity}
                  </span>
                  <span className="font-semibold shrink-0">
                    ৳{(item.meal.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-bold">Total</span>
              <span className="text-primary text-xl font-extrabold">
                ৳{cart.totalAmount.toFixed(0)}
              </span>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
                "bg-primary hover:brightness-110 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                "flex items-center justify-center gap-2"
              )}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <span className="text-lg">💵</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay when you receive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
            <h2 className="text-lg font-bold">Confirm Your Order</h2>

            {/* Delivery Info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Delivery Address
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Note
                  <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special instructions?"
                  className="rounded-xl resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-secondary rounded-xl p-3 flex flex-col gap-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate flex-1">
                    {item.quantity}× {item.meal.title}
                  </span>
                  <span className="font-semibold shrink-0 ml-2">
                    ৳{(item.meal.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">৳{cart.totalAmount.toFixed(0)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => orderMutation.mutate()}
                disabled={orderMutation.isPending || !address.trim() || !city.trim()}
                className={cn(
                  "flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
                  "bg-primary hover:brightness-110 active:scale-[0.98]",
                  "flex items-center justify-center gap-2",
                  (orderMutation.isPending || !address.trim() || !city.trim()) && "opacity-60 cursor-not-allowed"
                )}
              >
                {orderMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing...
                  </>
                ) : (
                  <>Place Order 💵</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirm */}
      <ConfirmModal
        open={clearConfirm}
        title="Clear your cart?"
        description="All items will be removed from your cart. This cannot be undone."
        confirmText="Clear Cart"
        loading={clearMutation.isPending}
        onConfirm={() => clearMutation.mutate()}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}