"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Store,
  ShoppingBag,
  UtensilsCrossed,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "@/lib/axios";

const statusColor: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-yellow-500/10 text-yellow-600",
  READY: "bg-purple-500/10 text-purple-600",
  DELIVERED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

const PIE_COLORS = ["#3B82F6", "#FFB800", "#A855F7", "#22C55E", "#EF4444"];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform overview and analytics
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Users"
            value={stats?.overview?.totalUsers || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Restaurants"
            value={stats?.overview?.totalProviders || 0}
            icon={Store}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={stats?.overview?.totalOrders || 0}
            icon={ShoppingBag}
            color="yellow"
          />
          <StatsCard
            title="Total Meals"
            value={stats?.overview?.totalMeals || 0}
            icon={UtensilsCrossed}
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={`৳${stats?.overview?.totalRevenue || 0}`}
            icon={DollarSign}
            color="primary"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-6">Monthly Revenue</h2>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
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
          )}
        </div>

        {/* Orders by Status Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-6">Orders by Status</h2>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats?.ordersByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                >
                  {(stats?.ordersByStatus || []).map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Orders Line Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-6">Monthly Orders</h2>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.monthlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={{ fill: "#FF6B35", r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Meals */}
      {stats?.topMeals && stats.topMeals.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold">Top Selling Meals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Meal
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Restaurant
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topMeals.map((meal: any) => (
                  <tr
                    key={meal.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{meal.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {meal.provider.shopName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-primary">
                        ৳{meal.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-primary/10 text-primary border-0">
                        {meal.orderCount} orders
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-40 w-full" />
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
                {(stats?.recentOrders || []).map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
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
                        {order.items.map((item: any) => (
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