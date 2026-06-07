"use client";

import Lottie from "lottie-react";

import loadingAnimation from "../../../public/lottie/Loading.json";
import { cn } from "@/lib/cn";

const DOT_FILL = [0.870588235294, 0.874509803922, 0.878431372549, 1] as const;
const GREEN_500_FILL = [0.133333333333, 0.772549019608, 0.36862745098, 1] as const;

const LOADING_WIDTH = 200;
const LOADING_HEIGHT = 100;

function tintLoadingAnimation(data: object) {
  return JSON.parse(
    JSON.stringify(data).replaceAll(JSON.stringify(DOT_FILL), JSON.stringify(GREEN_500_FILL)),
  );
}

const tintedLoadingAnimation = tintLoadingAnimation(loadingAnimation);

type LoadingAnimationProps = {
  className?: string;
};

export function LoadingAnimation({ className }: LoadingAnimationProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{ width: LOADING_WIDTH, height: LOADING_HEIGHT }}>
      <Lottie
        animationData={tintedLoadingAnimation}
        loop
        autoplay
        style={{ width: LOADING_WIDTH, height: LOADING_HEIGHT }}
      />
    </div>
  );
}
