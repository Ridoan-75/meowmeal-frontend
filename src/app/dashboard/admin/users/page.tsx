"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldOff,
  Users,
  Mail,
} from "lucide-react";
import api from "@/lib/axios";
import { User } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/common/ConfirmModal";

const roleConfig: Record<string, { color: string; label: string }> = {
  ADMIN: { color: "bg-purple-500/10 text-purple-600", label: "Admin" },
  PROVIDER: { color: "bg-blue-500/10 text-blue-600", label: "Provider" },
  CUSTOMER: { color: "bg-green-500/10 text-green-600", label: "Customer" },
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<Record<string, string>>({});
  const [suspendConfirm, setSuspendConfirm] = useState<User | null>(null);

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

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter, page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await api.get(`/users/users?${params.toString()}`);
      return res.data as {
        data: User[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoadingIds((prev) => ({ ...prev, [id]: "status" }));
      const res = await api.patch(`/users/users/${id}/status`);
      return { id, data: res.data.data };
    },
    onSuccess: ({ id }) => {
      toast.success("User status updated!", { duration: 2000 });
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (_, id) => {
      toast.error("Failed to update user status");
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    },
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const roles = ["ALL", "CUSTOMER", "PROVIDER", "ADMIN"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total
              ? `${meta.total} total users`
              : "Manage platform users"}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setRoleFilter(role);
              setPage(1);
            }}
            className={cn(
              "h-8 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              roleFilter === role
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "border border-border hover:bg-muted hover:border-primary/30",
            )}
          >
            {role === "ALL"
              ? "All Users"
              : role.charAt(0) + role.slice(1).toLowerCase() + "s"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Users className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No users found</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Try a different filter
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {[
                    "User",
                    "Role",
                    "Location",
                    "Status",
                    "Joined",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isStatusLoading = loadingIds[user.id] === "status";

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[150px]">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "text-xs border-0 font-semibold",
                            roleConfig[user.role]?.color,
                          )}
                        >
                          {roleConfig[user.role]?.label || user.role}
                        </Badge>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {user.city || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "text-xs border-0 font-semibold",
                            user.isActive
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600",
                          )}
                        >
                          {user.isActive ? "Active" : "Suspended"}
                        </Badge>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {user.role !== "ADMIN" && (
                          <div className="flex items-center gap-1.5">
                            {/* Email */}
                            <a
                              href={`mailto:${user.email}`}
                              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
                              title="Send Email"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>

                            {/* Suspend / Activate */}
                            <button
                              onClick={() => {
                                if (user.isActive) {
                                  setSuspendConfirm(user);
                                } else {
                                  toggleStatusMutation.mutate(user.id);
                                }
                              }}
                              disabled={isStatusLoading}
                              className={cn(
                                "h-8 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50",
                                user.isActive
                                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                  : "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white",
                              )}
                            >
                              {isStatusLoading ? (
                                <span className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                              ) : user.isActive ? (
                                <ShieldOff className="h-3.5 w-3.5" />
                              ) : (
                                <Shield className="h-3.5 w-3.5" />
                              )}
                              {user.isActive ? "Suspend" : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
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
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Suspend Confirm Modal */}
      <ConfirmModal
        open={!!suspendConfirm}
        title={`Suspend "${suspendConfirm?.name}"?`}
        description="This user will lose access to their account immediately. You can reactivate them at any time."
        confirmText="Suspend User"
        variant="warning"
        loading={loadingIds[suspendConfirm?.id || ""] === "status"}
        onConfirm={() => {
          if (suspendConfirm) {
            toggleStatusMutation.mutate(suspendConfirm.id);
            setSuspendConfirm(null);
          }
        }}
        onCancel={() => setSuspendConfirm(null)}
      />
    </div>
  );
}
