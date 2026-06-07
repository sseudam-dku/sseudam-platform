import { ApiProperty } from "@nestjs/swagger";

export class UserLocationResponseDto {
  @ApiProperty({ description: "시/도", example: "서울" })
  city!: string;

  @ApiProperty({ description: "구", example: "중구" })
  district!: string;

  @ApiProperty({ description: "화면 표시용 지역명", example: "서울 중구" })
  displayName!: string;
}

export class CategoryBreakdownDto {
  @ApiProperty({ description: "카테고리명", example: "플라스틱" })
  name!: string;

  @ApiProperty({ description: "비율 (%)", example: 45 })
  percent!: number;

  @ApiProperty({ description: "차트 색상 클래스", example: "bg-orange-400" })
  color!: string;
}

export class UserStatsResponseDto {
  @ApiProperty({ description: "총 분리배출 성공 횟수", example: 24 })
  totalRecords!: number;

  @ApiProperty({ description: "누적 포인트", example: 250 })
  totalPoints!: number;

  @ApiProperty({ description: "이번 달 분리배출 횟수", example: 8 })
  monthlyRecords!: number;

  @ApiProperty({ description: "연속 분리배출 일수", example: 3 })
  streakDays!: number;

  @ApiProperty({ type: [CategoryBreakdownDto], description: "카테고리별 비율" })
  categoryBreakdown!: CategoryBreakdownDto[];
}

export class UserBadgeResponseDto {
  @ApiProperty({ description: "뱃지 ID", example: "streak-3" })
  id!: string;

  @ApiProperty({ description: "뱃지 이름", example: "연속 3일" })
  name!: string;

  @ApiProperty({ description: "이모지", example: "🔥" })
  emoji!: string;

  @ApiProperty({ description: "뱃지 이미지 경로", example: "/assets/badge/3days-master-badge.svg" })
  image!: string;

  @ApiProperty({ description: "획득 조건 설명" })
  description!: string;

  @ApiProperty({ description: "보상 포인트 표시", example: "+300P" })
  reward!: string;

  @ApiProperty({ description: "획득 여부", example: true })
  earned!: boolean;
}

export class PointHistoryResponseDto {
  @ApiProperty({ description: "포인트 내역 ID" })
  id!: string;

  @ApiProperty({ description: "적립 일자", example: "2026.06.07" })
  date!: string;

  @ApiProperty({ description: "적립 사유", example: "플라스틱 분리배출" })
  category!: string;

  @ApiProperty({ description: "적립 포인트", example: 10 })
  points!: number;
}
