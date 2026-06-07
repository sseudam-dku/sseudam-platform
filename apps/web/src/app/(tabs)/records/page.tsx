"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import GoogleAuthButton from "@/components/auth/google-auth-button";
import { DisposalGuideSection } from "@/components/camera/disposal-guide-section";
import { CategoryIcon } from "@/components/ui/category-icon";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { fetchRecords, type DisposalRecord } from "@/lib/api/records";
import { fetchUserStats, type UserStats } from "@/lib/api/users";
import { fetchCategoryDetail, type WasteCategoryDetail } from "@/lib/api/waste-sorting";
import { buildDisposalGuideSteps } from "@/lib/disposal-guide";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useLocationStore } from "@/lib/store/use-location-store";

const Page = () => {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { city, district, isHydrated } = useLocationStore();
  const [records, setRecords] = useState<DisposalRecord[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [guidesByCategoryId, setGuidesByCategoryId] = useState<
    Record<string, WasteCategoryDetail | null>
  >({});
  const [loadingGuideId, setLoadingGuideId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    void Promise.all([fetchRecords(), fetchUserStats()])
      .then(([recordsData, statsData]) => {
        if (!cancelled) {
          setRecords(recordsData);
          setStats(statsData);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecords([]);
          setStats(null);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  async function handleToggleGuide(record: DisposalRecord) {
    if (expandedRecordId === record.id) {
      setExpandedRecordId(null);
      return;
    }
    setExpandedRecordId(record.id);
    if (guidesByCategoryId[record.categoryId] !== undefined) {
      return;
    }
    setLoadingGuideId(record.id);
    try {
      const guide = await fetchCategoryDetail(
        record.categoryId,
        isHydrated ? city : "서울",
        isHydrated ? district : "중구",
      );
      setGuidesByCategoryId(prev => ({ ...prev, [record.categoryId]: guide }));
    } catch {
      setGuidesByCategoryId(prev => ({ ...prev, [record.categoryId]: null }));
    } finally {
      setLoadingGuideId(null);
    }
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-neutral-100 p-4">
        <p className="body-3 text-neutral-600">기록을 보려면 로그인이 필요해요</p>
        <div className="w-full max-w-xs">
          <GoogleAuthButton redirectTo="/records" />
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 mb-1 tracking-widest text-neutral-400 uppercase">총 분리배출 활동</p>
          <p className="head-3 text-neutral-900">{stats?.totalRecords ?? 0}회 완료</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="body-5 px-1 tracking-widest text-neutral-400 uppercase">상세 기록 목록</p>
          {isLoading ? (
            <div className="rounded-16 flex justify-center bg-white py-10 shadow-sm">
              <LoadingAnimation />
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-16 bg-white p-6 text-center shadow-sm">
              <p className="body-4 text-neutral-500">아직 분리배출 기록이 없어요.</p>
              <Link href="/camera" className="body-5 mt-2 inline-block text-green-600 underline">
                카메라로 촬영하기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {records.map(rec => {
                const isExpanded = expandedRecordId === rec.id;
                const guide = guidesByCategoryId[rec.categoryId] ?? null;
                const guideSteps = buildDisposalGuideSteps(guide);
                return (
                  <div
                    key={rec.id}
                    className="rounded-16 border border-neutral-100 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => void handleToggleGuide(rec)}
                      className="flex w-full cursor-pointer items-center justify-between p-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-green-50">
                          <CategoryIcon categoryId={rec.categoryId} size={32} />
                        </div>
                        <div>
                          <p className="body-3 text-neutral-900">{rec.name}</p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="body-5 rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600">
                              {rec.category}
                            </span>
                            <span className="body-5 text-neutral-400">{rec.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="body-3 text-green-500">+{rec.points}P</span>
                        <p className="body-5 mt-0.5 text-neutral-400">
                          {rec.status === "success" ? "인증 완료" : "인증 실패"}
                        </p>
                      </div>
                    </button>
                    {isExpanded ? (
                      <div className="border-t border-neutral-100 px-4 pt-2 pb-4">
                        <DisposalGuideSection
                          steps={guideSteps}
                          isLoading={loadingGuideId === rec.id}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
