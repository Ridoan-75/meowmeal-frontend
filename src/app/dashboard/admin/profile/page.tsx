"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  User,
  Clock,
} from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { User as UserType } from "@/types";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.data as UserType;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileInput) => {
      await api.patch("/users/me", data);
    },
    onSuccess: () => {
      toast.success("Profile updated!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Cloudinary
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data?.data?.url;
      if (!url) throw new Error("No URL returned");

      setAvatarPreview(url);

      // Update profile — separate try/catch
      try {
        await api.patch("/users/me", { image: url });
        toast.success("Profile photo updated!", { duration: 2000 });
        queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      } catch (patchErr: unknown) {
        const error = patchErr as AxiosError;
        console.error("Patch error:", error?.response?.data);
        toast.error("Photo uploaded but profile update failed");
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Upload error:", error?.response?.data);
      toast.error("Failed to upload photo");
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Cover Banner */}
        <div className="relative h-28 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-5">
            {/* Avatar */}
            <div className="relative w-fit">
              <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                <AvatarImage src={avatarPreview || profile?.image || ""} />
                <AvatarFallback className="bg-primary text-white text-2xl font-black">
                  {profile?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary hover:brightness-110 text-white flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95"
              >
                {uploadLoading ? (
                  <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Badge */}
            <Badge className="w-fit bg-purple-500/10 text-purple-600 border-0 font-bold px-3 py-1 text-xs flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              ADMIN
            </Badge>
          </div>

          {/* Name + Email */}
          <div className="flex flex-col gap-1 mb-5">
            <h2 className="text-xl font-extrabold">{profile?.name}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2">
            {profile?.phone && (
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
                <Phone className="h-3 w-3" />
                {profile.phone}
              </div>
            )}
            {profile?.city && (
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {profile.city}
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              Joined {new Date(profile?.createdAt || "").toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 lg:p-7 overflow-hidden">
        <div className="flex items-start gap-3 mb-6 pb-5 border-b border-border">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base">
              Personal Information
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Update your profile details
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Full Name</Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  {...register("name")}
                  placeholder="Enter your full name"
                  className={cn(
                    "h-11 rounded-2xl border-border/60 pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    errors.name && "border-destructive",
                  )}
                />
              </div>

              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Email Address</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  value={profile?.email}
                  disabled
                  className="h-11 rounded-2xl border-border/60 pl-10 opacity-70 cursor-not-allowed"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone Number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  {...register("phone")}
                  placeholder="+880 1700-000000"
                  className="h-11 rounded-2xl border-border/60 pl-10 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">City</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  {...register("city")}
                  placeholder="Dhaka"
                  className="h-11 rounded-2xl border-border/60 pl-10 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 lg:col-span-2">
              <Label className="text-sm font-semibold">Full Address</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />

                <textarea
                  {...register("address")}
                  rows={4}
                  placeholder="House number, road, area, district..."
                  className={cn(
                    "flex min-h-[120px] w-full rounded-2xl border border-border/60 bg-background px-10 py-3 text-sm outline-none transition-all resize-none",
                    "placeholder:text-muted-foreground",
                    "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-5 border-t border-border">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={cn(
                "w-full sm:w-auto h-11 px-6 rounded-2xl",
                "flex items-center justify-center gap-2",
                "bg-primary text-white text-sm font-semibold",
                "shadow-[0_2px_10px_rgba(0,0,0,0.15)]",
                "transition-all hover:brightness-110 active:scale-[0.98]",
                updateMutation.isPending && "opacity-60 cursor-not-allowed",
              )}
            >
              {updateMutation.isPending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
