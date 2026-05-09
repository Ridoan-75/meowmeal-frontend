"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { toast } from "sonner";
import { User } from "@/types";
import {
  Camera,
  Save,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const queryClient = useQueryClient();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.data as User;
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data.url;
      await api.patch("/users/me", { image: url });
      toast.success("Photo updated!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setAvatarUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" />

        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end justify-between gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.image || ""} />
                <AvatarFallback className="bg-primary text-white text-2xl font-extrabold">
                  {profile?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {avatarUploading ? (
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            {/* Role Badge */}
            <div className="pb-1">
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-semibold">
                <UserIcon className="h-3 w-3" />
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-lg font-extrabold">{profile?.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />{profile?.email}
              </span>
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />{profile.phone}
                </span>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{profile.city}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">Edit Information</p>
            <p className="text-xs text-muted-foreground">Update your personal details</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Full Name</Label>
              <Input
                {...register("name")}
                placeholder="John Doe"
                className={cn("h-11 rounded-xl", errors.name ? "border-destructive" : "")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={profile?.email}
                  disabled
                  className="h-11 rounded-xl pl-10 opacity-60"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("phone")}
                  placeholder="+880 1700-000000"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("city")}
                  placeholder="Dhaka"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-semibold">Delivery Address</Label>
            <Input
              {...register("address")}
              placeholder="Enter your default delivery address"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2 border-t border-border">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={cn(
                "flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
                "bg-primary hover:brightness-110 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                updateMutation.isPending && "opacity-60 cursor-not-allowed"
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