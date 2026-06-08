import { LoadingAnimation } from "@/components/ui/loading-animation";

interface DisposalGuideSectionProps {
  steps: string[];
  isLoading?: boolean;
}

export function DisposalGuideSection({ steps, isLoading = false }: DisposalGuideSectionProps) {
  return (
    <div>
      <p className="head-5 mb-3 text-neutral-900">분리 배출 가이드</p>
      <div className="rounded-16 flex flex-col gap-3 bg-neutral-100 p-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <LoadingAnimation />
          </div>
        ) : (
          steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="body-5 shrink-0 rounded bg-neutral-700 px-2 py-0.5 text-white">
                step{index + 1}
              </span>
              <p className="body-3 text-neutral-800">{step}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
