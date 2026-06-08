import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block animate-pulse rounded-md bg-neutral-200", className)}
    />
  );
}

export { Skeleton };
