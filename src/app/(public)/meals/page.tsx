"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import api from "@/lib/axios";
import { Meal, Category } from "@/types";

export default function MealsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  // Meals
  const { data, isLoading } = useQuery({
    queryKey: [
      "meals",
      debouncedSearch,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryId) params.set("categoryId", categoryId);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await api.get(`/meals?${params.toString()}`);
      return res.data as {
        data: Meal[];
        meta: { total: number; totalPages: number; page: number };
      };
    },
  });

  const meals = data?.data || [];
  const meta = data?.meta;

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch || categoryId || minPrice || maxPrice;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Browse Meals
            </h1>
            <p className="text-muted-foreground">
              {meta?.total
                ? `${meta.total} meals available`
                : "Find your perfect meal"}
            </p>
          </div>

          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals, restaurants..."
                className="pl-10 h-11"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(val) => {
                const [by, order] = val.split("-");
                setSortBy(by);
                setSortOrder(order);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48 h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="title-asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              className="h-11 gap-2 shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Category
                </label>
                <Select
                  value={categoryId || "all"}
                  onValueChange={(val) => {
                    setCategoryId(val === "all" ? "" : val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Min Price (৳)
                </label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="0"
                  className="h-10"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Max Price (৳)
                </label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="1000"
                  className="h-10"
                />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {debouncedSearch && (
                <Badge variant="secondary" className="gap-1">
                  Search: {debouncedSearch}
                  <button onClick={() => setSearch("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {categoryId && (
                <Badge variant="secondary" className="gap-1">
                  {categories?.find((c) => c.id === categoryId)?.name}
                  <button onClick={() => setCategoryId("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {minPrice && (
                <Badge variant="secondary" className="gap-1">
                  Min: ৳{minPrice}
                  <button onClick={() => setMinPrice("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {maxPrice && (
                <Badge variant="secondary" className="gap-1">
                  Max: ৳{maxPrice}
                  <button onClick={() => setMaxPrice("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Meals Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold mb-2">No meals found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-primary text-primary"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === meta.totalPages ||
                      Math.abs(p - page) <= 1
                  )
                  .map((p, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span key={`dot-${p}`} className="text-muted-foreground px-1">
                          ...
                        </span>
                      )}
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={
                          page === p
                            ? "bg-primary text-white h-8 w-8 p-0"
                            : "h-8 w-8 p-0"
                        }
                      >
                        {p}
                      </Button>
                    </>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(meta.totalPages, p + 1))
                }
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}