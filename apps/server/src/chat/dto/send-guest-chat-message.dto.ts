import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";

export class GuestChatHistoryItemDto {
  @ApiProperty({ enum: ["user", "assistant"] })
  @IsIn(["user", "assistant"])
  role!: "user" | "assistant";

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content!: string;
}

export class SendGuestChatMessageDto {
  @ApiProperty({ description: "사용자 메시지" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;

  @ApiProperty({ description: "비회원 세션 ID (클라이언트 생성 UUID)" })
  @IsUUID()
  guestSessionId!: string;

  @ApiProperty({ example: "서울" })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "중구" })
  @IsString()
  @IsNotEmpty()
  district!: string;

  @ApiProperty({ type: [GuestChatHistoryItemDto], description: "이전 대화 맥락 (최대 20개)" })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => GuestChatHistoryItemDto)
  history!: GuestChatHistoryItemDto[];
}
