"use client";

import { CustomSelect } from "@/components/common/CustomSelect";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import {
  Search,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import api from "@/lib/axios";
import { Meal, Category } from "@/types";
import { cn } from "@/lib/utils";

interface MealsResponse {
  meals: Meal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MealsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(
      (window as Window & { __mealSearch?: ReturnType<typeof setTimeout> })
        .__mealSearch,
    );
    (
      window as Window & { __mealSearch?: ReturnType<typeof setTimeout> }
    ).__mealSearch = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 500);
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  const { data, isLoading } = useQuery<MealsResponse>({
    queryKey: ["meals-page", debouncedSearch, selectedCategory, sortBy, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder: "desc",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (selectedCategory) params.set("categoryId", selectedCategory);
      const res = await api.get(`/meals?${params.toString()}`);
      const raw = res.data.data;
      return {
        meals: (Array.isArray(raw)
          ? raw
          : ((raw as { meals?: Meal[] })?.meals ?? [])) as Meal[],
        meta: res.data.meta,
      };
    },
  });

  const meals = data?.meals ?? [];
  const meta = data?.meta;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Our Menu
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Browse All Meals
            </h1>
            <p className="text-muted-foreground mt-2">
              {meta?.total
                ? `${meta.total} meals available`
                : "Discover delicious meals"}
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search meals..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-all"
              />
            </div>
            <CustomSelect
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
              options={[
                { value: "createdAt", label: "Newest First" },
                { value: "price", label: "Price: Low to High" },
                { value: "prepTime", label: "Prep Time" },
              ]}
              icon={<SlidersHorizontal className="h-4 w-4" />}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => {
                setSelectedCategory("");
                setPage(1);
              }}
              className={cn(
                "h-9 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                !selectedCategory
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "border border-border hover:bg-muted",
              )}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={cn(
                  "h-9 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "border border-border hover:bg-muted",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Meals Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-lg font-bold">No meals found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Try a different search or category
                </p>
              </div>
              {(search || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    setSelectedCategory("");
                    setPage(1);
                  }}
                  className="h-9 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-10">
              <p className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === meta.totalPages ||
                      Math.abs(p - page) <= 1,
                  )
                  .map((p, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span
                          key={`dot-${p}`}
                          className="text-muted-foreground px-1"
                        >
                          ...
                        </span>
                      )}
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-9 w-9 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                          page === p
                            ? "bg-primary text-white shadow-sm shadow-primary/25"
                            : "border border-border hover:bg-muted",
                        )}
                      >
                        {p}
                      </button>
                    </>
                  ))}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={page === meta.totalPages}
                  className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
