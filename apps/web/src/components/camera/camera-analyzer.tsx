import Lottie from "lottie-react";
import globeAnimation from "../../../public/lottie/Globe.json";

const CameraAnalyzer = () => {
  return (
    <div className="animate-page-enter flex flex-1 flex-col items-center justify-center bg-neutral-100 text-center">
      <Lottie animationData={globeAnimation} loop autoplay className="h-50 w-50" />
      <div className="flex flex-col gap-2">
        <p className="head-4 text-neutral-900">분석 중이에요</p>
        <p className="body-4 text-neutral-500">쓰담이 쓰레기를 분류하고 있어요</p>
      </div>
    </div>
  );
};

export default CameraAnalyzer;
