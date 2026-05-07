"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, ToggleLeft, ToggleRight } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const providerProfileSchema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().optional(),
});

type ProviderProfileInput = z.infer<typeof providerProfileSchema>;

export default function ProviderProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await api.get("/providers/me/profile");
      return res.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderProfileInput>({
    resolver: zodResolver(providerProfileSchema),
    values: {
      shopName: profile?.shopName || "",
      description: profile?.description || "",
      logo: profile?.logo || "",
      coverImage: profile?.coverImage || "",
      address: profile?.address || "",
      city: profile?.city || "",
      phone: profile?.phone || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProviderProfileInput) => {
      if (profile) {
        await api.patch("/providers/me/profile", data);
      } else {
        await api.post("/providers/me/profile", data);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/providers/me/toggle-status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your restaurant information
          </p>
        </div>
        {profile && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {profile.isOpen ? "Open" : "Closed"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMutation.mutate()}
              className={profile.isOpen ? "text-green-500" : "text-red-500"}
            >
              {profile.isOpen ? (
                <ToggleRight className="h-6 w-6" />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {/* Shop Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">
              {profile?.shopName || "Your Restaurant"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {profile?.isVerified ? (
                <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/10 text-yellow-600 border-0 text-xs">
                  Pending Verification
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Shop Name</Label>
              <Input
                {...register("shopName")}
                className={errors.shopName ? "border-destructive" : ""}
              />
              {errors.shopName && (
                <p className="text-xs text-destructive">
                  {errors.shopName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+880 1700-000000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>City</Label>
              <Input
                {...register("city")}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Address</Label>
              <Input
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Tell customers about your restaurant..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Logo URL</Label>
            <Input
              {...register("logo")}
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Cover Image URL</Label>
            <Input
              {...register("coverImage")}
              placeholder="https://..."
            />
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-fit bg-primary hover:bg-primary-hover text-white mt-2"
          >
            {updateMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}