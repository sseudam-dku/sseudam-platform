"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { useUserBadges } from "@/lib/query/hooks";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { cn } from "@/lib/cn";

const Page = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { data: badges = [] } = useUserBadges(isLoggedIn);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-100">
      <Header title="나의 뱃지" onBack={() => router.back()} />

      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto p-4">
        <div className="my-auto flex flex-wrap justify-center gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={cn(
                "rounded-20 flex min-h-48 w-[calc(50%-0.5rem)] flex-col items-center justify-between gap-3 border bg-white px-3 py-6 shadow-sm transition-all duration-200 hover:shadow-md",
                badge.earned
                  ? "border-green-100 text-neutral-900"
                  : "relative border-neutral-100 text-neutral-900",
              )}>
              <ImageWithSkeleton
                src={badge.image}
                alt={badge.name}
                width={80}
                height={80}
                className="object-contain"
                skeletonClassName="rounded-xl"
              />
              <div className="flex flex-col gap-1 text-center">
                <p className="body-4 leading-tight">{badge.name}</p>
                <p className="body-5 leading-tight break-keep text-neutral-400">
                  {badge.description}
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className="body-5 shrink-0 rounded bg-green-50 px-1.5 py-0.5 text-green-600">
                    {badge.reward}
                  </span>
                  <span className="body-5 shrink-0 text-neutral-400">
                    {badge.earned ? "획득 완료" : "미획득"}
                  </span>
                </div>
              </div>
              {!badge.earned && <div className="rounded-20 absolute inset-0 bg-white/80" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
