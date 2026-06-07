"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import CameraScanner from "../camera/camera-scanner";
import CameraAnalyzer from "../camera/camera-analyzer";
import CameraResult, { type TrashAnalysisResult } from "../camera/camera-result";

type CameraState = "idle" | "analyzing" | "success" | "failure";

const MOCK_ANALYSIS_RESULTS: TrashAnalysisResult[] = [
  {
    name: "알루미늄 컵",
    category: "재활용 쓰레기: 캔류, 고철류",
    components: [
      { name: "컵 몸체", category: "캔류, 고철류" },
      { name: "플라스틱 빨대", category: "플라스틱" },
    ],
    steps: [
      "금속류(캔류)로 배출하세요. 이물질은 깨끗이 비워야 합니다.",
      "플라스틱 빨대는 분리하여 플라스틱 수거함에 배출하세요.",
    ],
  },
  {
    name: "생수 페트병",
    category: "재활용 쓰레기: 무색 페트병",
    components: [
      { name: "페트병 몸체", category: "무색 페트병" },
      { name: "플라스틱 뚜껑", category: "플라스틱" },
      { name: "라벨 비닐", category: "비닐류" },
    ],
    steps: [
      "내용물을 깨끗이 비우고 물로 헹구어 줍니다.",
      "라벨(비닐)을 떼어내어 비닐류로 분리배출합니다.",
      "페트병을 압착하고 뚜껑을 닫아 무색페트병 수거함에 배출합니다.",
    ],
  },
  {
    name: "택배 상자",
    category: "재활용 쓰레기: 종이류",
    components: [
      { name: "종이 상자", category: "종이" },
      { name: "테이프 및 송장", category: "일반 쓰레기" },
    ],
    steps: [
      "상자에 붙어 있는 비닐 테이프와 택배 송장을 완전히 제거합니다.",
      "상자를 납작하게 접어서 종이 수거함에 배출합니다.",
    ],
  },
];

const CameraContainer = () => {
  const router = useRouter();
  const [state, setState] = useState<CameraState>("idle");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TrashAnalysisResult | null>(null);

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
      const isSuccessful = Math.random() > 0.15;
      if (isSuccessful) {
        const randomResult =
          MOCK_ANALYSIS_RESULTS[Math.floor(Math.random() * MOCK_ANALYSIS_RESULTS.length)];
        setAnalysisResult(randomResult);
        setState("success");
      } else {
        setAnalysisResult(null);
        setState("failure");
      }
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
          const isSuccessful = Math.random() > 0.15;
          if (isSuccessful) {
            const randomResult =
              MOCK_ANALYSIS_RESULTS[Math.floor(Math.random() * MOCK_ANALYSIS_RESULTS.length)];
            setAnalysisResult(randomResult);
            setState("success");
          } else {
            setAnalysisResult(null);
            setState("failure");
          }
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }

  // 촬영 리셋 핸들러
  function handleReset() {
    setCapturedImage(null);
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
      onReset={handleReset}
      onNavigateChatbot={() => router.push("/chatbot")}
    />
  );
};

export default CameraContainer;
