import { ApiProperty } from "@nestjs/swagger";

export class AnalyzeImageDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "촬영 또는 업로드한 이미지 파일 (JPEG/PNG 등, 최대 10MB)",
  })
  image!: unknown;
}
