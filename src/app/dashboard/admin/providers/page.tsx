"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Store,
  MapPin,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  UtensilsCrossed,
  ShieldOff,
  Shield,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminProvidersPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<ProviderProfile | null>(
    null,
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<Record<string, string>>({});
  // locally track banned state per provider id after ban/unban
  const [bannedOverride, setBannedOverride] = useState<Record<string, boolean>>(
    {},
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(
      (window as unknown as { __searchTimer?: ReturnType<typeof setTimeout> })
        .__searchTimer,
    );
    (
      window as unknown as { __searchTimer?: ReturnType<typeof setTimeout> }
    ).__searchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 500);
  };

  const { data, isLoading } = useQuery<{
    data: ProviderProfile[];
    meta: { total: number; totalPages: number };
  }>({
    queryKey: ["admin-providers", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await api.get(`/providers?${params.toString()}`);
      return res.data as {
        data: ProviderProfile[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  // bannedOverride will be cleared by mutation callbacks when queries are invalidated

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoadingIds((prev) => ({ ...prev, [id]: "verify" }));
      await api.patch(`/providers/${id}/verify`);
      return id;
    },
    onSuccess: (id) => {
      toast.success("Provider verified!", { duration: 2000 });
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: (_, id) => {
      toast.error("Failed to verify provider");
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    },
  });

  const banMutation = useMutation({
    mutationFn: async ({
      id,
      currentlyBanned,
    }: {
      id: string;
      currentlyBanned: boolean;
    }) => {
      setLoadingIds((prev) => ({ ...prev, [id]: "ban" }));
      const res = await api.patch(`/providers/${id}/ban`);
      return { id, data: res.data.data, currentlyBanned };
    },
    onSuccess: ({ id, currentlyBanned }) => {
      // toggle করো — ban ছিল তাহলে এখন unban, unban ছিল তাহলে ban
      const nowBanned = !currentlyBanned;
      setBannedOverride((prev) => ({ ...prev, [id]: nowBanned }));
      toast.success(nowBanned ? "Provider banned!" : "Provider unbanned!", {
        duration: 2000,
      });
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: (_, { id }) => {
      toast.error("Failed to update provider status");
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoadingIds((prev) => ({ ...prev, [id]: "delete" }));
      await api.delete(`/providers/${id}`);
      return id;
    },
    onSuccess: (id) => {
      toast.success("Provider deleted!", { duration: 2000 });
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: (_, id) => {
      toast.error("Failed to delete provider");
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    },
  });

  const handleDelete = (provider: ProviderProfile) => {
    setDeleteConfirm(provider);
  };

  const providers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total
              ? `${meta.total} restaurant partners`
              : "Manage restaurant partners"}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search providers..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 sm:px-6 py-4 border-b border-border">
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
              <Store className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-base">No providers found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "Restaurant",
                      "Location",
                      "Meals",
                      "Status",
                      "Verified",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider: ProviderProfile) => {
                    // override আছে কিনা দেখো, না থাকলে server data থেকে নাও
                    const isBanned =
                      provider.id in bannedOverride
                        ? bannedOverride[provider.id]
                        : (
                            provider as unknown as {
                              user?: { isActive?: boolean };
                            }
                          ).user?.isActive === false;
                    const isBanLoading = loadingIds[provider.id] === "ban";
                    const isVerifyLoading =
                      loadingIds[provider.id] === "verify";
                    const isDeleteLoading =
                      loadingIds[provider.id] === "delete";

                    return (
                      <tr
                        key={provider.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-all"
                      >
                        {/* Restaurant */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[240px]">
                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center border border-border">
                              {provider.logo ? (
                                <Image
                                  src={provider.logo}
                                  alt={provider.shopName}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Store className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold truncate">
                                {provider.shopName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {provider.phone || "No phone"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2 min-w-[180px]">
                            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {provider.city || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {provider.address || "No address"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Meals */}
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                            <UtensilsCrossed className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">
                              {provider._count?.meals || 0}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              "h-8 px-3 rounded-xl border-0 font-semibold",
                              provider.isOpen
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600",
                            )}
                          >
                            {provider.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-4">
                          {!provider.isVerified ? (
                            <button
                              onClick={() => verifyMutation.mutate(provider.id)}
                              disabled={isVerifyLoading}
                              className="h-9 px-4 rounded-xl inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold hover:brightness-110 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              {isVerifyLoading ? (
                                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                              Verify
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-600">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Verified
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <button
                              onClick={() =>
                                router.push(`/providers/${provider.id}`)
                              }
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Email */}
                            {(
                              provider as unknown as {
                                user?: { email?: string };
                              }
                            ).user?.email && (
                              <a
                                href={`mailto:${(provider as unknown as { user?: { email?: string } }).user?.email}`}
                                className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            )}

                            {/* Ban / Unban */}
                            <button
                              onClick={() =>
                                banMutation.mutate({
                                  id: provider.id,
                                  currentlyBanned: isBanned,
                                })
                              }
                              disabled={isBanLoading}
                              className={cn(
                                "h-9 px-4 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50",
                                isBanned
                                  ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white"
                                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white",
                              )}
                            >
                              {isBanLoading ? (
                                <span className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                              ) : isBanned ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <ShieldOff className="h-3.5 w-3.5" />
                              )}
                              {isBanned ? "Unban" : "Ban"}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(provider)}
                              disabled={isDeleteLoading}
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {isDeleteLoading ? (
                                <span className="h-3.5 w-3.5 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile + Tablet Cards */}
            <div className="xl:hidden divide-y divide-border">
              {providers.map((provider: ProviderProfile) => {
                const isBanned =
                  provider.id in bannedOverride
                    ? bannedOverride[provider.id]
                    : (provider as unknown as { user?: { isActive?: boolean } })
                        .user?.isActive === false;
                const isBanLoading = loadingIds[provider.id] === "ban";
                const isDeleteLoading = loadingIds[provider.id] === "delete";

                return (
                  <div
                    key={provider.id}
                    className="p-4 sm:p-5 hover:bg-muted/20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center border border-border">
                        {provider.logo ? (
                          <Image
                            src={provider.logo}
                            alt={provider.shopName}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Store className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm truncate">
                              {provider.shopName}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {provider.city || "Unknown"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              "shrink-0 rounded-xl border-0 text-[10px]",
                              provider.isOpen
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600",
                            )}
                          >
                            {provider.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1.5 text-xs font-medium">
                            <UtensilsCrossed className="h-3 w-3" />
                            {provider._count?.meals || 0} Meals
                          </div>
                          {provider.isVerified ? (
                            <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-600">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </div>
                          ) : (
                            <button
                              onClick={() => verifyMutation.mutate(provider.id)}
                              className="h-8 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:brightness-110 transition-all"
                            >
                              Verify
                            </button>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/providers/${provider.id}`)
                            }
                            className="flex-1 h-9 rounded-xl border border-border hover:bg-muted transition-all text-sm font-medium cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              banMutation.mutate({
                                id: provider.id,
                                currentlyBanned: isBanned,
                              })
                            }
                            disabled={isBanLoading}
                            className={cn(
                              "flex-1 h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2",
                              isBanned
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white"
                                : "bg-primary/10 text-primary hover:bg-primary hover:text-white",
                            )}
                          >
                            {isBanLoading ? (
                              <span className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                            ) : isBanned ? (
                              "Unban"
                            ) : (
                              "Ban"
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(provider)}
                            disabled={isDeleteLoading}
                            className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isDeleteLoading ? (
                              <span className="h-3.5 w-3.5 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1,
              )
              .map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span
                      key={`dot-${p}`}
                      className="text-muted-foreground text-sm px-1"
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
                        : "border border-border hover:bg-muted hover:border-primary/30",
                    )}
                  >
                    {p}
                  </button>
                </>
              ))}

            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.shopName}"?`}
        description="This will permanently delete the provider, all their meals, orders, and reviews. This action cannot be undone."
        confirmText="Delete Provider"
        loading={loadingIds[deleteConfirm?.id || ""] === "delete"}
        onConfirm={() => {
          if (deleteConfirm) {
            deleteMutation.mutate(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
