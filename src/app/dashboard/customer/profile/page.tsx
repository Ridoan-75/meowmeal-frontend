"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import { User } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
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
      await api.patch("/auth/me", data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.image || ""} />
            <AvatarFallback className="bg-primary text-white text-xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{profile?.name}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <span className="inline-flex text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-1">
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Full Name</Label>
              <Input
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input value={profile?.email} disabled className="opacity-60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input
                {...register("phone")}
                placeholder="+880 1700-000000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>City</Label>
              <Input {...register("city")} placeholder="Dhaka" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Delivery Address</Label>
            <Input
              {...register("address")}
              placeholder="Enter your default delivery address"
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