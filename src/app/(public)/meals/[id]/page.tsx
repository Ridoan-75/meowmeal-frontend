"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  Store,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MealCard } from "@/components/common/MealCard";
import api from "@/lib/axios";
import { Meal, Review } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function MealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Meal details
  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await api.get(`/meals/${id}`);
      return res.data.data as Meal & {
        reviews: Review[];
        totalReviews: number;
        avgRating: number;
      };
    },
  });

  // Related meals
  const { data: relatedMeals } = useQuery({
    queryKey: ["related-meals", meal?.categoryId],
    queryFn: async () => {
      const res = await api.get(
        `/meals?categoryId=${meal?.categoryId}&limit=4`
      );
      return (res.data.data as Meal[]).filter((m) => m.id !== id);
    },
    enabled: !!meal?.categoryId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/cart", {
        mealId: id,
        quantity,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Added to cart!");
      // Refresh cart
      const cartRes = await api.get("/cart");
      setCart(cartRes.data.data);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="h-96 rounded-2xl" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!meal) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-bold mb-2">Meal not found</h2>
            <Button onClick={() => router.push("/meals")}>
              Browse Meals
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to meals
          </button>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* Images */}
            <div className="flex flex-col gap-3">
              {/* Main Image */}
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={meal.images[selectedImage] || "/placeholder-food.jpg"}
                  alt={meal.title}
                  fill
                  className="object-cover"
                />
                {!meal.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-base px-4 py-2">
                      Currently Unavailable
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {meal.images.length > 1 && (
                <div className="flex gap-2">
                  {meal.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === i
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${meal.title} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              {/* Category + Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-0">
                  {meal.category.name}
                </Badge>
                {meal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold">{meal.title}</h1>

              {/* Rating + Prep Time */}
              <div className="flex items-center gap-4 text-sm">
                {meal.avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">{meal.avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({meal.totalReviews} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {meal.prepTime} min prep time
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {meal.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  ৳{meal.price}
                </span>
                <span className="text-sm text-muted-foreground">per serving</span>
              </div>

              {/* Provider Info */}
              <Link
                href={`/providers/${meal.provider.id}`}
                className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {meal.provider.shopName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {meal.provider.city}
                  </div>
                </div>
                <Badge
                  className={
                    meal.provider.isOpen
                      ? "bg-green-500/10 text-green-600 border-0"
                      : "bg-red-500/10 text-red-600 border-0"
                  }
                >
                  {meal.provider.isOpen ? "Open" : "Closed"}
                </Badge>
              </Link>

              {/* Quantity + Add to Cart */}
              {meal.isAvailable && meal.provider.isOpen && (
                <div className="flex flex-col gap-3 pt-2">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="font-bold text-foreground">
                      ৳{(meal.price * quantity).toFixed(0)}
                    </span>
                  </p>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="w-full h-12 bg-primary hover:bg-primary-hover text-white text-base font-semibold"
                  >
                    {addToCartMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </span>
                    ) : addToCartMutation.isSuccess ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart — ৳{(meal.price * quantity).toFixed(0)}
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">
              Reviews
              {meal.totalReviews > 0 && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  ({meal.totalReviews})
                </span>
              )}
            </h2>

            {meal.reviews && meal.reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meal.reviews.map((review: Review) => (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3"
                  >
                    {/* Reviewer */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {review.customer.name}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.sentiment && (
                        <Badge
                          className={`ml-auto text-xs border-0 ${
                            review.sentiment === "positive"
                              ? "bg-green-500/10 text-green-600"
                              : review.sentiment === "negative"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-gray-500/10 text-gray-600"
                          }`}
                        >
                          {review.sentiment}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reviews yet</p>
              </div>
            )}
          </div>

          {/* Related Meals */}
          {relatedMeals && relatedMeals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedMeals.slice(0, 4).map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}