import { ApiProperty } from "@nestjs/swagger";

export class ChatMessageResponseDto {
  @ApiProperty({ description: "메시지 ID" })
  id!: string;

  @ApiProperty({ description: "발신 역할", enum: ["user", "assistant"] })
  role!: "user" | "assistant";

  @ApiProperty({ description: "메시지 내용" })
  content!: string;

  @ApiProperty({ description: "생성 시각 (ISO 8601)" })
  createdAt!: string;
}

export class ChatSessionResponseDto {
  @ApiProperty({ description: "세션 ID" })
  id!: string;

  @ApiProperty({ description: "세션 제목 (첫 메시지 기반)", nullable: true })
  title!: string | null;

  @ApiProperty({ description: "생성 시각 (ISO 8601)" })
  createdAt!: string;

  @ApiProperty({ description: "마지막 업데이트 시각 (ISO 8601)" })
  updatedAt!: string;
}

export class SendChatResponseDto {
  @ApiProperty({ description: "채팅 세션 ID. 이후 메시지에 sessionId로 전달" })
  sessionId!: string;

  @ApiProperty({ type: ChatMessageResponseDto })
  userMessage!: ChatMessageResponseDto;

  @ApiProperty({ type: ChatMessageResponseDto })
  assistantMessage!: ChatMessageResponseDto;
}

export class SendGuestChatResponseDto {
  @ApiProperty({ type: ChatMessageResponseDto })
  assistantMessage!: ChatMessageResponseDto;

  @ApiProperty({ description: "남은 비회원 질문 횟수", example: 2 })
  remainingCount!: number;
}
