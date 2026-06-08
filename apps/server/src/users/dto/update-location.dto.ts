import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLocationDto {
  @ApiProperty({
    description: "시/도. 온보딩 위치 설정 시 저장되는 값",
    example: "서울",
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({
    description: "구 단위 지역. 분리배출 가이드·챗봇·카메라 분석에 반영됨",
    example: "중구",
  })
  @IsString()
  @IsNotEmpty()
  district!: string;
}
