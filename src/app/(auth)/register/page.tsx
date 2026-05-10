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
  session?: { token?: string };
}

const roles = [
  {
    value: "CUSTOMER" as const,
    label: "Customer",
    desc: "Order food from restaurants",
    icon: ShoppingBag,
  },
  {
    value: "PROVIDER" as const,
    label: "Restaurant Owner",
    desc: "Sell your food online",
    icon: UtensilsCrossed,
  },
];

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
      const res = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
        return;
      }

      const token =
        (res.data as AuthResponse)?.token ||
        (res.data as AuthResponse)?.session?.token;

      if (token) localStorage.setItem("meowmeal_token", token);

      if (data.role === "PROVIDER") {
        try {
          await api.patch("/users/me", { role: "PROVIDER" });
          const loginRes = await signIn.email({ email: data.email, password: data.password });
          const newToken =
            (loginRes.data as AuthResponse)?.token ||
            (loginRes.data as AuthResponse)?.session?.token;
          if (newToken) localStorage.setItem("meowmeal_token", newToken);
        } catch (err) {
          console.error("Role update failed:", err);
        }
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
    await signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-orange-400/6 blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">

        {/* Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 backdrop-blur-sm shadow-2xl shadow-black/40">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center ">
            <Image src="/logo.png" alt="MeowMeal" width={100} height={100}/>
            <span className="text-white text-xl font-bold tracking-tight">MeowMeal</span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-white text-2xl font-bold">Create account</h1>
            <p className="text-zinc-500 text-sm mt-1">Join thousands of food lovers on MeowMeal</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue("role", role.value)}
                  className={cn(
                    "relative flex flex-col items-start gap-2 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                    isSelected ? "bg-orange-500/20" : "bg-zinc-800"
                  )}>
                    <role.icon className={cn("h-4 w-4", isSelected ? "text-orange-400" : "text-zinc-500")} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-semibold", isSelected ? "text-orange-400" : "text-zinc-300")}>
                      {role.label}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{role.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={cn(
                  "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 transition-colors",
                  errors.name && "border-red-500/50"
                )}
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 transition-colors",
                  errors.email && "border-red-500/50"
                )}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password row — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={cn(
                      "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 pr-9 transition-colors",
                      errors.password && "border-red-500/50"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Confirm
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={cn(
                      "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 pr-9 transition-colors",
                      errors.confirmPassword && "border-red-500/50"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer mt-1",
                "bg-orange-500 hover:bg-orange-400 active:scale-[0.98]",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-orange-500/20",
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
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-zinc-900/60 px-3 text-zinc-600">or</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-300 flex items-center justify-center gap-2.5 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <FaGoogle className="h-3.5 w-3.5 text-red-400" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-zinc-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}