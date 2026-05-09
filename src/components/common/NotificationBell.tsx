"use client";

import { useEffect } from "react";
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Store,
  Star,
  Shield,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { Notification } from "@/types";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  if (type === "ORDER") return ShoppingBag;
  if (type === "REVIEW") return Star;
  if (type === "PROVIDER") return Store;
  if (type === "VERIFY" || type === "BAN") return Shield;
  return Package;
};

const getNotificationColor = (type: string, title: string) => {
  if (title.toLowerCase().includes("cancel"))
    return "bg-red-500/10 text-red-500";
  if (
    title.toLowerCase().includes("delivered") ||
    title.toLowerCase().includes("verified")
  )
    return "bg-green-500/10 text-green-500";
  if (type === "REVIEW") return "bg-yellow-500/10 text-yellow-500";
  if (type === "BAN") return "bg-orange-500/10 text-orange-500";
  return "bg-primary/10 text-primary";
};

export function NotificationBell() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data.data as NotificationItem[];
    },
    refetchInterval: 30000, // 30s এ একবার refetch
  });

  // isRead দিয়ে count করো
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Socket.io listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("meowmeal_token");
    if (!token) return;

    let socket: Socket | null = null;

    import("socket.io-client").then(({ io }) => {
      socket = io(
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
          "http://localhost:5000",
        {
          auth: { token },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
        },
      );

      socket?.on("connect", () => {
        console.log("Socket connected:", socket?.id);
        // backend এ auto-join হচ্ছে token দিয়ে
        // backup হিসেবে API থেকে userId নিয়ে join করো
        api
          .get("/users/me")
          .then((res) => {
            const userId = res.data.data.id;
            socket?.emit("join", userId);
            console.log("Joined room:", userId);
          })
          .catch(() => {});
      });

      socket?.on("notification", (data: NotificationItem) => {
        addNotification({
          ...data,
          read: data.isRead,
          createdAt: new Date(data.createdAt),
        } as Notification);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });

      socket?.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && unreadCount > 0) {
          markAllMutation.mutate();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted transition-all cursor-pointer">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-extrabold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        sideOffset={10}
        className="w-80 p-0 rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium disabled:opacity-50"
            >
              {markAllMutation.isPending ? (
                <span className="h-3 w-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-sm font-semibold">No notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You are all caught up!
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(
                notification.type,
                notification.title,
              );

              return (
                <div
                  key={notification.id || index}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors",
                    !notification.isRead
                      ? "bg-primary/5 hover:bg-primary/[0.08]"
                      : "hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      iconColor,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold leading-snug">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2.5 border-t border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center font-medium">
              {notifications.length} notification
              {notifications.length > 1 ? "s" : ""} total
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
