import type { WasteCategoryDetail } from "@/lib/api/waste-sorting";

export function buildDisposalGuideSteps(guide: WasteCategoryDetail | null): string[] {
  const steps: string[] = [];
  if (guide?.method) {
    steps.push(guide.method);
  }
  if (guide?.caution) {
    steps.push(guide.caution);
  }
  if (steps.length === 0) {
    steps.push("정확한 배출 방법은 거주 지역 구청 홈페이지에서 확인해 주세요.");
  }
  return steps;
}
