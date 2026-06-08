import { cn } from "@/lib/cn";

import { Skeleton } from "./skeleton";

type LocationTextSkeletonVariant = "header" | "banner" | "detail";

interface LocationTextSkeletonProps {
  variant?: LocationTextSkeletonVariant;
  className?: string;
}

const variantClassNames: Record<LocationTextSkeletonVariant, string> = {
  header: "h-4 w-20 bg-neutral-200",
  banner: "h-3 w-24 bg-white/30",
  detail: "h-3 w-28 bg-neutral-200",
};

function LocationTextSkeleton({ variant = "header", className }: LocationTextSkeletonProps) {
  return (
    <span className="inline-flex" role="status" aria-label="위치 불러오는 중">
      <Skeleton className={cn(variantClassNames[variant], className)} />
    </span>
  );
}

export { LocationTextSkeleton };
