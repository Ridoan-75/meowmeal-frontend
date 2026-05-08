"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Meal } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { setCart } = useCartStore();
  const { wishlistedIds, toggleId } = useWishlistStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isWishlisted = wishlistedIds.includes(meal.id);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/cart", {
        mealId: meal.id,
        quantity: 1,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success(`${meal.title} added to cart!`);
      const cartRes = await api.get("/cart");
      setCart(cartRes.data.data);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/wishlist/toggle/${meal.id}`);
      return res.data.data;
    },
    onError: () => {
      // Revert optimistic update on error
      toggleId(meal.id);
      toast.error("Failed to update wishlist");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can add items to cart");
      return;
    }
    addToCartMutation.mutate();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
      toast.info("Please login as a customer", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      return;
    }

    // Optimistic update — immediately toggle UI
    const willBeWishlisted = !isWishlisted;
    toggleId(meal.id);
    toast.success(willBeWishlisted ? "Added to wishlist!" : "Removed from wishlist"), {duration: 2000};

    // Then sync with backend silently
    wishlistMutation.mutate();
  };

  return (
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-secondary">
        <Image
          src={
            meal.images?.[0] ||
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
          }
          alt={meal.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Unavailable */}
        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <Badge variant="destructive" className="font-bold px-4 py-1 text-sm">
              Unavailable
            </Badge>
          </div>
        )}

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {meal.avgRating && meal.avgRating >= 4.5 ? (
            <Badge className="bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 shadow-md">
              Top Rated
            </Badge>
          ) : (
            <div />
          )}

          {/* Like button — Optimistic */}
          <button
            onClick={handleWishlist}
            className="h-8 w-8 rounded-full bg-background/85 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-muted-foreground hover:text-red-400"
              )}
            />
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          {meal.avgRating !== undefined && meal.avgRating > 0 && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-white text-xs font-bold">
                {meal.avgRating.toFixed(1)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 text-white/80" />
            <span className="text-white text-xs font-medium">
              {meal.prepTime} min
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Provider + Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {meal.category?.name}
          </span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[110px] font-medium">
            {meal.provider?.shopName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {meal.title}
        </h3>

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {meal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + Buttons */}
        <div className="mt-auto pt-3 border-t border-border flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-black text-primary">
                ৳{meal.price}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                / serving
              </span>
            </div>
            {meal.totalReviews !== undefined && meal.totalReviews > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {meal.totalReviews} reviews
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/meals/${meal.id}`} className="flex-1">
              <button className="w-full h-9 rounded-xl border border-border hover:border-primary hover:text-primary text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 group/btn">
                View Details
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || !meal.isAvailable}
              className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm",
                addToCartMutation.isPending
                  ? "bg-primary/50 text-white"
                  : "bg-primary hover:bg-primary-hover text-white hover:scale-110 hover:shadow-md hover:shadow-primary/30"
              )}
            >
              {addToCartMutation.isPending ? (
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}