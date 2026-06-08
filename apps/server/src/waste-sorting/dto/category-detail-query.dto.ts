import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryDetailQueryDto {
  @ApiPropertyOptional({
    description: "시/도. 미입력 시 기본값 '서울'",
    example: "서울",
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: "구. 미입력 시 기본값 '중구'. 공공데이터 API 검색에 사용",
    example: "중구",
  })
  @IsOptional()
  @IsString()
  district?: string;
}
