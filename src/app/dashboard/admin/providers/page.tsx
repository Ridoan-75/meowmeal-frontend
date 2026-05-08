"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Store, MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";
import toast from "react-hot-toast";

export default function AdminProvidersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-providers", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.set("search", search);
      const res = await api.get(`/providers?${params.toString()}`);
      return res.data as {
        data: ProviderProfile[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (providerId: string) => {
      await api.patch(`/providers/${providerId}/verify`);
    },
    onSuccess: () => {
      toast.success("Provider verified successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: () => toast.error("Failed to verify provider"),
  });

  const providers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage restaurant partners
          </p>
        </div>
        <div className="relative w-64">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search providers..."
            className="h-9"
          />
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Store className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="font-medium">No providers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Restaurant
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Location
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Meals
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Verified
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
                          {provider.logo ? (
                            <Image
                              src={provider.logo}
                              alt={provider.shopName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Store className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {provider.shopName}
                          </p>
                          {provider.phone && (
                            <p className="text-xs text-muted-foreground">
                              {provider.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {provider.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {provider._count?.meals || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs border-0 ${
                          provider.isOpen
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs border-0 ${
                          provider.isVerified
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {provider.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {!provider.isVerified && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-primary hover:bg-primary-hover text-white gap-1"
                          onClick={() => verifyMutation.mutate(provider.id)}
                          disabled={verifyMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3" />
                          Verify
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}