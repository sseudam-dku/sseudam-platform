"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { Skeleton } from "@/components/skeleton/skeleton";
import { cn } from "@/lib/cn";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  skeletonClassName?: string;
}

function ImageWithSkeleton({
  alt,
  className,
  containerClassName,
  skeletonClassName,
  width,
  height,
  onLoad,
  onError,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const size =
    typeof width === "number" && typeof height === "number" ? { width, height } : undefined;

  return (
    <span className={cn("relative inline-flex shrink-0", containerClassName)} style={size}>
      {!isLoaded && <Skeleton className={cn("absolute inset-0", skeletonClassName)} />}
      <Image
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={event => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={event => {
          setIsLoaded(true);
          onError?.(event);
        }}
        {...props}
      />
    </span>
  );
}

export { ImageWithSkeleton };
