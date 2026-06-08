import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

import {
  VISION_MAX_TOKENS,
  VISION_MODEL,
  VISION_TEMPERATURE,
  WASTE_TYPE_LABELS,
  WASTE_TYPE_TO_CATEGORY_ID,
  WASTE_TYPES,
  type WasteType,
} from "./camera.constants";
import { buildVisionSystemPrompt } from "./prompts/system.prompt";
import { VISION_USER_PROMPT } from "./prompts/user.prompt";

export interface DetectedWastePart {
  name: string;
  type: WasteType;
  typeLabel: string;
}

export interface DetectedWasteItem {
  type: WasteType;
  itemName: string;
  name: string;
  confidence: number;
  parts: DetectedWastePart[];
  categoryId: string;
  categoryLabel: string;
}

export interface CameraAnalysisResult {
  detectedItems: DetectedWasteItem[];
}

interface VisionDetectedPart {
  name: string;
  type: string;
}

interface VisionDetectedItem {
  type: string;
  itemName: string;
  name: string;
  confidence: number;
  parts?: VisionDetectedPart[];
}

interface VisionAnalysisPayload {
  detectedItems?: VisionDetectedItem[];
}

/**
 * Analyzes waste images using OpenAI Vision API.
 */
@Injectable()
export class CameraService {
  private readonly openai: OpenAI | null;

  constructor(configService: ConfigService) {
    const apiKey = configService.get<string>("OPENAI_API_KEY");
    this.openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    _city: string,
    _district: string,
  ): Promise<CameraAnalysisResult> {
    if (!this.openai) {
      throw new ServiceUnavailableException("OpenAI API key is not configured");
    }
    const base64Image = imageBuffer.toString("base64");
    const response = await this.openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "system",
          content: buildVisionSystemPrompt(),
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: VISION_USER_PROMPT,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: VISION_TEMPERATURE,
      max_tokens: VISION_MAX_TOKENS,
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ServiceUnavailableException("Failed to analyze image");
    }
    const parsed = JSON.parse(content) as VisionAnalysisPayload;
    const detectedItems = (parsed.detectedItems ?? [])
      .slice(0, 5)
      .map(item => this.normalizeDetectedItem(item));
    if (detectedItems.length === 0) {
      throw new BadRequestException("No waste items detected in the image");
    }
    return { detectedItems };
  }

  private normalizeDetectedItem(item: VisionDetectedItem): DetectedWasteItem {
    const type = this.resolveWasteType(item.type);
    const parts = (item.parts ?? []).slice(0, 4).map(part => {
      const type = this.resolveWasteType(part.type);
      return {
        name: part.name,
        type,
        typeLabel: WASTE_TYPE_LABELS[type],
      };
    });
    return {
      type,
      itemName: item.itemName || "기타",
      name: item.name || item.itemName || "기타",
      confidence: this.clampConfidence(item.confidence),
      parts,
      categoryId: WASTE_TYPE_TO_CATEGORY_ID[type],
      categoryLabel: WASTE_TYPE_LABELS[type],
    };
  }

  private resolveWasteType(value: string): WasteType {
    const normalized = value?.trim().toUpperCase();
    if (normalized === "PAPER_PACK") {
      return "PAPER";
    }
    if (WASTE_TYPES.includes(normalized as WasteType)) {
      return normalized as WasteType;
    }
    return "UNKNOWN";
  }

  private clampConfidence(value: number | undefined): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return 0;
    }
    return Math.min(1, Math.max(0, value));
  }
}
