import { ApiProperty } from "@nestjs/swagger";

export class DisposalRecordResponseDto {
  @ApiProperty({ description: "기록 ID" })
  id!: string;

  @ApiProperty({ description: "기록 일시", example: "2026-06-07 14:30" })
  date!: string;

  @ApiProperty({ description: "카테고리 ID", example: "plastic" })
  categoryId!: string;

  @ApiProperty({ description: "카테고리명", example: "플라스틱" })
  category!: string;

  @ApiProperty({ description: "품목명", example: "생수 페트병" })
  name!: string;

  @ApiProperty({ description: "획득 포인트", example: 10 })
  points!: number;

  @ApiProperty({ description: "인증 상태", enum: ["success", "failure"], example: "success" })
  status!: string;
}
