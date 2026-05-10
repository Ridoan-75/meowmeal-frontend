"use client";

import { useSession } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useState } from "react";

interface SessionUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
  isActive?: boolean;
}

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [fallbackUser, setFallbackUser] = useState<SessionUser | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  useEffect(() => {
    // Session না থাকলে token দিয়ে user fetch করো
    if (!isPending && !session?.user) {
      const token = localStorage.getItem("meowmeal_token");
      if (token) {
        const controller = new AbortController();

        (async () => {
          setFallbackLoading(true);
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            });
            const data = await res.json();
            if (data?.data?.id) {
              setFallbackUser(data.data);
            }
          } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Failed to fetch user:', error);
            }
          } finally {
            setFallbackLoading(false);
          }
        })();

        return () => controller.abort();
      }
    }
  }, [isPending, session]);

  const user = (session?.user as SessionUser) || fallbackUser;
  const isLoading = isPending || fallbackLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);