import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateRecordDto {
  @ApiProperty({
    description: "waste_categories 테이블 ID",
    example: "plastic",
    enum: ["plastic", "paper", "glass", "can", "food", "styrofoam", "clothes", "lamp", "battery"],
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    description: "인식/입력된 품목명",
    example: "생수 페트병",
  })
  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @ApiPropertyOptional({
    description: "획득 포인트. 미입력 시 카테고리별 기본값 적용 (예: 플라스틱 10P, 유리 20P)",
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @ApiPropertyOptional({
    description: "인증 결과. success 시 포인트 적립 및 뱃지 조건 평가",
    enum: ["success", "failure"],
    default: "success",
  })
  @IsOptional()
  @IsIn(["success", "failure"])
  status?: "success" | "failure";
}
