"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Order } from "@/types";
import { toast } from "sonner";
import {
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/common/ConfirmModal";

const statusConfig: Record<
  string,
  { color: string; label: string; step: number }
> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed", step: 1 },
  PREPARING: {
    color: "bg-yellow-500/10 text-yellow-600",
    label: "Preparing",
    step: 2,
  },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready", step: 3 },
  DELIVERED: {
    color: "bg-green-500/10 text-green-600",
    label: "Delivered",
    step: 4,
  },
  CANCELLED: {
    color: "bg-red-500/10 text-red-600",
    label: "Cancelled",
    step: 0,
  },
};

const steps = ["PLACED", "PREPARING", "READY", "DELIVERED"];

export default function CustomerOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await api.get(`/orders/my-orders?${params.toString()}`);
      return res.data as {
        data: Order[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await api.patch(`/orders/${orderId}/cancel`);
      return orderId;
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully", { duration: 2000 });
      setCancelConfirm(null);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => toast.error("Failed to cancel order"),
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
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total
              ? `${meta.total} total orders`
              : "Track and manage your orders"}
          </p>
        </div>
        <Link
          href="/meals"
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer w-fit"
        >
          Order Again
          <ArrowRight className="h-4 w-4" />
        </Link>
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
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No orders found</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {statusFilter !== "ALL"
                  ? "No orders with this status"
                  : "You haven't placed any orders yet"}
              </p>
            </div>
            <Link
              href="/meals"
              className="flex items-center gap-2 h-9 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Browse Meals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const currentStep = statusConfig[order.status]?.step || 0;
              const isCancelled = order.status === "CANCELLED";

              return (
                <div
                  key={order.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  {/* Order Row */}
                  <div
                    className="flex items-center gap-4 px-4 sm:px-6 py-4 flex-wrap cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                  >
                    {/* Order ID + Date */}
                    <div className="flex flex-col min-w-[100px]">
                      <span className="text-sm font-mono font-bold text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Items count */}
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-sm font-medium">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {order.items.map((i) => i.meal.title).join(", ")}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground max-w-[140px]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>

                    {/* Total */}
                    <span className="text-sm font-extrabold text-primary">
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

                    {/* Cancel */}
                    {order.status === "PLACED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelConfirm(order.id);
                        }}
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    )}

                    {/* Expand */}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-5 flex flex-col gap-4">
                      {/* Progress */}
                      {!isCancelled && (
                        <div className="flex items-center gap-0">
                          {steps.map((step, i) => {
                            const done = currentStep > i;
                            const active = currentStep === i + 1;
                            return (
                              <div
                                key={step}
                                className="flex items-center flex-1 last:flex-none"
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    className={cn(
                                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                      done || active
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground",
                                    )}
                                  >
                                    {done ? "✓" : i + 1}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[10px] font-medium whitespace-nowrap",
                                      active
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {statusConfig[step]?.label}
                                  </span>
                                </div>
                                {i < steps.length - 1 && (
                                  <div
                                    className={cn(
                                      "flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all",
                                      done ? "bg-primary" : "bg-border",
                                    )}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Items */}
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
                        <div className="border-t border-border mt-1 pt-2 flex justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Total
                          </span>
                          <span className="text-sm font-extrabold text-primary">
                            ৳{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>
                          {order.deliveryAddress}, {order.deliveryCity}
                        </span>
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

      {/* Cancel Confirm */}
      <ConfirmModal
        open={!!cancelConfirm}
        title="Cancel this order?"
        description="Your order will be cancelled and the restaurant will be notified. This action cannot be undone."
        confirmText="Cancel Order"
        variant="warning"
        loading={cancelMutation.isPending}
        onConfirm={() => {
          if (cancelConfirm) cancelMutation.mutate(cancelConfirm);
        }}
        onCancel={() => setCancelConfirm(null)}
      />
    </div>
  );
}
