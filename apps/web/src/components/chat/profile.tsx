import { User } from "lucide-react";
import { type ImgHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: {
    container: "gap-2",
    avatar: "size-8 text-xs",
    name: "text-sm font-medium",
    subtitle: "text-xs",
  },
  md: {
    container: "gap-3",
    avatar: "size-10 text-sm",
    name: "text-sm font-semibold",
    subtitle: "text-xs",
  },
  lg: {
    container: "gap-3",
    avatar: "size-12 text-base",
    name: "text-base font-semibold",
    subtitle: "text-sm",
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
          "bg-surface-muted text-foreground relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
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
          <User className="text-muted size-4" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className={cn("text-foreground truncate", styles.name)}>{name}</p>
        {subtitle ? <p className={cn("text-muted truncate", styles.subtitle)}>{subtitle}</p> : null}
      </div>
    </div>
  );
}
