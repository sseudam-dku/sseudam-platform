interface DisposalGuideItemInput {
  name: string;
  type: string;
  categoryLabel: string;
  parts: Array<{ name: string; typeLabel: string }>;
}

export function buildDisposalGuideSystemPrompt(city: string, district: string): string {
  return `너는 한국 분리배출 안내 전문가다. JSON만 반환한다.

## 지역
- 시/도: ${city}
- 자치구: ${district}

## 규칙
- 각 품목마다 disposalGuideSteps에 실용적인 배출 단계를 한국어로 작성한다.
- 부품(parts)이 있으면 부품별 분리 방법을 반영한다.
- scheduleHint는 확실할 때만 작성하고, 불확실하면 null.
- 구체적인 배출 방법을 우선 안내한다.
- 법적 책임·벌금은 언급하지 않는다.
- JSON만 반환한다. 형식: {"scheduleHint":string|null,"guides":[{"disposalGuideSteps":string[]}]}
- guides 길이는 입력 품목 수와 같아야 한다.`;
}

export function buildDisposalGuideUserPrompt(items: DisposalGuideItemInput[]): string {
  const payload = items.map(item => ({
    name: item.name,
    type: item.type,
    categoryLabel: item.categoryLabel,
    parts: item.parts.map(part => ({
      name: part.name,
      typeLabel: part.typeLabel,
    })),
  }));
  return `아래 인식된 쓰레기에 대한 분리배출 가이드를 작성해 주세요.\n${JSON.stringify(payload)}`;
}
