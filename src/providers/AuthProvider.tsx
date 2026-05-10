"use client";

import { useSession } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useState, useRef } from "react";

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
  const [fallbackDone, setFallbackDone] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      queueMicrotask(() => setFallbackDone(true));
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = localStorage.getItem("meowmeal_token");
    if (!token) {
      queueMicrotask(() => setFallbackDone(true));
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.id) {
          setFallbackUser(data.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setFallbackDone(true);
      });
  }, [isPending, session]);

  const user = (session?.user as SessionUser) || fallbackUser;
  const isLoading = isPending || !fallbackDone;

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