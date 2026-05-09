"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Upload,
  Link,
  ImageIcon,
  X,
  Clock,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { Meal, Category } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/common/ConfirmModal";

const mealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  images: z.string().min(1, "Image is required"),
  tags: z.string().optional(),
  prepTime: z.number().int().positive(),
  categoryId: z.string().min(1, "Category is required"),
});

type MealFormInput = z.infer<typeof mealSchema>;

export default function ProviderMealsPage() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [previewImage, setPreviewImage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Meal | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIX 1: useRef to read title without causing re-renders via watch()
  const titleRef = useRef<HTMLInputElement>(null);

  const { data: meals, isLoading } = useQuery({
    queryKey: ["provider-meals"],
    queryFn: async () => {
      const res = await api.get("/providers/me/profile");
      const providerId = res.data.data.id;
      const mealsRes = await api.get(`/meals/provider/${providerId}?limit=100`);
      return mealsRes.data.data as Meal[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MealFormInput>({
    resolver: zodResolver(mealSchema),
    defaultValues: { prepTime: 30 },
  });

  // FIX 1: removed watch("title") — was causing MealForm re-render on every keystroke

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data.url;
      setValue("images", url);
      setPreviewImage(url);
      toast.success("Image uploaded!", { duration: 2000 });
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("images", e.target.value);
    setPreviewImage(e.target.value);
  };

  const resetForm = () => {
    reset();
    setPreviewImage("");
    setImageMode("upload");
    setEditMeal(null);
  };

  const createMutation = useMutation({
    mutationFn: async (data: MealFormInput) => {
      await api.post("/meals", {
        ...data,
        price: Number(data.price),
        prepTime: Number(data.prepTime),
        images: [data.images],
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
    },
    onSuccess: () => {
      toast.success("Meal created!", { duration: 2000 });
      setAddOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to create meal"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MealFormInput) => {
      await api.patch(`/meals/${editMeal?.id}`, {
        ...data,
        price: Number(data.price),
        prepTime: Number(data.prepTime),
        images: [data.images],
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
    },
    onSuccess: () => {
      toast.success("Meal updated!", { duration: 2000 });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to update meal"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/${id}`);
    },
    onSuccess: () => {
      toast.success("Meal deleted!", { duration: 2000 });
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to delete meal"),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/meals/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
  });

  // FIX 1: read title from ref instead of watch() — no re-render, no focus loss
  const handleAIGenerate = async () => {
    const title = titleRef.current?.value?.trim();
    if (!title) {
      toast.error("Enter a meal title first");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post("/ai/generate-description", { title });
      const { description, tags } = res.data.data;
      setValue("description", description);
      setValue("tags", tags.join(", "));
      toast.success("AI description generated!", { duration: 2000 });
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setAiLoading(false);
    }
  };

  const openEdit = (meal: Meal) => {
    setEditMeal(meal);
    setPreviewImage(meal.images[0] || "");
    setImageMode(meal.images[0]?.startsWith("http") ? "url" : "upload");
    reset({
      title: meal.title,
      description: meal.description,
      price: meal.price,
      images: meal.images[0] || "",
      tags: meal.tags.join(", "),
      prepTime: meal.prepTime,
      categoryId: meal.categoryId,
    });
  };

  // FIX 1: MealForm extracted as a plain JSX block rendered inline (not a nested component)
  // so react-hook-form's register() keeps stable refs and focus never breaks.
  const renderMealForm = (
    onSubmit: (data: MealFormInput) => void,
    loading: boolean,
  ) => (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Meal Image</Label>
        <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setImageMode("upload")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              imageMode === "upload"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground",
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              imageMode === "url"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground",
            )}
          >
            <Link className="h-3.5 w-3.5" />
            URL
          </button>
        </div>

        {imageMode === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
              "hover:border-primary hover:bg-primary/5",
              previewImage ? "border-primary/30" : "border-border",
            )}
          >
            {previewImage ? (
              <div className="relative h-40 w-full">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage("");
                    setValue("images", "");
                  }}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {uploadLoading ? (
                  <span className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-7 w-7 text-primary" />
                  </div>
                )}
                <p className="text-sm font-medium">
                  {uploadLoading ? "Uploading..." : "Click to upload image"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadLoading}
            />
          </div>
        )}

        {imageMode === "url" && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="https://images.unsplash.com/..."
                className="pl-10 h-12 rounded-xl text-sm"
                onChange={handleUrlChange}
                defaultValue={previewImage}
              />
            </div>
            {previewImage && (
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-border">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}

        {errors.images && (
          <p className="text-xs text-destructive">{errors.images.message}</p>
        )}
      </div>

      {/* FIX 1: title input uses both register() and the titleRef via callback ref */}
      {/* FIX 2: h-12 for taller inputs */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">Meal Title</Label>
        <div className="flex gap-2">
          <Input
            {...register("title")}
            ref={(el) => {
              // merge react-hook-form ref + our titleRef
              register("title").ref(el);
              (
                titleRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = el;
            }}
            placeholder="e.g. Chicken Biryani"
            className={cn(
              "h-12 rounded-xl flex-1 text-sm",
              errors.title ? "border-destructive" : "",
            )}
          />
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="flex items-center gap-1.5 h-12 px-4 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "..." : "AI"}
          </button>
        </div>
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Describe your meal in detail..."
          className={cn(
            "rounded-xl min-h-[120px] resize-none text-sm",
            errors.description ? "border-destructive" : "",
          )}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price + Prep Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold">Price (৳)</Label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="250"
            className={cn(
              "h-12 rounded-xl text-sm",
              errors.price ? "border-destructive" : "",
            )}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold">Prep Time (min)</Label>
          <Input
            type="number"
            {...register("prepTime", { valueAsNumber: true })}
            placeholder="30"
            className="h-12 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">Category</Label>
        <Select
          onValueChange={(val) => setValue("categoryId", val)}
          defaultValue={editMeal?.categoryId}
        >
          <SelectTrigger
            className={cn(
              "h-12 rounded-xl text-sm",
              errors.categoryId ? "border-destructive" : "",
            )}
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="text-sm">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">
          Tags
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (comma separated)
          </span>
        </Label>
        <Input
          {...register("tags")}
          placeholder="spicy, popular, vegetarian"
          className="h-12 rounded-xl text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setAddOpen(false);
          }}
          className="flex-1 h-12 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className={cn(
            "flex-1 h-12 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
            "bg-primary hover:brightness-110 active:scale-[0.98]",
            "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
            (loading || uploadLoading) && "opacity-60 cursor-not-allowed",
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : editMeal ? (
            "Update Meal"
          ) : (
            "Create Meal"
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Meals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meals?.length
              ? `${meals.length} meals in your menu`
              : "Manage your restaurant menu"}
          </p>
        </div>
        <Dialog
          open={addOpen}
          onOpenChange={(open) => {
            setAddOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:brightness-110 active:scale-[0.98] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Meal
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Add New Meal
              </DialogTitle>
            </DialogHeader>
            {renderMealForm(
              (data) => createMutation.mutate(data),
              createMutation.isPending,
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : !meals || meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <UtensilsCrossed className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No meals yet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add your first meal to start accepting orders
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["Meal", "Category", "Price", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal) => (
                    <tr
                      key={meal.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-secondary">
                            <Image
                              src={
                                meal.images[0] ||
                                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"
                              }
                              alt={meal.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[180px]">
                              {meal.title}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Clock className="h-3 w-3" />
                              {meal.prepTime} min
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="text-xs font-semibold"
                        >
                          {meal.category.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-extrabold text-primary">
                          ৳{meal.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "text-xs border-0 font-semibold",
                            meal.isAvailable
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600",
                          )}
                        >
                          {meal.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleMutation.mutate(meal.id)}
                            title={
                              meal.isAvailable
                                ? "Mark Unavailable"
                                : "Mark Available"
                            }
                            className={cn(
                              "flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                              meal.isAvailable
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white"
                                : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white",
                            )}
                          >
                            {meal.isAvailable ? (
                              <>
                                <ToggleRight className="h-4 w-4" /> Available
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-4 w-4" /> Unavailable
                              </>
                            )}
                          </button>
                          <Dialog
                            open={editMeal?.id === meal.id}
                            onOpenChange={(open) => {
                              if (!open) resetForm();
                            }}
                          >
                            <DialogTrigger asChild>
                              <button
                                onClick={() => openEdit(meal)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-lg font-bold">
                                  Edit Meal
                                </DialogTitle>
                              </DialogHeader>
                              {renderMealForm(
                                (data) => updateMutation.mutate(data),
                                updateMutation.isPending,
                              )}
                            </DialogContent>
                          </Dialog>
                          <button
                            onClick={() => setDeleteConfirm(meal)}
                            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 hover:bg-muted/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                      <Image
                        src={
                          meal.images[0] ||
                          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"
                        }
                        alt={meal.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm truncate">
                          {meal.title}
                        </p>
                        <Badge
                          className={cn(
                            "text-[10px] border-0 shrink-0",
                            meal.isAvailable
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600",
                          )}
                        >
                          {meal.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">
                          {meal.category.name}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meal.prepTime} min
                        </span>
                        <span className="font-extrabold text-primary text-sm">
                          ৳{meal.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => toggleMutation.mutate(meal.id)}
                          className="flex-1 h-9 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {meal.isAvailable ? (
                            <>
                              <ToggleRight className="h-4 w-4 text-green-500" />{" "}
                              Disable
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4" /> Enable
                            </>
                          )}
                        </button>
                        <Dialog
                          open={editMeal?.id === meal.id}
                          onOpenChange={(open) => {
                            if (!open) resetForm();
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              onClick={() => openEdit(meal)}
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer border border-border"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-bold">
                                Edit Meal
                              </DialogTitle>
                            </DialogHeader>
                            {renderMealForm(
                              (data) => updateMutation.mutate(data),
                              updateMutation.isPending,
                            )}
                          </DialogContent>
                        </Dialog>
                        <button
                          onClick={() => setDeleteConfirm(meal)}
                          className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer border border-border"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.title}"?`}
        description="This meal will be permanently deleted from your menu. This action cannot be undone."
        confirmText="Delete Meal"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteConfirm) deleteMutation.mutate(deleteConfirm.id);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
