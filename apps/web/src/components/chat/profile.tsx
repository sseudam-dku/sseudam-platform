import { User } from "lucide-react";
import { type ImgHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: {
    container: "gap-2",
    avatar: "size-8 text-xs",
    name: "body-5 text-neutral-900",
    subtitle: "body-5 text-neutral-400",
  },
  md: {
    container: "gap-3",
    avatar: "size-10 text-sm",
    name: "body-3 text-neutral-900",
    subtitle: "body-5 text-neutral-400",
  },
  lg: {
    container: "gap-3",
    avatar: "size-12 text-base",
    name: "body-1 text-neutral-900",
    subtitle: "body-4 text-neutral-400",
  },
} as const;

export interface ProfileProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  size?: keyof typeof sizeStyles;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Profile({
  name,
  subtitle,
  avatarUrl,
  size = "md",
  className,
  ...props
}: ProfileProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn("flex items-center", styles.container, className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-900",
          styles.avatar,
        )}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name} 프로필`}
            className="size-full object-cover"
            {...props}
          />
        ) : getInitials(name) ? (
          <span className="font-medium">{getInitials(name)}</span>
        ) : (
          <User className="size-4 text-neutral-400" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className={cn("truncate", styles.name)}>{name}</p>
        {subtitle ? <p className={cn("truncate", styles.subtitle)}>{subtitle}</p> : null}
      </div>
    </div>
  );
}
