import { LoadingAnimation } from "@/components/ui/loading-animation";
import { cn } from "@/lib/cn";

type LoadingScreenProps = {
  fullHeight?: boolean;
  className?: string;
};

export function LoadingScreen({ fullHeight = false, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-neutral-100",
        fullHeight && "min-h-dvh",
        className,
      )}>
      <LoadingAnimation />
    </div>
  );
}
