"use client";

import Image from "next/image";
import { Camera, MessageSquareText, RotateCw } from "lucide-react";
import { DisposalGuideSection } from "@/components/camera/disposal-guide-section";
import { PartsContentSection } from "@/components/camera/parts-content-section";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Button } from "@/components/ui/button";
import type { DetectedWasteItem } from "@/lib/api/camera";
import { buildDisposalGuideSteps } from "@/lib/disposal-guide";
import { useWasteGuides } from "@/lib/query/hooks";

export interface TrashAnalysisResult {
  detectedItems: DetectedWasteItem[];
}

interface CameraResultProps {
  isSuccess: boolean;
  capturedImage: string | null;
  city: string;
  district: string;
  onReset: () => void;
  onNavigateChatbot: () => void;
  analysisResult?: TrashAnalysisResult | null;
}

const DEFAULT_ANALYSIS_RESULT: TrashAnalysisResult = {
  detectedItems: [
    {
      type: "METAL",
      itemName: "알루미늄 캔",
      name: "알루미늄 컵",
      confidence: 0.88,
      parts: [{ name: "컵 몸체", type: "METAL", typeLabel: "금속(캔·고철)" }],
      categoryId: "can",
      categoryLabel: "금속(캔·고철)",
    },
  ],
};

const CameraResult = ({
  isSuccess,
  capturedImage,
  city,
  district,
  onReset,
  onNavigateChatbot,
  analysisResult,
}: CameraResultProps) => {
  const result = analysisResult || DEFAULT_ANALYSIS_RESULT;
  const detectedItems = result.detectedItems;
  const categoryIds = [...new Set(detectedItems.map(item => item.categoryId))];
  const guideQueries = useWasteGuides(categoryIds, city, district, isSuccess);
  const guidesByCategoryId: Record<string, (typeof guideQueries)[number]["data"]> = {};
  categoryIds.forEach((categoryId, index) => {
    guidesByCategoryId[categoryId] = guideQueries[index]?.data;
  });
  const isLoadingGuides = guideQueries.some(query => query.isLoading);

  const primaryGuide = guidesByCategoryId[detectedItems[0]?.categoryId] ?? null;
  const scheduleText =
    primaryGuide?.schedule ?? "지역별 배출 요일은 구청 홈페이지에서 확인해 주세요.";

  if (isSuccess) {
    return (
      <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
        <div className="animate-page-enter flex flex-col gap-4 p-4 pb-8">
          <div className="rounded-20 relative aspect-square w-full overflow-hidden border border-neutral-200 bg-neutral-800 shadow-md">
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt="촬영한 사진"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Camera className="size-12 text-neutral-600" />
              </div>
            )}
          </div>

          <div className="rounded-20 border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="body-5 mb-4 text-green-600">인식된 쓰레기 {detectedItems.length}개</p>
            <div className="flex flex-col gap-3 border-t border-neutral-50 pt-4">
              {detectedItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-neutral-50">
                      <CategoryIcon categoryId={item.categoryId} size={20} />
                    </div>
                    <span className="body-3 text-neutral-900">{item.name}</span>
                  </div>
                  <span className="body-5 rounded-full bg-green-50 px-2.5 py-0.5 text-green-600">
                    {item.categoryLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {detectedItems.map((item, itemIndex) => (
            <div
              key={`${item.name}-${itemIndex}`}
              className="rounded-20 flex flex-col gap-6 border border-neutral-100 bg-white p-6 shadow-sm">
              <div>
                <p className="head-2 text-neutral-900">{item.name}</p>
              </div>

              <PartsContentSection parts={item.parts} />

              <DisposalGuideSection
                steps={buildDisposalGuideSteps(guidesByCategoryId[item.categoryId] ?? null)}
                isLoading={isLoadingGuides}
              />
            </div>
          ))}

          <div className="rounded-20 body-3 border border-neutral-100 bg-white p-4 text-center text-neutral-800 shadow-sm">
            <span className="text-green-500">
              {city} {district}
            </span>{" "}
            기준 <span className="text-neutral-900">{scheduleText}</span>에 버려요.
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <Button
              variant="default"
              size="md"
              className="w-full cursor-pointer rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
              onClick={onNavigateChatbot}>
              <MessageSquareText className="mr-1.5 size-4" />더 궁금한 내용은 챗봇에게 질문하기
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full cursor-pointer rounded-full text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              onClick={onReset}>
              <RotateCw className="mr-1.5 size-4" />
              다시 촬영하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter flex flex-1 flex-col items-center justify-center gap-6 bg-neutral-100 p-4 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-rose-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="head-4 text-neutral-900">분석 실패</p>
        <p className="body-4 text-neutral-500">
          이미지를 인식하지 못했어요.
          <br />
          다시 촬영하거나 직접 입력해보세요.
        </p>
      </div>
      <div className="flex w-full max-w-xs gap-3">
        <Button
          variant="outline"
          size="md"
          className="flex-1 cursor-pointer rounded-full transition-all hover:bg-neutral-50 active:scale-[0.98]"
          onClick={onReset}>
          <RotateCw className="mr-1 size-4" />
          재촬영하기
        </Button>
        <Button
          size="md"
          className="flex-1 cursor-pointer rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
          onClick={onNavigateChatbot}>
          직접 입력하기
        </Button>
      </div>
    </div>
  );
};

export default CameraResult;
