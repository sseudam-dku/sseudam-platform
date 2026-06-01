"use client";

import { useState } from "react";

import { IconCamera } from "@/components/icons/camera";
import { Button } from "@/components/ui/button";

type CameraState = "idle" | "analyzing" | "success" | "failure";

function IconRotate() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconAlertCircle() {
  return (
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
  );
}

export function CameraTab() {
  const [state, setState] = useState<CameraState>("idle");

  function handleCapture() {
    setState("analyzing");
    setTimeout(() => {
      setState(Math.random() > 0.3 ? "success" : "failure");
    }, 2000);
  }

  if (state === "idle") {
    return (
      <div className="flex flex-1 flex-col gap-4 bg-neutral-100 p-4">
        <div className="rounded-20 flex flex-1 flex-col items-center justify-center gap-3 bg-neutral-900">
          <IconCamera className="size-16 text-neutral-600" />
          <p className="body-4 text-neutral-500">카메라 영역</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="body-5 text-center text-neutral-400">
            쓰레기를 화면 중앙에 맞추고 촬영하세요
          </p>
          <Button size="lg" className="w-full rounded-full" onClick={handleCapture}>
            촬영하기
          </Button>
        </div>
      </div>
    );
  }

  if (state === "analyzing") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-neutral-100 p-4 text-center">
        <div className="flex size-28 items-center justify-center rounded-full bg-white shadow-sm">
          <span className="text-5xl">🌍</span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="head-4 text-neutral-900">분석 중이에요</p>
          <p className="body-4 text-neutral-500">쓰담이 쓰레기를 분류하고 있어요...</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="size-2 animate-bounce rounded-full bg-green-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
        <div className="flex flex-col gap-3 p-4">
          <div className="rounded-20 flex aspect-video w-full items-center justify-center bg-neutral-800">
            <IconCamera className="size-12 text-neutral-600" />
          </div>

          <div className="rounded-16 bg-white p-4 shadow-sm">
            <p className="body-5 mb-1 font-semibold tracking-widest text-neutral-400 uppercase">
              인식 결과
            </p>
            <p className="head-3 text-neutral-900">페트병</p>
            <div className="mt-2 inline-flex items-center rounded-full bg-orange-50 px-3 py-1">
              <span className="body-5 font-semibold text-orange-500">플라스틱류</span>
            </div>
          </div>

          <div className="rounded-16 bg-white p-4 shadow-sm">
            <p className="body-5 mb-2 font-semibold tracking-widest text-neutral-400 uppercase">
              배출 방법
            </p>
            <p className="body-2 text-neutral-700">
              내용물을 비우고 압착한 뒤 뚜껑을 제거하여 플라스틱 수거함에 배출하세요.
            </p>
          </div>

          <div className="rounded-16 bg-green-50 p-4">
            <p className="body-5 mb-1 font-semibold text-green-600">분리배출 가이드</p>
            <p className="body-4 text-neutral-700">
              플라스틱류로 분류하여 배출합니다. 재활용 가능 마크를 확인하세요.
            </p>
            <p className="body-5 mt-1 text-neutral-400">서울 마포구 기준</p>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full"
            onClick={() => setState("idle")}>
            <IconRotate />
            다시 촬영하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-neutral-100 p-4 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-rose-500">
          <IconAlertCircle />
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
      <div className="flex w-full flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full"
          onClick={() => setState("idle")}>
          <IconRotate />
          재촬영하기
        </Button>
        <Button size="lg" className="w-full rounded-full">
          직접 입력하기
        </Button>
      </div>
    </div>
  );
}
