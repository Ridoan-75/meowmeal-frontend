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

interface ProviderOrderItem {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    title: string;
    images: string[];
  };
}

interface ProviderOrder extends Order {
  customer: {
    name: string;
  };
  items: ProviderOrderItem[];
}

const statusColor: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-yellow-500/10 text-yellow-600",
  READY: "bg-purple-500/10 text-purple-600",
  DELIVERED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

const nextStatus: Record<string, string> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

const nextStatusLabel: Record<string, string> = {
  PLACED: "Accept",
  PREPARING: "Mark Ready",
  READY: "Mark Delivered",
};

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["provider-orders", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await api.get(
        `/orders/provider-orders?${params.toString()}`
      );
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
      await api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage incoming orders
          </p>
        </div>
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
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-medium mb-1">No orders found</p>
            <p className="text-sm text-muted-foreground">
              Orders will appear here when customers place them
            </p>
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
                    Customer
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
                      <span className="text-sm">
                        {order.customer.name || "Customer"}
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
                        className={`text-xs border-0 ${statusColor[order.status]}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {nextStatus[order.status] && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-primary hover:bg-primary-hover text-white"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              orderId: order.id,
                              status: nextStatus[order.status],
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          {nextStatusLabel[order.status]}
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