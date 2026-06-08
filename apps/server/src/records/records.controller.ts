import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { CreateRecordDto } from "./dto/create-record.dto";
import { DisposalRecordResponseDto } from "./dto/record-response.dto";
import { RecordsService } from "./records.service";

@ApiTags("records")
@Controller("records")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
@ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    summary: "분리배출 기록 저장",
    description:
      "카메라 인식 결과 등을 분리배출 기록으로 저장합니다. " +
      "성공 시 포인트 자동 적립 및 뱃지 획득 조건을 평가합니다. ",
  })
  @ApiResponse({ status: 201, description: "기록 저장 성공", type: DisposalRecordResponseDto })
  @ApiNotFoundResponse({ description: "존재하지 않는 categoryId" })
  createRecord(@CurrentUser() user: AuthenticatedUser, @Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.createRecord(user.id, createRecordDto);
  }

  @Get()
  @ApiOperation({
    summary: "내 분리배출 기록 목록",
    description: "로그인한 사용자의 분리배출 기록을 최신순으로 최대 50건 반환합니다. ",
  })
  @ApiResponse({ status: 200, description: "기록 목록", type: [DisposalRecordResponseDto] })
  findUserRecords(@CurrentUser() user: AuthenticatedUser) {
    return this.recordsService.findUserRecords(user.id);
  }
}
