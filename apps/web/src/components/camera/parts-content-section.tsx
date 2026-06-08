import type { DetectedWastePart } from "@/lib/api/camera";

interface PartsContentSectionProps {
  parts: DetectedWastePart[];
}

export function PartsContentSection({ parts }: PartsContentSectionProps) {
  return (
    <div>
      <p className="body-4 mb-3 text-neutral-900">부품 내용</p>
      {parts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {parts.map((part, partIndex) => (
            <div
              key={`${part.name}-${partIndex}`}
              className="rounded-12 flex items-center justify-between border border-neutral-100 bg-neutral-50 p-3.5">
              <span className="body-3 text-neutral-800">{part.name}</span>
              <span className="body-4 text-neutral-500">{part.typeLabel}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="body-4 text-neutral-500">분리할 부품이 없어요.</p>
      )}
    </div>
  );
}
