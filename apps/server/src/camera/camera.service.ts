import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

import {
  CAMERA_MAX_TOKENS,
  CAMERA_MODEL,
  CAMERA_TEMPERATURE,
  WASTE_TYPE_LABELS,
  WASTE_TYPE_TO_CATEGORY_ID,
  WASTE_TYPES,
  type WasteType,
} from "./camera.constants";
import {
  buildDisposalGuideSystemPrompt,
  buildDisposalGuideUserPrompt,
} from "./prompts/disposal-guide.prompt";
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
  disposalGuideSteps: string[];
}

export interface CameraAnalysisResult {
  detectedItems: DetectedWasteItem[];
  scheduleHint: string | null;
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

interface DisposalGuidePayload {
  scheduleHint?: string | null;
  guides?: Array<{ disposalGuideSteps?: string[] }>;
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
    city: string,
    district: string,
  ): Promise<CameraAnalysisResult> {
    if (!this.openai) {
      throw new ServiceUnavailableException("OpenAI API key is not configured");
    }
    const base64Image = imageBuffer.toString("base64");
    const response = await this.openai.chat.completions.create({
      model: CAMERA_MODEL,
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
      temperature: CAMERA_TEMPERATURE,
      max_tokens: CAMERA_MAX_TOKENS,
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
    const guideResult = await this.generateDisposalGuides(detectedItems, city, district);
    return {
      detectedItems: guideResult.items,
      scheduleHint: guideResult.scheduleHint,
    };
  }

  private async generateDisposalGuides(
    items: DetectedWasteItem[],
    city: string,
    district: string,
  ): Promise<{ items: DetectedWasteItem[]; scheduleHint: string | null }> {
    const fallbackItems = items.map(item => ({
      ...item,
      disposalGuideSteps: [],
    }));
    try {
      const response = await this.openai!.chat.completions.create({
        model: CAMERA_MODEL,
        messages: [
          {
            role: "system",
            content: buildDisposalGuideSystemPrompt(city, district),
          },
          {
            role: "user",
            content: buildDisposalGuideUserPrompt(items),
          },
        ],
        temperature: CAMERA_TEMPERATURE,
        max_tokens: CAMERA_MAX_TOKENS,
        response_format: { type: "json_object" },
      });
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { items: fallbackItems, scheduleHint: null };
      }
      const parsed = JSON.parse(content) as DisposalGuidePayload;
      const guides = parsed.guides ?? [];
      return {
        scheduleHint: this.normalizeScheduleHint(parsed.scheduleHint),
        items: items.map((item, index) => ({
          ...item,
          disposalGuideSteps: this.normalizeGuideSteps(guides[index]?.disposalGuideSteps),
        })),
      };
    } catch {
      return { items: fallbackItems, scheduleHint: null };
    }
  }

  private normalizeGuideSteps(steps: string[] | undefined): string[] {
    if (!steps) {
      return [];
    }
    return steps
      .map(step => step.trim())
      .filter(step => step.length > 0)
      .slice(0, 4);
  }

  private normalizeScheduleHint(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    if (!trimmed || trimmed.toLowerCase() === "null") {
      return null;
    }
    return trimmed;
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
      disposalGuideSteps: [],
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
