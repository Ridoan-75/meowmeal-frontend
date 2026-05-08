"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload, Link, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { Category } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  image: z.string().min(1, "Image is required"),
});

type CategoryInput = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryInput) => void;
  loading: boolean;
  defaultValues?: Partial<CategoryInput>;
  editCategory: Category | null;
  onClose: () => void;
}

function CategoryForm({
  onSubmit,
  loading,
  defaultValues,
  editCategory,
  onClose,
}: CategoryFormProps) {
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [previewImage, setPreviewImage] = useState<string>(
    defaultValues?.image || ""
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const nameValue = watch("name") || "";
  const previewSlug = nameValue
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
  };

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
      setValue("image", url);
      setPreviewImage(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("image", e.target.value);
    setPreviewImage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* Image Upload Section */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Category Image</Label>

        <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setImageMode("upload")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              imageMode === "upload"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              imageMode === "url"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link className="h-3.5 w-3.5" />
            Image URL
          </button>
        </div>

        {imageMode === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
              "hover:border-primary hover:bg-primary/5",
              previewImage ? "border-primary/30" : "border-border"
            )}
          >
            {previewImage ? (
              <div className="relative h-32 w-full">
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
                    setValue("image", "");
                  }}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {uploadLoading ? (
                  <span className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-primary" />
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
                className="pl-10 rounded-xl"
                onChange={handleUrlChange}
                defaultValue={defaultValues?.image || ""}
              />
            </div>
            {previewImage && (
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-border">
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

        {errors.image && (
          <p className="text-xs text-destructive">{errors.image.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">Category Name</Label>
        <Input
          {...register("name")}
          onChange={handleNameChange}
          placeholder="e.g. Beef Biryani"
          className={cn("rounded-xl", errors.name ? "border-destructive" : "")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* URL Handle — auto generated, read-only, visible */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">
          URL Handle
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (auto-generated)
          </span>
        </Label>
        <div className="flex items-center rounded-xl border border-border bg-muted/50 overflow-hidden">
          <span className="px-3 text-xs text-muted-foreground border-r border-border bg-muted h-9 flex items-center select-none">
            /category/
          </span>
          <span className="px-3 text-sm font-mono text-foreground/70 flex-1 h-9 flex items-center">
            {previewSlug || (
              <span className="text-muted-foreground/50 italic text-xs">
                will appear here...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className={cn(
            "flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
            "bg-primary hover:brightness-110 active:scale-[0.98]",
            "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
            (loading || uploadLoading) && "opacity-60 cursor-not-allowed"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : editCategory ? (
            "Update Category"
          ) : (
            "Create Category"
          )}
        </button>
      </div>
    </form>
  );
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryInput) => {
      const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await api.post("/categories", { ...data, slug });
    },
    onSuccess: () => {
      toast.success("Category created!");
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryInput) => {
      const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await api.patch(`/categories/${editCategory?.id}`, { ...data, slug });
    },
    onSuccess: () => {
      toast.success("Category updated!");
      setEditCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Cannot delete category with existing meals"),
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage food categories
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={(open) => setAddOpen(open)}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary hover:brightness-110 active:scale-[0.98] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Add New Category
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={(data) => createMutation.mutate(data)}
              loading={createMutation.isPending}
              editCategory={null}
              onClose={() => setAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden sm:table-cell">
                    URL Handle
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden sm:table-cell">
                    Meals
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-lg">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm font-medium">
                        {category._count?.meals || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={cn(
                          "text-xs border-0 font-semibold",
                          category.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        )}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <Dialog
                          open={editCategory?.id === category.id}
                          onOpenChange={(open) => {
                            if (!open) setEditCategory(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                              onClick={() => setEditCategory(category)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-bold">
                                Edit Category
                              </DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                              onSubmit={(data) => updateMutation.mutate(data)}
                              loading={updateMutation.isPending}
                              defaultValues={{
                                name: category.name,
                                image: category.image,
                              }}
                              editCategory={editCategory}
                              onClose={() => setEditCategory(null)}
                            />
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <button
                          className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer disabled:opacity-50"
                          onClick={() => deleteMutation.mutate(category.id)}
                          disabled={deleteMutation.isPending}
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
        )}
      </div>
    </div>
  );
}