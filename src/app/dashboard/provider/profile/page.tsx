"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  ToggleLeft,
  ToggleRight,
  Upload,
  Link,
  ImageIcon,
  X,
  MapPin,
  Phone,
  Save,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const providerProfileSchema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  description: z.string().optional(),
  logo: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().optional(),
});

type ProviderProfileInput = z.infer<typeof providerProfileSchema>;

interface ImageUploadFieldProps {
  label: string;
  field: "logo" | "coverImage";
  mode: "upload" | "url";
  setMode: (v: "upload" | "url") => void;
  preview: string;
  setPreview: (v: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  profile?: Record<string, string>;
  setValue: (field: "logo" | "coverImage" | "shopName" | "description" | "address" | "city" | "phone", value: string) => void;
  handleImageUpload: (file: File, field: "logo" | "coverImage", setPreview: (v: string) => void, setUploading: (v: boolean) => void, ref: React.RefObject<HTMLInputElement | null>) => Promise<void>;
}

const ImageUploadField = ({
  label,
  field,
  mode,
  setMode,
  preview,
  setPreview,
  uploading,
  setUploading,
  fileRef,
  profile,
  setValue,
  handleImageUpload,
}: ImageUploadFieldProps) => (
  <div className="flex flex-col gap-3">
    <Label className="font-semibold">{label}</Label>
    <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl w-fit">
      {(["upload", "url"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
            mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          )}
        >
          {m === "upload" ? <Upload className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
          {m === "upload" ? "Upload" : "URL"}
        </button>
      ))}
    </div>

    {mode === "upload" ? (
      <div
        onClick={() => fileRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all",
          "hover:border-primary hover:bg-primary/5",
          (preview || profile?.[field]) ? "border-primary/30" : "border-border"
        )}
      >
        {(preview || profile?.[field]) ? (
          <div className="relative h-32 w-full">
            <Image
              src={(preview || profile?.[field]) as string}
              alt={label}
              fill
              className="object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(""); setValue(field, ""); }}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <span className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
            )}
            <p className="text-sm font-medium">{uploading ? "Uploading..." : "Click to upload"}</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, field, setPreview, setUploading, fileRef);
          }}
        />
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="https://..."
            className="pl-10 rounded-xl h-11"
            defaultValue={profile?.[field] || ""}
            onChange={(e) => { setValue(field, e.target.value); setPreview(e.target.value); }}
          />
        </div>
        {(preview || profile?.[field]) && (
          <div className="relative h-32 w-full rounded-xl overflow-hidden border border-border">
            <Image src={(preview || profile?.[field]) as string} alt={label} fill className="object-cover" />
          </div>
        )}
      </div>
    )}
  </div>
);

export default function ProviderProfilePage() {
  const queryClient = useQueryClient();
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");
  const [coverMode, setCoverMode] = useState<"upload" | "url">("upload");
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const logoRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

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
    setValue,
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

  const handleImageUpload = async (
    file: File,
    field: "logo" | "coverImage",
    setPreview: (v: string) => void,
    setUploading: (v: boolean) => void,
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data.url;
      setValue(field, url);
      setPreview(url);
      toast.success("Image uploaded!", { duration: 2000 });
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: ProviderProfileInput) => {
      if (profile) {
        await api.patch("/providers/me/profile", data);
      } else {
        await api.post("/providers/me/profile", data);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated!", { duration: 2000 });
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
      <div className="flex flex-col gap-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile ? "Manage your restaurant information" : "Create your restaurant profile to start accepting orders"}
          </p>
        </div>

        {profile && (
          <button
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
            className={cn(
              "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer border",
              profile.isOpen
                ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500 hover:text-white"
                : "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500 hover:text-white"
            )}
          >
            {profile.isOpen ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            {profile.isOpen ? "Open" : "Closed"}
          </button>
        )}
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="relative h-28 bg-linear-to-br from-primary/20 via-primary/10 to-accent/20">
            {profile.coverImage && (
              <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
            )}
          </div>
          <div className="px-6 pb-5 -mt-8">
            <div className="flex items-end justify-between gap-4">
              <div className="h-16 w-16 rounded-2xl border-4 border-background bg-background overflow-hidden shadow-lg">
                {profile.logo ? (
                  <Image src={profile.logo} alt={profile.shopName} width={64} height={64} className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-7 w-7 text-primary" />
                  </div>
                )}
              </div>
              <div className="pb-1 flex items-center gap-2">
                {profile.isVerified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-0 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-0">
                    Pending Verification
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-3">
              <h2 className="font-extrabold text-lg">{profile.shopName}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{profile.city}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />{profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">
              {profile ? "Edit Restaurant Info" : "Create Restaurant Profile"}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile ? "Update your restaurant details" : "Fill in your restaurant details to get started"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="flex flex-col gap-5">

          {/* Logo */}
          <ImageUploadField
            label="Restaurant Logo"
            field="logo"
            mode={logoMode}
            setMode={setLogoMode}
            preview={logoPreview}
            setPreview={setLogoPreview}
            uploading={logoUploading}
            setUploading={setLogoUploading}
            fileRef={logoRef}
            profile={profile}
            setValue={setValue}
            handleImageUpload={handleImageUpload}
          />

          {/* Cover Image */}
          <ImageUploadField
            label="Cover Image"
            field="coverImage"
            mode={coverMode}
            setMode={setCoverMode}
            preview={coverPreview}
            setPreview={setCoverPreview}
            uploading={coverUploading}
            setUploading={setCoverUploading}
            fileRef={coverRef}
            profile={profile}
            setValue={setValue}
            handleImageUpload={handleImageUpload}
          />

          {/* Shop Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Shop Name</Label>
              <Input
                {...register("shopName")}
                placeholder="e.g. Salam's Bistro"
                className={cn("h-11 rounded-xl", errors.shopName ? "border-destructive" : "")}
              />
              {errors.shopName && <p className="text-xs text-destructive">{errors.shopName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input {...register("phone")} placeholder="+880 1700-000000" className="h-11 rounded-xl pl-10" />
              </div>
            </div>
          </div>

          {/* City + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("city")}
                  placeholder="Dhaka"
                  className={cn("h-11 rounded-xl pl-10", errors.city ? "border-destructive" : "")}
                />
              </div>
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Address</Label>
              <Input
                {...register("address")}
                placeholder="123 Main Street"
                className={cn("h-11 rounded-xl", errors.address ? "border-destructive" : "")}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-semibold">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Tell customers about your restaurant..."
              className="rounded-xl min-h-25 resize-none"
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
                  {profile ? "Save Changes" : "Create Profile"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}