"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, UtensilsCrossed, ShoppingBag, Check } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

interface AuthResponse {
  token?: string;
  session?: { token?: string };
}

const roles = [
  { value: "CUSTOMER" as const, label: "Customer", desc: "Order food from restaurants", icon: ShoppingBag },
  { value: "PROVIDER" as const, label: "Restaurant Owner", desc: "Sell your food online", icon: UtensilsCrossed },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get("role") as "CUSTOMER" | "PROVIDER" | null;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: roleFromQuery || "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await signUp.email({ name: data.name, email: data.email, password: data.password });
      if (res.error) { toast.error(res.error.message || "Registration failed"); return; }
      const token = (res.data as AuthResponse)?.token || (res.data as AuthResponse)?.session?.token;
      if (token) localStorage.setItem("meowmeal_token", token);
      if (data.role === "PROVIDER") {
        try {
          await api.patch("/users/me", { role: "PROVIDER" });
          const loginRes = await signIn.email({ email: data.email, password: data.password });
          const newToken = (loginRes.data as AuthResponse)?.token || (loginRes.data as AuthResponse)?.session?.token;
          if (newToken) localStorage.setItem("meowmeal_token", newToken);
        } catch (err) { console.error("Role update failed:", err); }
      }
      toast.success("Account created successfully!", { duration: 2000 });
      router.push(data.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({ provider: "google", callbackURL: "https://meowmeal-frontend.vercel.app/auth/callback" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">

        {/* Card */}
        <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">

          {/* Top orange bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-3xl" />

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-7 group">
            <Image src="/logo.png" alt="MeowMeal" width={44} height={44} className="rounded-xl group-hover:scale-105 transition-transform" />
            <span className="text-primary text-xl font-black tracking-tight">MeowMeal</span>
          </Link>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Create account 🎉</h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Join thousands of food lovers on MeowMeal
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue("role", role.value)}
                  className={cn(
                    "relative flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-primary/40 bg-primary/8"
                      : "border-border bg-background hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary/15" : "bg-muted"
                  )}>
                    <role.icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                      {role.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {role.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={cn(
                  "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-colors",
                  errors.name && "border-red-500/50"
                )}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-colors",
                  errors.email && "border-red-500/50"
                )}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password row — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={cn(
                      "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 pr-10 transition-colors",
                      errors.password && "border-red-500/50"
                    )}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirm
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={cn(
                      "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 pr-10 transition-colors",
                      errors.confirmPassword && "border-red-500/50"
                    )}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer mt-1",
                "bg-primary hover:bg-primary/90 active:scale-[0.98]",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-border bg-background text-sm font-semibold text-foreground flex items-center justify-center gap-2.5 hover:bg-muted hover:border-primary/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <FaGoogle className="h-3.5 w-3.5 text-red-500" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          🍽️ Fresh food, fast delivery — MeowMeal
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RegisterForm />
    </Suspense>
  );
}