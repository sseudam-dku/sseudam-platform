import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import {
  ChatMessageResponseDto,
  ChatSessionResponseDto,
  SendChatResponseDto,
  SendGuestChatResponseDto,
} from "./dto/chat-response.dto";
import { SendChatMessageDto } from "./dto/send-chat-message.dto";
import { SendGuestChatMessageDto } from "./dto/send-guest-chat-message.dto";
import { ChatService } from "./chat.service";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("guest")
  @ApiOperation({
    summary: "비회원 메시지 전송 + AI 응답",
    description:
      "로그인 없이 최대 3회까지 AI 챗봇을 이용할 수 있습니다. guestSessionId로 사용 횟수를 추적합니다.",
  })
  @ApiResponse({ status: 201, description: "AI 응답 생성 성공", type: SendGuestChatResponseDto })
  @ApiForbiddenResponse({ description: "비회원 3회 이용 한도 초과" })
  @ApiServiceUnavailableResponse({ description: "OPENAI_API_KEY 미설정" })
  sendGuestMessage(@Body() dto: SendGuestChatMessageDto) {
    return this.chatService.sendGuestMessage(
      dto.guestSessionId,
      dto.message,
      dto.city,
      dto.district,
      dto.history,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
  @ApiOperation({
    summary: "메시지 전송 + AI 응답",
    description:
      "사용자 메시지를 저장하고 OpenAI GPT가 지역(city/district)을 반영해 답변을 생성합니다. " +
      "sessionId를 생략하면 새 대화 세션이 생성됩니다. ",
  })
  @ApiResponse({ status: 201, description: "AI 응답 생성 성공", type: SendChatResponseDto })
  @ApiServiceUnavailableResponse({ description: "OPENAI_API_KEY 미설정" })
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Body() sendChatMessageDto: SendChatMessageDto,
  ) {
    const city = user.city ?? "서울";
    const district = user.district ?? "중구";
    return this.chatService.sendMessage(
      user.id,
      sendChatMessageDto.message,
      sendChatMessageDto.sessionId,
      city,
      district,
    );
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
  @ApiOperation({
    summary: "채팅 세션 목록",
    description: "사용자의 채팅 세션을 최신 업데이트 순으로 최대 50개 반환합니다. ",
  })
  @ApiResponse({ status: 200, description: "세션 목록", type: [ChatSessionResponseDto] })
  findSessions(@CurrentUser() user: AuthenticatedUser) {
    return this.chatService.findSessions(user.id);
  }

  @Get("sessions/:id/messages")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
  @ApiOperation({
    summary: "세션 메시지 조회",
    description: "특정 채팅 세션의 전체 메시지를 시간순으로 반환합니다. 본인 세션만 조회 가능. ",
  })
  @ApiParam({ name: "id", description: "채팅 세션 UUID" })
  @ApiResponse({ status: 200, description: "메시지 목록", type: [ChatMessageResponseDto] })
  @ApiNotFoundResponse({ description: "세션 없음 또는 다른 사용자의 세션" })
  findSessionMessages(@CurrentUser() user: AuthenticatedUser, @Param("id") sessionId: string) {
    return this.chatService.findSessionMessages(user.id, sessionId);
  }
}
