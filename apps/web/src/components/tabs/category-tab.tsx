"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

const CATEGORIES = [
  { id: "plastic", name: "플라스틱", emoji: "🧴", color: "bg-orange-50 text-orange-600" },
  { id: "paper", name: "종이·박스", emoji: "📦", color: "bg-blue-50 text-blue-600" },
  { id: "glass", name: "유리", emoji: "🍶", color: "bg-teal-50 text-teal-600" },
  { id: "can", name: "캔·고철", emoji: "🥫", color: "bg-yellow-50 text-yellow-600" },
  { id: "food", name: "음식물", emoji: "🥦", color: "bg-green-50 text-green-600" },
  { id: "styrofoam", name: "스티로폼", emoji: "📫", color: "bg-purple-50 text-purple-600" },
  { id: "clothes", name: "의류", emoji: "👕", color: "bg-pink-50 text-pink-600" },
  { id: "lamp", name: "형광등", emoji: "💡", color: "bg-amber-50 text-amber-600" },
  { id: "battery", name: "건전지", emoji: "🔋", color: "bg-red-50 text-red-600" },
];

const GUIDE: Record<string, { method: string; caution: string }> = {
  plastic: {
    method: "내용물을 깨끗이 비우고 압착한 후 뚜껑을 제거하여 플라스틱 수거함에 배출하세요.",
    caution: "이물질이 많이 묻은 경우 일반쓰레기로 배출하세요.",
  },
  paper: {
    method: "테이프·스티커를 제거한 후 묶어서 배출하거나 종이 수거함에 넣으세요.",
    caution: "음식물이 묻은 종이는 일반쓰레기로 배출하세요.",
  },
  glass: {
    method: "내용물을 비우고 깨끗이 씻은 후 유리 수거함에 배출하세요.",
    caution: "깨진 유리는 신문지에 싸서 일반쓰레기로 배출하세요.",
  },
  can: {
    method: "내용물을 비우고 가볍게 씻은 후 캔 수거함에 배출하세요.",
    caution: "부탄가스 등 압축가스 캔은 구멍을 뚫어 배출하세요.",
  },
  food: {
    method: "물기를 최대한 제거하여 음식물 전용 봉투나 수거함에 배출하세요.",
    caution: "뼈, 조개껍데기, 과일씨 등은 일반쓰레기로 배출하세요.",
  },
  styrofoam: {
    method: "내용물을 비우고 이물질을 제거한 후 스티로폼 수거함에 배출하세요.",
    caution: "색이 들어간 스티로폼은 일반쓰레기로 배출하세요.",
  },
  clothes: {
    method: "헌옷 수거함이나 의류 기증 센터에 배출하세요.",
    caution: "속옷, 양말 등 재사용이 어려운 의류는 일반쓰레기로 배출하세요.",
  },
  lamp: {
    method: "형광등 전용 수거함 또는 주민센터에 배출하세요.",
    caution: "깨진 형광등은 신문지에 감싸 형광등 수거함에 배출하세요.",
  },
  battery: {
    method: "건전지 전용 수거함(마트, 주민센터 등)에 배출하세요.",
    caution: "리튬·니카드 배터리는 별도 수거함에 배출하세요.",
  },
};

function BackIcon() {
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
}

export function CategoryTab() {
  const [selected, setSelected] = useState<string | null>(null);

  const category = CATEGORIES.find(c => c.id === selected);
  const guide = selected ? GUIDE[selected] : null;

  if (selected && category && guide) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-100">
        <div className="flex h-14 items-center gap-2 bg-white px-2 shadow-sm">
          <button
            onClick={() => setSelected(null)}
            className="flex size-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100">
            <BackIcon />
          </button>
          <span className="head-5 text-neutral-900">{category.name}</span>
        </div>

        <div className="scrollbar-hide flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 p-4">
            <div
              className={cn(
                "rounded-20 flex items-center gap-4 p-5",
                category.color.split(" ")[0],
              )}>
              <span className="text-5xl">{category.emoji}</span>
              <div>
                <p className="head-4 text-neutral-900">{category.name}</p>
                <p className={cn("body-5 mt-0.5", category.color.split(" ")[1])}>
                  서울 마포구 기준
                </p>
              </div>
            </div>

            <div className="rounded-16 bg-white p-4 shadow-sm">
              <p className="body-5 mb-2 font-semibold tracking-widest text-neutral-400 uppercase">
                배출 방법
              </p>
              <p className="body-2 text-neutral-800">{guide.method}</p>
            </div>

            <div className="rounded-16 bg-white p-4 shadow-sm">
              <p className="body-5 mb-2 font-semibold tracking-widest text-amber-500 uppercase">
                주의사항
              </p>
              <p className="body-2 text-neutral-700">{guide.caution}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
            분리배출 카테고리
          </p>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={cn(
                  "rounded-12 flex flex-col items-center gap-2 py-5 transition-opacity hover:opacity-80 active:opacity-80",
                  cat.color.split(" ")[0],
                )}>
                <span className="text-3xl">{cat.emoji}</span>
                <span className={cn("body-5", cat.color.split(" ")[1])}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
