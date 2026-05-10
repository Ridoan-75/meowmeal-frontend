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
  
  // Token থাকলে initially true রাখো
  const [fallbackLoading, setFallbackLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("meowmeal_token");
    }
    return false;
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      if (!isPending && !session?.user) {
        const token = localStorage.getItem("meowmeal_token");
        if (token) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const data = await response.json();
            if (isMounted && data?.data?.id) {
              setFallbackUser(data.data);
            }
          } catch (error) {
            // Handle error silently
          } finally {
            if (isMounted) {
              setFallbackLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setFallbackLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setFallbackLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
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