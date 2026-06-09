"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CameraAnalyzer from "@/components/camera/camera-analyzer";
import CameraResult, { type TrashAnalysisResult } from "@/components/camera/camera-result";
import CameraScanner from "@/components/camera/camera-scanner";
import { analyzeImage } from "@/lib/api/camera";
import { createRecord } from "@/lib/api/records";
import { useInvalidateUserData } from "@/lib/query/hooks";
import { useLocationStore } from "@/lib/store/use-location-store";

type CameraState = "idle" | "analyzing" | "success" | "failure";

const DEFAULT_DISTRICT = "중구";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function CameraClient() {
  const router = useRouter();
  const { mutate: invalidateUserData } = useInvalidateUserData();
  const { city, district, isHydrated } = useLocationStore();
  const resolvedCity = isHydrated ? city : "서울";
  const resolvedDistrict = isHydrated ? district : DEFAULT_DISTRICT;
  const [state, setState] = useState<CameraState>("idle");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TrashAnalysisResult | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (state === "idle") {
      void startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [state]);

  async function runAnalysis(blob: Blob) {
    setState("analyzing");
    try {
      const result = await analyzeImage(blob);
      if (result.detectedItems.length === 0) {
        setAnalysisResult(null);
        setState("failure");
        return;
      }
      setAnalysisResult({
        detectedItems: result.detectedItems,
        scheduleHint: result.scheduleHint,
      });
      setState("success");
      const primaryItem = [...result.detectedItems].sort((a, b) => b.confidence - a.confidence)[0];
      await createRecord({
        categoryId: primaryItem.categoryId,
        itemName: primaryItem.name,
        status: "success",
      });
      invalidateUserData();
      toast.success("+10P 적립 완료! 🎉");
    } catch {
      setAnalysisResult(null);
      setState("failure");
    }
  }

  function handleCapture() {
    let blob: Blob | null = capturedBlob;
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
          blob = dataUrlToBlob(dataUrl);
          setCapturedBlob(blob);
        }
      } catch (err) {
        console.error("화면 캡처 중 오류가 발생했습니다:", err);
      }
    }
    stopCamera();
    if (blob) {
      void runAnalysis(blob);
    } else {
      setState("failure");
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
      setCapturedBlob(file);
      stopCamera();
      void runAnalysis(file);
    };
    reader.readAsDataURL(file);
  }

  function handleReset() {
    setCapturedImage(null);
    setCapturedBlob(null);
    setAnalysisResult(null);
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
      analysisResult={analysisResult}
      city={resolvedCity}
      district={resolvedDistrict}
      onReset={handleReset}
      onNavigateChatbot={() => router.push("/chatbot")}
    />
  );
}

export default CameraClient;
