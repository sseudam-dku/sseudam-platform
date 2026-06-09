import { apiFetch } from "./client";

export interface DetectedWastePart {
  name: string;
  type: string;
  typeLabel: string;
}

export interface DetectedWasteItem {
  type: string;
  itemName: string;
  name: string;
  confidence: number;
  parts: DetectedWastePart[];
  categoryId: string;
  categoryLabel: string;
  disposalGuideSteps?: string[];
}

export interface CameraAnalysisResult {
  detectedItems: DetectedWasteItem[];
  scheduleHint?: string | null;
}

export async function analyzeImage(file: Blob): Promise<CameraAnalysisResult> {
  const formData = new FormData();
  formData.append("image", file, "capture.jpg");
  return apiFetch<CameraAnalysisResult>("/camera/analyze", {
    method: "POST",
    auth: true,
    body: formData,
  });
}
