"use client";

import Image from "next/image";
import { Camera, MessageSquareText, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationStore } from "@/lib/store/use-location-store";

export interface TrashComponent {
  name: string;
  category: string;
}

export interface TrashAnalysisResult {
  name: string;
  category: string;
  components: TrashComponent[];
  steps: string[];
}

interface CameraResultProps {
  isSuccess: boolean;
  capturedImage: string | null;
  onReset: () => void;
  onNavigateChatbot: () => void;
  analysisResult?: TrashAnalysisResult | null;
}

const DEFAULT_DISTRICT = "마포구";

const DEFAULT_ANALYSIS_RESULT: TrashAnalysisResult = {
  name: "알루미늄 컵",
  category: "재활용 쓰레기: 캔류, 고철류",
  components: [
    { name: "컵 몸체", category: "캔류, 고철류" },
    { name: "컵 몸체", category: "캔류, 고철류" },
  ],
  steps: [
    "금속류끼리 모아서 배출하거나, 큰 고철은 대형폐기물로 신고해요.",
    "금속류끼리 모아서 배출하거나, 큰 고철은 대형폐기물로 신고해요.",
  ],
};

const CameraResult = ({
  isSuccess,
  capturedImage,
  onReset,
  onNavigateChatbot,
  analysisResult,
}: CameraResultProps) => {
  const { location } = useLocationStore();
  const district = location?.trim()
    ? location.trim().split(/\s+/).pop() || DEFAULT_DISTRICT
    : DEFAULT_DISTRICT;

  const result = analysisResult || DEFAULT_ANALYSIS_RESULT;

  if (isSuccess) {
    return (
      <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
        <div className="animate-page-enter flex flex-col gap-4 p-4 pb-8">
          {/* 촬영한 사진 */}
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

          {/* 쓰레기 이름 */}
          <div className="rounded-20 border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="body-5 mb-1 text-green-600">촬영한 쓰레기</p>
            <p className="head-3 text-neutral-900">{result.name}</p>
            <p className="body-4 mt-1.5 text-neutral-500">{result.category}</p>
          </div>

          {/* 부품 내용 */}
          <div className="rounded-20 border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="body-4 mb-3 text-neutral-900">부품 내용</p>
            <div className="flex flex-col gap-2">
              {result.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded-12 flex items-center justify-between border border-neutral-100 bg-neutral-50 p-3.5">
                  <span className="body-3 text-neutral-800">{comp.name}</span>
                  <span className="body-4 text-neutral-500">{comp.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 분리 배출 가이드 */}
          <div className="rounded-20 border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="body-4 mb-3 text-neutral-900">분리 배출 가이드</p>
            <div className="rounded-16 flex flex-col gap-4 border border-neutral-100 bg-neutral-50 p-4">
              {result.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  {idx > 0 && <div className="h-px bg-neutral-200/60" />}
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="rounded-8 body-5 bg-neutral-500 px-2 py-0.5 tracking-wider text-white uppercase">
                        step{idx + 1}
                      </span>
                    </div>
                    <p className="body-4 leading-relaxed text-neutral-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 배출 요일 정보 */}
          <div className="rounded-20 body-3 border border-neutral-100 bg-white p-4 text-center text-neutral-800 shadow-sm">
            <span className="text-green-500">{district}</span>는{" "}
            <span className="text-neutral-900">월, 화, 목, 일요일</span>에 버려요.
          </div>

          {/* 버튼 영역 */}
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
