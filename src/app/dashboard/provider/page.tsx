"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

interface OrderItem {
  id: string;
  quantity: number;
  meal: {
    title: string;
  };
}

interface Order {
  id: string;
  customer: {
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
}

const statusColor: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-yellow-500/10 text-yellow-600",
  READY: "bg-purple-500/10 text-purple-600",
  DELIVERED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

export default function ProviderDashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: async () => {
      const res = await api.get("/providers/me/dashboard");
      return res.data.data;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your restaurant performance overview
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
            title="Total Meals"
            value={stats?.totalMeals || 0}
            icon={UtensilsCrossed}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={ShoppingBag}
            color="blue"
          />
          <StatsCard
            title="Total Revenue"
            value={`৳${stats?.totalRevenue || 0}`}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="This Month"
            value={`৳${stats?.monthlyRevenue?.[stats?.monthlyRevenue?.length - 1]?.revenue || 0}`}
            icon={TrendingUp}
            color="yellow"
          />
        </div>
      )}

      {/* Revenue Chart */}
      {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-6">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#FF6B35"
                radius={[6, 6, 0, 0]}
                name="Revenue (৳)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/dashboard/provider/orders">
            <Button variant="ghost" size="sm" className="text-primary">
              View all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="font-medium mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers start ordering
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
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: Order) => (
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
                      <span className="text-sm">{order.customer.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((item: OrderItem) => (
                          <p key={item.id} className="text-xs text-muted-foreground">
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