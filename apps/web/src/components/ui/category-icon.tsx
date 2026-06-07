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
      <img
        src={getCategoryImage(categoryId)}
        alt=""
        decoding="async"
        draggable={false}
        className="size-full object-contain"
      />
    </span>
  );
};

export { CategoryIcon };
