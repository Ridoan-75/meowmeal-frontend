"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    if (user.role === "ADMIN") {
      window.location.assign("/dashboard/admin");
    } else if (user.role === "PROVIDER") {
      window.location.assign("/dashboard/provider");
    } else {
      window.location.assign("/dashboard/customer");
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
