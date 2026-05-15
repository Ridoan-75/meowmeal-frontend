import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col h-full">

      {/* Image */}
      <div className="relative h-52 w-full shrink-0">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Bottom pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Category + Provider */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        {/* Price + Buttons */}
        <div className="mt-auto pt-3 border-t border-border flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-2xl" />
            <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}