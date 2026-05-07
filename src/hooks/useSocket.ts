"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/store/notificationStore";
import { Notification } from "@/types";

let socket: Socket | null = null;

export const useSocket = (userId?: string) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    if (!userId) return;

    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      { withCredentials: true }
    );

    socket.on("connect", () => {
      socket?.emit("join", userId);
    });

    socket.on("notification", (notification: Notification) => {
      addNotification({ ...notification, read: false });
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId]);

  return socket;
};