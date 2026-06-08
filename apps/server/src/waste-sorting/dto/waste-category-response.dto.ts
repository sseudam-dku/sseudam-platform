import { ApiProperty } from "@nestjs/swagger";

export class WasteCategoryResponseDto {
  @ApiProperty({ description: "카테고리 ID", example: "plastic" })
  id!: string;

  @ApiProperty({ description: "카테고리명", example: "플라스틱" })
  name!: string;

  @ApiProperty({ description: "프론트 라우트", example: "/category" })
  href!: string;
}

export class WasteCategoryDetailResponseDto extends WasteCategoryResponseDto {
  @ApiProperty({ description: "조회 기준 구", example: "중구" })
  district!: string;

  @ApiProperty({ description: "화면 표시용 지역", example: "서울 중구" })
  displayLocation!: string;

  @ApiProperty({ description: "배출 방법 안내" })
  method!: string;

  @ApiProperty({
    description: "배출 요일",
    example: "화·목",
    nullable: true,
  })
  schedule!: string | null;

  @ApiProperty({
    description: "미수거일",
    example: "일·공휴일",
    nullable: true,
  })
  noCollectDay!: string | null;

  @ApiProperty({ description: "배출 장소", nullable: true })
  disposalPlace!: string | null;

  @ApiProperty({ description: "배출 장소 유형", nullable: true })
  disposalPlaceType!: string | null;

  @ApiProperty({ description: "배출 시작 시간", nullable: true })
  disposalTimeStart!: string | null;

  @ApiProperty({ description: "배출 종료 시간", nullable: true })
  disposalTimeEnd!: string | null;

  @ApiProperty({ description: "관리 구역", nullable: true })
  managementZone!: string | null;

  @ApiProperty({ description: "일반쓰레기 배출 방법", nullable: true })
  generalWasteMethod!: string | null;

  @ApiProperty({ description: "일반쓰레기 배출 요일", nullable: true })
  generalWasteSchedule!: string | null;

  @ApiProperty({ description: "주의사항" })
  caution!: string;

  @ApiProperty({
    description: "데이터 출처. api=공공데이터포털, fallback=DB 시드 데이터",
    enum: ["api", "fallback"],
    example: "api",
  })
  source!: "api" | "fallback";
}
