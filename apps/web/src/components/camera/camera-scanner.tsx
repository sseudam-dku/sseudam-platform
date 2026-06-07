"use client";

import { useRef, useState } from "react";
import { Camera, X, Zap, ZapOff, Info, Image as ImageIcon, History } from "lucide-react";

interface CameraScannerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasCamera: boolean;
  onCapture: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNavigateHistory: () => void;
}

const CameraScanner = ({
  videoRef,
  hasCamera,
  onCapture,
  onFileChange,
  onBack,
  onNavigateHistory,
}: CameraScannerProps) => {
  const [showTip, setShowTip] = useState(true);
  const [flash, setFlash] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerAlbumUpload = () => {
    fileInputRef.current?.click();
  };

  const toggleInfoToast = () => {
    setShowInfoToast(true);
    setTimeout(() => setShowInfoToast(false), 2500);
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-neutral-950">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* 상단 오버레이 툴바 */}
      <div className="absolute top-0 right-0 left-0 z-20 flex h-16 items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-5 text-white">
        <button
          onClick={onBack}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-all hover:bg-black/40 active:scale-95"
          aria-label="홈으로">
          <X className="size-6" />
        </button>

        <button
          onClick={() => setFlash(!flash)}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-all hover:bg-black/40 active:scale-95"
          aria-label="플래시">
          {flash ? (
            <Zap className="size-5 fill-amber-400 text-amber-400" />
          ) : (
            <ZapOff className="size-5 text-white/80" />
          )}
        </button>

        <button
          onClick={toggleInfoToast}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-all hover:bg-black/40 active:scale-95"
          aria-label="안내">
          <Info className="size-5 text-white/80" />
        </button>
      </div>

      {/* 안내 토스트 팝업 */}
      {showInfoToast && (
        <div className="animate-page-enter body-5 absolute top-20 left-1/2 z-35 w-max max-w-xs -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-center font-semibold text-white shadow-lg backdrop-blur-sm">
          쓰레기를 촬영하면 올바른 분리배출법을 알려드려요!
        </div>
      )}

      {/* 비디오 피드 및 가이드라인 */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-900">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="z-10 flex flex-col items-center gap-3 p-6 text-center">
            <Camera className="size-16 animate-pulse text-neutral-700" />
            <p className="body-4 text-neutral-500">모의 카메라 작동 중</p>
            <p className="body-5 leading-normal text-neutral-600">
              카메라 디바이스가 없거나 보안으로 차단되었습니다.
              <br />
              셔터를 누르면 테스트 분석 결과로 연동됩니다.
            </p>
          </div>
        )}

        {/* 중앙 촬영 가이드 브래킷 */}
        <div className="pointer-events-none absolute inset-0 bottom-24 z-10 flex items-center justify-center sm:bottom-0">
          <div className="relative h-[70vw] w-[65vw] sm:h-80 sm:w-64">
            <div className="absolute top-0 left-0 h-8 w-8 rounded-tl-lg border-t-[3px] border-l-[3px] border-white/90" />
            <div className="absolute top-0 right-0 h-8 w-8 rounded-tr-lg border-t-[3px] border-r-[3px] border-white/90" />
            <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-[3px] border-l-[3px] border-white/90" />
            <div className="absolute right-0 bottom-0 h-8 w-8 rounded-br-lg border-r-[3px] border-b-[3px] border-white/90" />
          </div>
        </div>
      </div>

      {/* 하단 제어바 */}
      <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-9">
        {showTip && (
          <div className="rounded-16 animate-page-enter animate-fade-in relative z-30 mx-5 flex max-w-sm items-start gap-2.5 bg-blue-600/90 p-3.5 text-white shadow-lg backdrop-blur-xs">
            <div className="body-5 flex-1 leading-relaxed">
              <span className="body-5 mb-0.5 block tracking-wider text-blue-200">💡 촬영 TIP</span>
              올바른 분리배출 인식을 위해, 쓰레기를 화면 중앙 가이드에 맞춰 수평으로 촬영해 주세요.
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="shrink-0 cursor-pointer p-0.5 text-white/80 transition-all hover:text-white active:scale-90">
              <X className="size-4" />
            </button>
            <div className="absolute bottom-[-6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-blue-600/90" />
          </div>
        )}

        <div className="mt-1 flex w-full max-w-md items-center justify-between px-10">
          <button
            type="button"
            onClick={triggerAlbumUpload}
            className="flex cursor-pointer flex-col items-center gap-1.5 text-white/85 transition-colors hover:text-white">
            <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
              <ImageIcon className="size-5" />
            </div>
            <span className="body-5 tracking-wider">앨범</span>
          </button>

          <button
            onClick={onCapture}
            className="group relative flex size-20 cursor-pointer items-center justify-center rounded-full border-[5px] border-white bg-transparent p-1 transition-all duration-200 hover:scale-105 active:scale-90"
            aria-label="촬영하기">
            <div className="h-full w-full rounded-full bg-white transition-all group-active:bg-white/80" />
          </button>

          <button
            type="button"
            onClick={onNavigateHistory}
            className="flex cursor-pointer flex-col items-center gap-1.5 text-white/85 transition-colors hover:text-white">
            <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
              <History className="size-5" />
            </div>
            <span className="body-5 tracking-wider">히스토리</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraScanner;
