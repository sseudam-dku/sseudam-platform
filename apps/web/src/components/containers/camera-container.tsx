"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CameraScanner } from "../camera/camera-scanner";
import { CameraAnalyzer } from "../camera/camera-analyzer";
import { CameraResult } from "../camera/camera-result";

type CameraState = "idle" | "analyzing" | "success" | "failure";

const CameraContainer = () => {
  const router = useRouter();
  const [state, setState] = useState<CameraState>("idle");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 실제 카메라 스트림 시작 함수
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      Promise.resolve().then(() => {
        setHasCamera(true);
      });
    } catch (err) {
      console.warn("실제 카메라에 액세스할 수 없어 모의 모드로 대체합니다:", err);
      Promise.resolve().then(() => {
        setHasCamera(false);
      });
    }
  };

  // 카메라 스트림 정지 함수
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // idle 상태일 때에만 카메라 활성화
  useEffect(() => {
    if (state === "idle") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [state]);

  // 사진 촬영 핸들러
  function handleCapture() {
    if (hasCamera && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setCapturedImage(dataUrl);
        }
      } catch (err) {
        console.error("화면 캡처 중 오류가 발생하여 모의 이미지로 대체합니다:", err);
      }
    }

    stopCamera();
    setState("analyzing");

    // 모의 분석 딜레이
    setTimeout(() => {
      setState(Math.random() > 0.15 ? "success" : "failure");
    }, 2000);
  }

  // 앨범 파일 선택 핸들러
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
        setState("analyzing");
        setTimeout(() => {
          setState(Math.random() > 0.15 ? "success" : "failure");
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }

  // 촬영 리셋 핸들러
  function handleReset() {
    setCapturedImage(null);
    setState("idle");
  }

  if (state === "idle") {
    return (
      <CameraScanner
        videoRef={videoRef}
        hasCamera={hasCamera}
        onCapture={handleCapture}
        onFileChange={handleFileChange}
        onBack={() => router.push("/")}
        onNavigateHistory={() => router.push("/records")}
      />
    );
  }

  if (state === "analyzing") {
    return <CameraAnalyzer />;
  }

  return (
    <CameraResult
      isSuccess={state === "success"}
      capturedImage={capturedImage}
      onReset={handleReset}
      onNavigateChatbot={() => router.push("/chatbot")}
    />
  );
};

export default CameraContainer;
