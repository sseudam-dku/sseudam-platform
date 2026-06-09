import { ApiProperty } from "@nestjs/swagger";

import { WASTE_TYPES } from "../camera.constants";

export class DetectedWastePartDto {
  @ApiProperty({ description: "부품명", example: "뚜껑" })
  name!: string;

  @ApiProperty({
    description: "부품 분류 타입",
    enum: WASTE_TYPES,
    example: "PET",
  })
  type!: string;

  @ApiProperty({ description: "부품 분류 라벨 (한글)", example: "PET(페트)" })
  typeLabel!: string;
}

export class DetectedWasteItemDto {
  @ApiProperty({
    description: "쓰레기 분류 타입",
    enum: WASTE_TYPES,
    example: "PET",
  })
  type!: string;

  @ApiProperty({ description: "세부 품목명", example: "PET(투명 페트병)" })
  itemName!: string;

  @ApiProperty({ description: "사용자 친화적 명칭", example: "페트컵" })
  name!: string;

  @ApiProperty({ description: "인식 신뢰도 (0~1)", example: 0.92 })
  confidence!: number;

  @ApiProperty({ type: [DetectedWastePartDto], description: "구성 부품" })
  parts!: DetectedWastePartDto[];

  @ApiProperty({ description: "waste_categories 테이블 ID", example: "plastic" })
  categoryId!: string;

  @ApiProperty({ description: "분류 라벨 (한글)", example: "PET(페트)" })
  categoryLabel!: string;

  @ApiProperty({ type: [String] })
  disposalGuideSteps!: string[];
}

export class CameraAnalysisResponseDto {
  @ApiProperty({ type: [DetectedWasteItemDto], description: "인식된 쓰레기 목록" })
  detectedItems!: DetectedWasteItemDto[];

  @ApiProperty({ nullable: true })
  scheduleHint!: string | null;
}
