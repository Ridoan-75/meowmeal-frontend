"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import toast from "react-hot-toast";

interface MealFormProps {
  onSubmit: (data: MealFormInput) => void;
  loading: boolean;
}

const mealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  images: z.string().min(1, "Image URL is required"),
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

  const { data: meals, isLoading } = useQuery({
    queryKey: ["provider-meals"],
    queryFn: async () => {
      const res = await api.get("/providers/me/profile");
      const providerId = res.data.data.id;
      const mealsRes = await api.get(
        `/meals/provider/${providerId}?limit=100`
      );
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
    watch,
    formState: { errors },
  } = useForm<MealFormInput>({
    resolver: zodResolver(mealSchema),
    defaultValues: { prepTime: 30 },
  });

  const titleValue = watch("title");

  const createMutation = useMutation({
    mutationFn: async (data: MealFormInput) => {
      await api.post("/meals", {
        ...data,
        price: Number(data.price),
        prepTime: Number(data.prepTime),
        images: [data.images],
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
    },
    onSuccess: () => {
      toast.success("Meal created successfully");
      setAddOpen(false);
      reset();
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
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
    },
    onSuccess: () => {
      toast.success("Meal updated successfully");
      setEditMeal(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to update meal"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/${id}`);
    },
    onSuccess: () => {
      toast.success("Meal deleted");
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

  const handleAIGenerate = async () => {
    if (!titleValue?.trim()) {
      toast.error("Enter a meal title first");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post("/ai/generate-description", {
        title: titleValue,
      });
      const { description, tags } = res.data.data;
      setValue("description", description);
      setValue("tags", tags.join(", "));
      toast.success("AI description generated!");
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setAiLoading(false);
    }
  };

  const openEdit = (meal: Meal) => {
    setEditMeal(meal);
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

  const MealForm = ({ onSubmit, loading }: MealFormProps) => (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Meal Title</Label>
        <div className="flex gap-2">
          <Input
            {...register("title")}
            placeholder="e.g. Chicken Biryani"
            className={errors.title ? "border-destructive" : ""}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="shrink-0 border-primary text-primary hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {aiLoading ? "..." : "AI"}
          </Button>
        </div>
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          {...register("description")}
          placeholder="Describe your meal..."
          rows={3}
          className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none ${
            errors.description ? "border-destructive" : "border-input"
          }`}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Price (৳)</Label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="250"
            className={errors.price ? "border-destructive" : ""}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Prep Time (min)</Label>
          <Input
            type="number"
            {...register("prepTime", { valueAsNumber: true })}
            placeholder="30"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Select
          onValueChange={(val) => setValue("categoryId", val)}
          defaultValue={editMeal?.categoryId}
        >
          <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
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

      <div className="flex flex-col gap-1.5">
        <Label>Image URL</Label>
        <Input
          {...register("images")}
          placeholder="https://images.unsplash.com/..."
          className={errors.images ? "border-destructive" : ""}
        />
        {errors.images && (
          <p className="text-xs text-destructive">{errors.images.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tags (comma separated)</Label>
        <Input
          {...register("tags")}
          placeholder="spicy, popular, vegetarian"
        />
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
        ) : editMeal ? (
          "Update Meal"
        ) : (
          "Create Meal"
        )}
      </Button>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Meals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your restaurant menu
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
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
            </DialogHeader>
            <MealForm
              onSubmit={(data: MealFormInput) => createMutation.mutate(data)}
              loading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Meals Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 border-b border-border last:border-0"
              >
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : !meals || meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="font-medium mb-1">No meals yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first meal to start accepting orders
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Meal
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Price
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
                {meals.map((meal) => (
                  <tr
                    key={meal.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={meal.images[0] || "/placeholder-food.jpg"}
                            alt={meal.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[160px]">
                            {meal.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {meal.prepTime} min
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {meal.category.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-primary">
                        ৳{meal.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs border-0 ${
                          meal.isAvailable
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {meal.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => toggleMutation.mutate(meal.id)}
                        >
                          {meal.isAvailable ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Dialog
                          open={editMeal?.id === meal.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditMeal(null);
                              reset();
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              onClick={() => openEdit(meal)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Meal</DialogTitle>
                            </DialogHeader>
                            <MealForm
                              onSubmit={(data: MealFormInput) =>
                                updateMutation.mutate(data)
                              }
                              loading={updateMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(meal.id)}
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