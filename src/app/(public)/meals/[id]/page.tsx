"use client";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
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
  Heart,
  Zap,
  Share2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MealCard } from "@/components/common/MealCard";
import api from "@/lib/axios";
import type { AxiosError } from "axios";
import { Meal, Review, Order } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { setCart } = useCartStore();
  const { wishlistedIds, toggleId } = useWishlistStore();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const isWishlisted = wishlistedIds.includes(id as string);

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

  const { data: relatedMeals } = useQuery({
    queryKey: ["related-meals", meal?.categoryId],
    queryFn: async () => {
      const res = await api.get(
        `/meals?categoryId=${meal?.categoryId}&limit=4`,
      );
      return (res.data.data as Meal[]).filter((m) => m.id !== id);
    },
    enabled: !!meal?.categoryId,
  });

  const { data: canReview } = useQuery({
    queryKey: ["can-review", id],
    queryFn: async () => {
      if (!isAuthenticated || user?.role !== "CUSTOMER") return false;
      const res = await api.get(`/orders/my-orders?status=DELIVERED`);
      const orders = res.data.data as Order[];
      return orders.some((order: Order) =>
        order.items.some((item) => item.mealId === id),
      );
    },
    enabled: isAuthenticated && user?.role === "CUSTOMER",
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/cart", { mealId: id, quantity });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Added to cart!", { duration: 2000 });
      const cartRes = await api.get("/cart");
      setCart(cartRes.data.data);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/wishlist/toggle/${id}`);
      return res.data.data;
    },
    onError: () => {
      toggleId(id as string);
      toast.error("Failed to update wishlist");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/reviews", {
        mealId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review submitted!", { duration: 2000 });
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ["meal", id] });
    },
    onError: (err: AxiosError) => {
      const errorData = err?.response?.data as { message?: string };
      toast.error(errorData?.message || "Failed to submit review");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please login first", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can order");
      return;
    }
    addToCartMutation.mutate();
  };

  const handleDirectOrder = () => {
    if (!isAuthenticated) {
      toast.info("Please login first", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can order");
      return;
    }
    addToCartMutation.mutate();
    setTimeout(() => router.push("/dashboard/customer/cart"), 800);
  };

  const handleWishlist = () => {
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
      toast.info("Please login as a customer", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      return;
    }
    const willBeWishlisted = !isWishlisted;
    toggleId(id as string);
    toast.success(
      willBeWishlisted ? "Added to wishlist!" : "Removed from wishlist",
      { duration: 2000 },
    );
    wishlistMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: meal?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", { duration: 2000 });
    }
  };

  const handleReviewSubmit = () => {
    if (!isAuthenticated) {
      toast.info("Please login first", {
        style: { background: "#FF6B35", color: "#fff", border: "none" },
      });
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    reviewMutation.mutate();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-5 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-80 sm:h-96 rounded-2xl" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-16 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!meal) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-bold mb-2">Meal not found</h2>
            <Button
              onClick={() => router.push("/meals")}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl"
            >
              Browse Meals
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to meals
          </button>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Images */}
            <div className="flex flex-col gap-3">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-secondary group">
                <Image
                  src={
                    meal.images[selectedImage] ||
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700"
                  }
                  alt={meal.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                {!meal.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                    <Badge
                      variant="destructive"
                      className="text-base px-4 py-2 font-bold"
                    >
                      Currently Unavailable
                    </Badge>
                  </div>
                )}

                {/* Top Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={handleWishlist}
                    className="h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-all",
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-red-400",
                      )}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Rating pill */}
                {meal.avgRating > 0 && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-white text-sm font-bold">
                      {meal.avgRating.toFixed(1)}
                    </span>
                    <span className="text-white/60 text-xs">
                      ({meal.totalReviews})
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {meal.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {meal.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative h-16 w-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
                        selectedImage === i
                          ? "border-primary shadow-md shadow-primary/20"
                          : "border-border hover:border-primary/50",
                      )}
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
            <div className="flex flex-col gap-5">
              {/* Category + Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                  {meal.category.name}
                </Badge>
                {meal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {meal.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-3 flex-wrap">
                {meal.avgRating > 0 && (
                  <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="font-bold text-accent">
                      {meal.avgRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({meal.totalReviews} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium text-sm">
                    {meal.prepTime} min
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {meal.description}
              </p>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-primary">
                  ৳{meal.price}
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  per serving
                </span>
              </div>

              {/* Provider */}
              <Link
                href={`/providers/${meal.provider.id}`}
                className="group flex items-center gap-3 p-4 bg-secondary hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-primary/20"
              >
                <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-primary/10">
                  {meal.provider.logo ? (
                    <Image
                      src={meal.provider.logo}
                      alt={meal.provider.shopName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                    {meal.provider.shopName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {meal.provider.city}
                  </div>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 border-0 font-semibold",
                    meal.provider.isOpen
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600",
                  )}
                >
                  {meal.provider.isOpen ? "Open" : "Closed"}
                </Badge>
              </Link>

              {/* Quantity + Actions */}
              {meal.isAvailable && meal.provider.isOpen && (
                <div className="flex flex-col gap-4 pt-2">
                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="h-9 w-9 rounded-xl border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-extrabold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="h-9 w-9 rounded-xl border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-3 px-4 bg-secondary rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                    <span className="text-xl font-black text-primary">
                      ৳{(meal.price * quantity).toFixed(0)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDirectOrder}
                      disabled={addToCartMutation.isPending}
                      className="flex-1 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
                    >
                      <Zap className="h-4 w-4 shrink-0" />
                      <span>Order Now</span>
                    </Button>

                    <Button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      variant="outline"
                      className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl cursor-pointer transition-all gap-2"
                    >
                      {addToCartMutation.isPending ? (
                        <>
                          <span className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
                          <span>Adding...</span>
                        </>
                      ) : addToCartMutation.isSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 shrink-0" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </Button>

                    <button
                      onClick={handleWishlist}
                      className={cn(
                        "h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer",
                        isWishlisted
                          ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                          : "border-border hover:border-red-400 hover:text-red-400",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-all",
                          isWishlisted ? "fill-red-500 text-red-500" : "",
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-extrabold">Reviews</h2>
              {meal.totalReviews > 0 && (
                <Badge className="bg-primary/10 text-primary border-0 font-bold">
                  {meal.totalReviews}
                </Badge>
              )}
            </div>

            {/* Not ordered message */}
            {isAuthenticated && user?.role === "CUSTOMER" && !canReview && (
              <div className="bg-secondary border border-border rounded-2xl p-5 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Want to review this meal?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Order and receive this meal first to leave a review.
                  </p>
                </div>
              </div>
            )}

            {/* Review Form */}
            {isAuthenticated && user?.role === "CUSTOMER" && canReview && (
              <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex flex-col gap-4">
                <h3 className="font-bold text-sm">Write a Review</h3>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          star <= (hoveredStar || reviewRating)
                            ? "fill-accent text-accent"
                            : "text-border",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground font-medium">
                    {reviewRating === 1
                      ? "Poor"
                      : reviewRating === 2
                        ? "Fair"
                        : reviewRating === 3
                          ? "Good"
                          : reviewRating === 4
                            ? "Very Good"
                            : "Excellent"}
                  </span>
                </div>

                {/* Comment */}
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this meal..."
                  className="resize-none rounded-xl min-h-20 text-sm"
                />

                <Button
                  onClick={handleReviewSubmit}
                  disabled={reviewMutation.isPending || !reviewComment.trim()}
                  className="w-full sm:w-auto sm:self-end h-10 bg-primary hover:bg-primary-hover text-white rounded-xl cursor-pointer gap-2 font-semibold"
                >
                  {reviewMutation.isPending ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Reviews List */}
            {meal.reviews && meal.reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meal.reviews.map((review: Review) => (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {review.customer.name}
                        </p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "text-border",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.sentiment && (
                        <Badge
                          className={cn(
                            "text-xs border-0 shrink-0",
                            review.sentiment === "positive"
                              ? "bg-green-500/10 text-green-600"
                              : review.sentiment === "negative"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-gray-500/10 text-gray-600",
                          )}
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
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                <p className="font-semibold mb-1">No reviews yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to review this meal
                </p>
              </div>
            )}
          </div>

          {/* Related Meals */}
          {relatedMeals && relatedMeals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-extrabold mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {relatedMeals.slice(0, 4).map((m) => (
                  <MealCard key={m.id} meal={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
