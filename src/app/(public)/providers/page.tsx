"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Store, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Restaurants
            </h1>
            <p className="text-muted-foreground">
              {meta?.total
                ? `${meta.total} restaurants available`
                : "Find your favorite restaurant"}
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="pl-10 h-11"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <Select
              value={city || "all"}
              onValueChange={(val) => {
                setCity(val === "all" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-11">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={isOpen || "all"}
              onValueChange={(val) => {
                setIsOpen(val === "all" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Open Now</SelectItem>
                <SelectItem value="false">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Providers Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="h-32 w-full rounded-none" />
                  <div className="p-4 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full rounded-xl mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Store className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No restaurants found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-accent/20">
                    {provider.coverImage && (
                      <Image
                        src={provider.coverImage}
                        alt={provider.shopName}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute -bottom-5 left-4">
                      <div className="h-12 w-12 rounded-xl border-2 border-background bg-background overflow-hidden shadow-md">
                        {provider.logo ? (
                          <Image
                            src={provider.logo}
                            alt={provider.shopName}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          provider.isOpen
                            ? "bg-green-500 text-white border-0"
                            : "bg-red-500 text-white border-0"
                        }
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 pt-8 flex flex-col flex-1 gap-1">
                    <h3 className="font-semibold truncate">
                      {provider.shopName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {provider.city}
                    </div>
                    {provider.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {provider.description}
                      </p>
                    )}
                    {provider._count && (
                      <p className="text-xs text-muted-foreground">
                        {provider._count.meals} menu items
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-auto w-full border-primary text-primary hover:bg-primary/5 mt-3"
                      onClick={() =>
                        router.push(`/providers/${provider.id}`)
                      }
                    >
                      View Menu
                    </Button>
                  </div>
                </div>
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
              <span className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages}
              </span>
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