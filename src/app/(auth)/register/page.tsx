"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/lib/axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "PROVIDER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

interface AuthResponse {
  token?: string;
  session?: {
    token?: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get("role") as "CUSTOMER" | "PROVIDER" | null;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: roleFromQuery || "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      // Step 1 — Register with Better Auth
      const res = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
        return;
      }

      // Step 2 — Token save করো
      const token =
        (res.data as AuthResponse)?.token ||
        (res.data as AuthResponse)?.session?.token;

      if (token) {
        localStorage.setItem("meowmeal_token", token);
      }

      // Step 3 — PROVIDER হলে role update করার পর re-login করো
      if (data.role === "PROVIDER") {
        try {
          await api.patch("/users/me", { role: "PROVIDER" });

          // Re-login to get fresh token with updated role
          const loginRes = await signIn.email({
            email: data.email,
            password: data.password,
          });

          const newToken =
            (loginRes.data as AuthResponse)?.token ||
            (loginRes.data as AuthResponse)?.session?.token;
          if (newToken) {
            localStorage.setItem("meowmeal_token", newToken);
          }
        } catch (err) {
          console.error("Role update or re-login failed:", err);
        }
      }

      toast.success("Account created successfully!", { duration: 2000 });

      if (data.role === "PROVIDER") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/customer");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  const handleGoogleLogin = async () => {
    await signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-hover items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="text-8xl mb-6">🍔</div>
          <h2 className="text-3xl font-bold mb-3">Join MeowMeal Today</h2>
          <p className="text-white/80 max-w-sm">
            Create an account and start ordering from the best restaurants in your city.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-left max-w-xs mx-auto">
            {[
              "Order from 500+ restaurants",
              "Real-time order tracking",
              "AI-powered meal recommendations",
              "Exclusive deals and offers",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-white/90">
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image src="/logo.png" alt="MeowMeal" width={36} height={36} className="rounded-lg" />
            <span className="font-bold text-xl text-primary">meowmeal</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Join thousands of food lovers on MeowMeal
          </p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            {(["CUSTOMER", "PROVIDER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue("role", role)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  selectedRole === role
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {role === "CUSTOMER" ? "Customer" : "Restaurant Owner"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-white mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 cursor-pointer"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
              Continue with Google
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}