import { CategoryIcon } from "@/components/ui/category-icon";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { LocationTextSkeleton } from "@/components/skeleton/location-text-skeleton";
import type { WasteCategoryDetail } from "@/lib/api/waste-sorting";
import { cn } from "@/lib/cn";
import type { WasteCategory } from "@/lib/waste-categories";

const formatDisposalTime = (
  start: string | null | undefined,
  end: string | null | undefined,
): string | null => {
  if (start && end) {
    return `${start} ~ ${end}`;
  }
  return start ?? end ?? null;
};

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
};

export interface CategoryDetailViewProps {
  category: WasteCategory;
  city: string;
  district: string;
  guide: WasteCategoryDetail | null;
  isLoadingGuide: boolean;
  isLocationHydrated: boolean;
  onBack: () => void;
}

export function CategoryDetailView({
  category,
  city,
  district,
  guide,
  isLoadingGuide,
  isLocationHydrated,
  onBack,
}: CategoryDetailViewProps) {
  const disposalTime = formatDisposalTime(guide?.disposalTimeStart, guide?.disposalTimeEnd);
  const hasGeneralWasteInfo =
    Boolean(guide?.generalWasteMethod) || Boolean(guide?.generalWasteSchedule);

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-3 p-4">
        <div className="rounded-20 relative flex flex-col items-center justify-center gap-2 bg-white px-5 pt-12 pb-5 text-center shadow-sm">
          <button
            type="button"
            onClick={onBack}
            className="absolute top-3 left-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200">
            <BackIcon />
          </button>
          <CategoryIcon categoryId={category.id} size={56} />
          <div>
            <p className="head-5 text-neutral-900">{category.name}</p>
            <p className="body-5 mt-0.5 text-neutral-500">
              {!isLocationHydrated ? (
                <LocationTextSkeleton variant="detail" />
              ) : (
                (guide?.displayLocation ?? (city && district ? `${city} ${district} 기준` : null))
              )}
            </p>
          </div>
        </div>

        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-3 mb-3 tracking-widest text-neutral-400 uppercase">해당 항목</p>
          <div className="flex flex-wrap gap-2">
            {category.items.map(item => (
              <span
                key={item}
                className="rounded-8 body-5 bg-neutral-100 px-3 py-1.5 text-neutral-900">
                {item}
              </span>
            ))}
          </div>
        </div>

        {isLoadingGuide ? (
          <div className="rounded-16 flex justify-center bg-white py-10 shadow-sm">
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <div className="rounded-16 bg-white p-4 shadow-sm">
              <p className="body-3 mb-2 tracking-widest text-neutral-400 uppercase">배출 방법</p>
              <p className="body-2 text-neutral-800">
                {guide?.method ?? "배출 정보를 불러올 수 없습니다."}
              </p>
            </div>

            <div className="rounded-16 bg-white p-4 shadow-sm">
              <p className="body-3 mb-2 tracking-widest text-green-600 uppercase">배출 요일</p>
              <p className="body-2 text-neutral-800">
                {guide?.schedule ?? "지역별 배출 요일은 구청 홈페이지에서 확인해 주세요."}
              </p>
              {guide?.noCollectDay ? (
                <p className="body-4 mt-2 text-neutral-500">미수거일: {guide.noCollectDay}</p>
              ) : null}
            </div>

            {guide?.disposalPlace || guide?.disposalPlaceType ? (
              <div className="rounded-16 bg-white p-4 shadow-sm">
                <p className="body-3 mb-2 tracking-widest text-neutral-400 uppercase">배출 장소</p>
                {guide.disposalPlace ? (
                  <p className="body-2 text-neutral-800">{guide.disposalPlace}</p>
                ) : null}
                {guide.disposalPlaceType ? (
                  <p className={cn("body-4 text-neutral-500", guide.disposalPlace ? "mt-1" : "")}>
                    {guide.disposalPlaceType}
                  </p>
                ) : null}
              </div>
            ) : null}

            {disposalTime ? (
              <div className="rounded-16 bg-white p-4 shadow-sm">
                <p className="body-3 mb-2 tracking-widest text-neutral-400 uppercase">배출 시간</p>
                <p className="body-2 text-neutral-800">{disposalTime}</p>
              </div>
            ) : null}

            {guide?.managementZone ? (
              <div className="rounded-16 bg-white p-4 shadow-sm">
                <p className="body-3 mb-2 tracking-widest text-neutral-400 uppercase">관리 구역</p>
                <p className="body-2 text-neutral-800">{guide.managementZone}</p>
              </div>
            ) : null}

            {hasGeneralWasteInfo ? (
              <div className="rounded-16 bg-white p-4 shadow-sm">
                <p className="body-3 mb-2 tracking-widest text-neutral-400 uppercase">일반쓰레기</p>
                {guide?.generalWasteMethod ? (
                  <p className="body-2 text-neutral-800">{guide.generalWasteMethod}</p>
                ) : null}
                {guide?.generalWasteSchedule ? (
                  <p
                    className={cn(
                      "body-4 text-neutral-500",
                      guide.generalWasteMethod ? "mt-2" : "",
                    )}>
                    배출 요일: {guide.generalWasteSchedule}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-16 bg-white p-4 shadow-sm">
              <p className="body-3 mb-2 tracking-widest text-red-500 uppercase">주의사항</p>
              <p className="body-2 text-neutral-700">
                {guide?.caution ?? "구청 홈페이지에서 세부 규정을 확인해 주세요."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
