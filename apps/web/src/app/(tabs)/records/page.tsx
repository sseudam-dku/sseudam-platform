"use client";

import Link from "next/link";
import { useState } from "react";

import GoogleAuthButton from "@/components/auth/google-auth-button";
import { DisposalGuideSection } from "@/components/camera/disposal-guide-section";
import { CategoryIcon } from "@/components/ui/category-icon";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { DisposalRecord } from "@/lib/api/records";
import { buildDisposalGuideSteps } from "@/lib/disposal-guide";
import { useRecords, useUserStats, useWasteGuide } from "@/lib/query/hooks";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useLocationStore } from "@/lib/store/use-location-store";

function RecordGuideSection({
  categoryId,
  city,
  district,
}: {
  categoryId: string;
  city: string;
  district: string;
}) {
  const { data: guide, isLoading } = useWasteGuide(categoryId, city, district);
  return (
    <DisposalGuideSection
      steps={buildDisposalGuideSteps(guide ?? null, categoryId)}
      isLoading={isLoading}
    />
  );
}

const Page = () => {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { city, district, isHydrated } = useLocationStore();
  const { data: records = [], isLoading } = useRecords(isLoggedIn);
  const { data: stats } = useUserStats(isLoggedIn);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const resolvedCity = isHydrated ? city : "서울";
  const resolvedDistrict = isHydrated ? district : "중구";

  function handleToggleGuide(record: DisposalRecord) {
    setExpandedRecordId(expandedRecordId === record.id ? null : record.id);
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
                return (
                  <div
                    key={rec.id}
                    className="rounded-16 border border-neutral-100 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleToggleGuide(rec)}
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
                        <RecordGuideSection
                          categoryId={rec.categoryId}
                          city={resolvedCity}
                          district={resolvedDistrict}
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
