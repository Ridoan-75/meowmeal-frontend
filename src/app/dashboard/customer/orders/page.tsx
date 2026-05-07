"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Order } from "@/types";
import toast from "react-hot-toast";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-yellow-500/10 text-yellow-600",
  READY: "bg-purple-500/10 text-purple-600",
  DELIVERED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

export default function CustomerOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

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
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => {
      toast.error("Failed to cancel order");
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage your orders
          </p>
        </div>

        {/* Filter */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Orders</SelectItem>
            <SelectItem value="PLACED">Placed</SelectItem>
            <SelectItem value="PREPARING">Preparing</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 border-b border-border last:border-0"
              >
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="font-medium mb-1">No orders found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {statusFilter !== "ALL"
                ? "No orders with this status"
                : "You have not placed any orders yet"}
            </p>
            <Link href="/meals">
              <Button className="bg-primary hover:bg-primary-hover text-white">
                Browse Meals
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Items
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Address
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((item) => (
                          <p
                            key={item.id}
                            className="text-xs text-muted-foreground"
                          >
                            {item.quantity}x {item.meal.title}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold">
                        ৳{order.totalAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs border-0 ${
                          statusColor[order.status]
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-muted-foreground max-w-[120px] truncate">
                        {order.deliveryAddress}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === "PLACED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => cancelMutation.mutate(order.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
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