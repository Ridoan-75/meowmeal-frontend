"use client";

import { CustomSelect } from "@/components/common/CustomSelect";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Package, ChevronDown } from "lucide-react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await api.get(`/orders?${params.toString()}`);
      return res.data as {
        data: Order[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <CustomSelect
        value={statusFilter}
        onChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        options={[
          { value: "ALL", label: "All Orders" },
          { value: "PLACED", label: "Placed" },
          { value: "PREPARING", label: "Preparing" },
          { value: "READY", label: "Ready" },
          { value: "DELIVERED", label: "Delivered" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
      />

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status === statusFilter ? "ALL" : status);
              setPage(1);
            }}
            className={cn(
              "flex flex-col gap-1 p-3 rounded-xl border transition-all cursor-pointer text-left",
              statusFilter === status
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
            )}
          >
            <span className="text-xs text-muted-foreground font-medium">
              {config.label}
            </span>
            <span className="text-lg font-extrabold">
              {orders.filter((o) => o.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
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
              <Package className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No orders found</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Try changing the status filter
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {order.customer?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[100px]">
                          {order.customer?.name || "Customer"}
                        </span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 max-w-[180px]">
                        {order.items.slice(0, 2).map((item) => (
                          <p
                            key={item.id}
                            className="text-xs text-muted-foreground truncate"
                          >
                            <span className="font-semibold text-foreground">
                              {item.quantity}x
                            </span>{" "}
                            {item.meal.title}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-primary font-medium">
                            +{order.items.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-primary">
                        ৳{order.totalAmount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge
                        className={cn(
                          "text-xs border-0 font-semibold",
                          statusConfig[order.status]?.color,
                        )}
                      >
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
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
    </div>
  );
}
