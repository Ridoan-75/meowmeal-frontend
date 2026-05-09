"use client";

import { CustomSelect } from "@/components/common/CustomSelect";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Package, ChevronDown } from "lucide-react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProviderOrderItem {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: { id: string; title: string; images: string[] };
}

interface ProviderOrder extends Order {
  customer: { id: string; name: string };
  items: ProviderOrderItem[];
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

const nextStatus: Record<string, string> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

const nextStatusLabel: Record<string, string> = {
  PLACED: "Accept Order",
  PREPARING: "Mark Ready",
  READY: "Mark Delivered",
};

const nextStatusColor: Record<string, string> = {
  PLACED: "bg-yellow-500 hover:brightness-110 text-white",
  PREPARING: "bg-purple-500 hover:brightness-110 text-white",
  READY: "bg-green-500 hover:brightness-110 text-white",
};

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["provider-orders", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await api.get(`/orders/provider-orders?${params.toString()}`);
      return res.data as {
        data: ProviderOrder[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      setLoadingIds((prev) => ({ ...prev, [orderId]: true }));
      await api.patch(`/orders/${orderId}/status`, { status });
      return orderId;
    },
    onSuccess: (orderId) => {
      toast.success("Order status updated!", { duration: 2000 });
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[orderId];
        return n;
      });
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
    onError: (_, { orderId }) => {
      toast.error("Failed to update order status");
      setLoadingIds((prev) => {
        const n = { ...prev };
        delete n[orderId];
        return n;
      });
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta;
  const statuses = [
    "ALL",
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total
              ? `${meta.total} total orders`
              : "Manage incoming orders"}
          </p>
        </div>

        {/* Status Filter */}
        <CustomSelect
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          options={statuses.map((s) => ({
            value: s,
            label: s === "ALL" ? "All Orders" : statusConfig[s]?.label || s,
          }))}
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={cn(
              "h-8 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              statusFilter === s
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "border border-border hover:bg-muted",
            )}
          >
            {s === "ALL" ? "All" : statusConfig[s]?.label || s}
            {s !== "ALL" && (
              <span className="ml-1.5 opacity-60">
                {orders.filter((o) => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Package className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No orders found</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Orders will appear here when customers place them
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const isLoading = loadingIds[order.id];

              return (
                <div
                  key={order.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  {/* Order Row */}
                  <div className="flex items-center gap-4 px-4 sm:px-6 py-4 flex-wrap">
                    {/* Order ID + Date */}
                    <div className="flex flex-col min-w-25">
                      <span className="text-sm font-mono font-bold text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2 flex-1 min-w-30">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {order.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium truncate">
                        {order.customer.name}
                      </span>
                    </div>

                    {/* Items Count */}
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span>
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>

                    {/* Total */}
                    <span className="text-sm font-extrabold text-primary min-w-15">
                      ৳{order.totalAmount}
                    </span>

                    {/* Status */}
                    <Badge
                      className={cn(
                        "text-xs border-0 font-semibold",
                        statusConfig[order.status]?.color,
                      )}
                    >
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>

                    {/* Action Button */}
                    {nextStatus[order.status] && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            orderId: order.id,
                            status: nextStatus[order.status],
                          })
                        }
                        disabled={isLoading}
                        className={cn(
                          "flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50",
                          "shadow-sm active:scale-[0.98]",
                          nextStatusColor[order.status],
                        )}
                      >
                        {isLoading ? (
                          <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {nextStatusLabel[order.status]}
                      </button>
                    )}
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-4">
                      <div className="bg-secondary rounded-2xl p-4 flex flex-col gap-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Order Items
                        </p>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                {item.quantity}x
                              </span>
                              <span className="text-sm font-medium">
                                {item.meal.title}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-primary shrink-0">
                              ৳{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Total
                          </span>
                          <span className="text-sm font-extrabold text-primary">
                            ৳{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
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
                        : "border border-border hover:bg-muted",
                    )}
                  >
                    {p}
                  </button>
                </>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
