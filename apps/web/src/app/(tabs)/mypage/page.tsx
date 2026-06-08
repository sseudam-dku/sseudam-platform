"use client";

import { ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import GoogleAuthButton from "@/components/auth/google-auth-button";
import iconPoint from "@/assets/icon-point.svg";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useUserBadges, useUserStats } from "@/lib/query/hooks";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { cn } from "@/lib/cn";

const Page = () => {
  const { user, isLoggedIn, isLoading, isInitialized, logout } = useAuthStore();
  const { data: stats } = useUserStats(isLoggedIn);
  const { data: badges = [] } = useUserBadges(isLoggedIn);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col gap-4 bg-neutral-100 p-4">
        <div className="rounded-20 flex flex-col items-center gap-4 border border-neutral-100/50 bg-white py-12 shadow-sm">
          <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100">
            <User className="size-10 text-neutral-300" />
          </div>
          <div className="text-center">
            <p className="head-4 text-neutral-900">로그인하고</p>
            <p className="body-4 mt-1 text-neutral-500">포인트와 뱃지를 모아보세요</p>
          </div>
        </div>
        <GoogleAuthButton redirectTo="/mypage" />
      </div>
    );
  }

  const earnedBadgesCount = badges.filter(b => b.earned).length;
  const totalPoints = stats?.totalPoints ?? 0;

  return (
    <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-20 flex items-center gap-4 border border-neutral-100/50 bg-white p-5 shadow-sm">
          <div className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
            {user?.avatarUrl ? (
              <ImageWithSkeleton
                src={user.avatarUrl}
                alt="프로필"
                width={56}
                height={56}
                className="size-full object-cover"
                skeletonClassName="rounded-full"
                unoptimized
              />
            ) : (
              <User className="size-7 text-neutral-400" />
            )}
          </div>
          <div>
            <p className="head-4 text-neutral-900">{user?.nickname ?? "닉네임"}</p>
            <p className="body-5 mt-0.5 text-neutral-400">{user?.email}</p>
          </div>
        </div>

        <Link
          href="/mypage/points"
          className="group rounded-20 flex items-center justify-between border border-neutral-100/50 bg-white p-5 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]">
          <div className="flex flex-col gap-1">
            <span className="body-5 tracking-wider text-neutral-400 uppercase">나의 포인트</span>
            <span className="head-2 text-neutral-900">{totalPoints} P</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={iconPoint} alt="포인트" width={32} height={32} />
            <ChevronRight className="size-5 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          href="/mypage/badges"
          className="group rounded-20 flex flex-col gap-4 border border-neutral-100/50 bg-white p-5 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="body-5 tracking-wider text-neutral-400 uppercase">나의 뱃지</span>
              <span className="body-4 text-neutral-500">획득한 뱃지 {earnedBadgesCount}개</span>
            </div>
            <ChevronRight className="size-5 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="flex justify-center gap-3">
            {badges.slice(0, 6).map(badge => (
              <ImageWithSkeleton
                key={badge.id}
                src={badge.image}
                alt={badge.name}
                title={badge.name}
                width={44}
                height={44}
                className={cn("object-contain", !badge.earned && "opacity-35 grayscale")}
                skeletonClassName="rounded-lg"
              />
            ))}
          </div>
        </Link>

        <div className="mt-2 flex justify-center py-4">
          <button
            onClick={() => void logout()}
            className="body-5 cursor-pointer text-neutral-400 underline decoration-neutral-300 transition-colors hover:text-neutral-600 active:text-neutral-600">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
