"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { useForm, UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { Category } from "@/types";
import toast from "react-hot-toast";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  image: z.string().url("Valid image URL is required"),
});

type CategoryInput = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryInput) => void;
  loading: boolean;
  register: UseFormRegister<CategoryInput>;
  handleSubmit: UseFormHandleSubmit<CategoryInput>;
  errors: FieldErrors<CategoryInput>;
  editCategory: Category | null;
}

function CategoryForm({
  onSubmit,
  loading,
  register,
  handleSubmit,
  errors,
  editCategory,
}: CategoryFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Name</Label>
        <Input
          {...register("name")}
          placeholder="e.g. Biryani"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Slug</Label>
        <Input
          {...register("slug")}
          placeholder="e.g. biryani"
          className={errors.slug ? "border-destructive" : ""}
        />
        {errors.slug && (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Image URL</Label>
        <Input
          {...register("image")}
          placeholder="https://images.unsplash.com/..."
          className={errors.image ? "border-destructive" : ""}
        />
        {errors.image && (
          <p className="text-xs text-destructive">{errors.image.message}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-white"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : editCategory ? (
          "Update Category"
        ) : (
          "Create Category"
        )}
      </Button>
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryInput) => {
      await api.post("/categories", data);
    },
    onSuccess: () => {
      toast.success("Category created");
      setAddOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryInput) => {
      await api.patch(`/categories/${editCategory?.id}`, data);
    },
    onSuccess: () => {
      toast.success("Category updated");
      setEditCategory(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Cannot delete category with existing meals"),
  });

  const openEdit = (category: Category) => {
    setEditCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage food categories
          </p>
        </div>
        <Dialog
          open={addOpen}
          onOpenChange={(open) => {
            setAddOpen(open);
            if (!open) reset();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={(data: CategoryInput) => createMutation.mutate(data)}
              loading={createMutation.isPending}
              register={register}
              handleSubmit={handleSubmit}
              errors={errors}
              editCategory={editCategory}
            />
          </DialogContent>
        </Dialog>
      </div>

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
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Slug
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
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
                        <p className="text-sm font-medium">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground font-mono">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {category._count?.meals || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs border-0 ${
                          category.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Dialog
                          open={editCategory?.id === category.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditCategory(null);
                              reset();
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              onClick={() => openEdit(category)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                              onSubmit={(data: CategoryInput) =>
                                updateMutation.mutate(data)
                              }
                              loading={updateMutation.isPending}
                              register={register}
                              handleSubmit={handleSubmit}
                              errors={errors}
                              editCategory={editCategory}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(category.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
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