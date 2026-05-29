import Link from "next/link";

const CATEGORIES = [
  { id: "plastic", name: "플라스틱", emoji: "🧴", href: "/category" },
  { id: "paper", name: "종이·박스", emoji: "📦", href: "/category" },
  { id: "glass", name: "유리", emoji: "🍶", href: "/category" },
  { id: "can", name: "캔·고철", emoji: "🥫", href: "/category" },
  { id: "food", name: "음식물", emoji: "🥦", href: "/category" },
  { id: "styrofoam", name: "스티로폼", emoji: "📫", href: "/category" },
];

const TIPS = [
  "플라스틱은 뚜껑을 분리하고 압착해서 버려요.",
  "종이컵은 물기를 제거한 뒤 종이류로 배출해요.",
  "음식물 쓰레기는 물기를 최대한 제거해요.",
];

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-20 bg-green-500 p-5 text-white">
          <p className="body-5 font-semibold tracking-widest uppercase opacity-80">서울 마포구</p>
          <p className="head-3 mt-1">오늘도 함께해요 🌱</p>
          <p className="body-4 mt-1 opacity-80">쓰담과 함께 올바른 분리배출 습관을 만들어봐요.</p>
        </div>

        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
            오늘의 분리배출 팁
          </p>
          <div className="flex flex-col gap-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                  {i + 1}
                </span>
                <p className="body-4 text-neutral-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
            카테고리
          </p>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={cat.href}
                className="rounded-12 flex flex-col items-center gap-2 bg-neutral-50 py-4 hover:bg-neutral-100 active:bg-neutral-100">
                <span className="text-3xl">{cat.emoji}</span>
                <span className="body-5 text-neutral-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/camera"
          className="rounded-16 flex items-center gap-4 bg-white p-4 shadow-sm hover:bg-neutral-50 active:bg-neutral-50">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-2xl">
            📷
          </div>
          <div>
            <p className="body-3 text-neutral-900">뭔지 모르겠어요</p>
            <p className="body-4 text-neutral-500">카메라로 찍으면 쓰담이 알아서 분류해줘요</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
