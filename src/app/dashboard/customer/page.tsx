"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/axios";
import { Order } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusColor: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-yellow-500/10 text-yellow-600",
  READY: "bg-purple-500/10 text-purple-600",
  DELIVERED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/my-orders?limit=100");
      return res.data.data as Order[];
    },
  });

  const orders = data || [];
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ["PLACED", "PREPARING", "READY"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.status === "DELIVERED"
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.status === "CANCELLED"
  ).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here is your order summary
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            color="primary"
          />
          <StatsCard
            title="Active Orders"
            value={activeOrders}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Delivered"
            value={deliveredOrders}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Cancelled"
            value={cancelledOrders}
            icon={XCircle}
            color="blue"
          />
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/dashboard/customer/orders">
            <Button variant="ghost" size="sm" className="text-primary">
              View all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border last:border-0">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="font-medium mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start ordering from our amazing restaurants
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/customer/orders`}
                        className="text-sm font-mono text-primary hover:underline"
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm truncate max-w-[160px]">
                        {order.items
                          .map((i) => i.meal.title)
                          .join(", ")}
                      </p>
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}