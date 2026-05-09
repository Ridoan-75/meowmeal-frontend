"use client";

import { CustomSelect } from "@/components/common/CustomSelect";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Store,
  X,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";
import { cn } from "@/lib/utils";

const cities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];

export default function ProvidersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [city, setCity] = useState("");
  const [isOpen, setIsOpen] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["providers", debouncedSearch, city, isOpen, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (city) params.set("city", city);
      if (isOpen) params.set("isOpen", isOpen);
      const res = await api.get(`/providers?${params.toString()}`);
      return res.data as {
        data: ProviderProfile[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const providers = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Explore
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Restaurants
            </h1>
            <p className="text-muted-foreground mt-2">
              {meta?.total
                ? `${meta.total} restaurants available`
                : "Find your favorite restaurant"}
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <CustomSelect
                value={city || "all"}
                onChange={(val) => {
                  setCity(val === "all" ? "" : val);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Cities" },
                  ...cities.map((c) => ({ value: c, label: c })),
                ]}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <CustomSelect
                value={isOpen || "all"}
                onChange={(val) => {
                  setIsOpen(val === "all" ? "" : val);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "true", label: "Open Now" },
                  { value: "false", label: "Closed" },
                ]}
                icon={<Store className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="h-36 w-full rounded-none" />
                  <div className="p-4 pt-8 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full rounded-xl mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
                <Store className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-lg font-bold">No restaurants found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => router.push(`/providers/${provider.id}`)}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer group"
                >
                  {/* Cover */}
                  <div className="relative h-36 w-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                    {provider.coverImage ? (
                      <Image
                        src={provider.coverImage}
                        alt={provider.shopName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={cn(
                          "border-0 font-semibold text-xs shadow-md",
                          provider.isOpen
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white",
                        )}
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>

                    {/* Logo */}
                    <div className="absolute -bottom-5 left-4">
                      <div className="h-12 w-12 rounded-xl border-2 border-background bg-background overflow-hidden shadow-lg">
                        {provider.logo ? (
                          <Image
                            src={provider.logo}
                            alt={provider.shopName}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-8 flex flex-col flex-1 gap-2">
                    <h3 className="font-extrabold text-sm truncate group-hover:text-primary transition-colors">
                      {provider.shopName}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      {provider.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          {provider.city}
                        </span>
                      )}
                      {(provider as ProviderProfile & { avgRating?: number })
                        .avgRating ? (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent shrink-0" />
                          {(
                            provider as ProviderProfile & { avgRating?: number }
                          ).avgRating?.toFixed(1)}
                        </span>
                      ) : null}
                    </div>

                    {provider.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {provider.description}
                      </p>
                    )}

                    {provider._count && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <UtensilsCrossed className="h-3 w-3" />
                        {provider._count.meals} menu items
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/providers/${provider.id}`);
                      }}
                      className={cn(
                        "mt-auto w-full h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer mt-3",
                        "border border-primary text-primary hover:bg-primary hover:text-white",
                        "active:scale-[0.98]",
                      )}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
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
