"use client";

import { useSession } from "@/lib/auth-client";
import { createContext, useContext } from "react";
import { useSocket } from "@/hooks/useSocket";


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

  // Socket connection
  useSocket(session?.user?.id);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
