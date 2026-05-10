"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSession } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (session?.session?.token) {
      localStorage.setItem("meowmeal_token", session.session.token);
    }

    if (!user) return;

    if (user.role === "ADMIN") {
      window.location.assign("/dashboard/admin");
    } else if (user.role === "PROVIDER") {
      window.location.assign("/dashboard/provider");
    } else {
      window.location.assign("/dashboard/customer");
    }
  }, [user, isLoading, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Signing you in...</p>
      </div>
    </div>
  );
}