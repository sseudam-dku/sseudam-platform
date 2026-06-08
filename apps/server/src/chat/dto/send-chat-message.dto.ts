import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class SendChatMessageDto {
  @ApiProperty({
    description: "사용자가 입력한 채팅 메시지. OpenAI GPT가 지역 기반으로 답변 생성",
    example: "플라스틱 배출 방법 알려줘",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;

  @ApiPropertyOptional({
    description: "기존 대화 세션 ID. 생략 시 새 세션 생성. 연속 대화 시 이전 응답의 sessionId 전달",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
