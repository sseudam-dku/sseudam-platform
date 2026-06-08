import Image from "next/image";

import { getCategoryImage } from "@/lib/waste-categories";
import { cn } from "@/lib/cn";

interface CategoryIconProps {
  categoryId: string;
  size?: number;
  className?: string;
}

const CategoryIcon = ({ categoryId, size = 32, className }: CategoryIconProps) => {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}>
      <Image
        src={getCategoryImage(categoryId)}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="object-contain"
        unoptimized
      />
    </span>
  );
};

export { CategoryIcon };
