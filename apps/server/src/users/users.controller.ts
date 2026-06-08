import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { UpdateLocationDto } from "./dto/update-location.dto";
import {
  PointHistoryResponseDto,
  UserBadgeResponseDto,
  UserLocationResponseDto,
  UserStatsResponseDto,
} from "./dto/user-response.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
@ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put("location")
  @ApiOperation({
    summary: "유저 지역 설정",
    description:
      "로그인한 사용자의 거주 지역(시/도 + 구)을 저장합니다. " +
      "이후 챗봇·카메라·카테고리 상세 API에서 지역 기반 안내에 사용됩니다. ",
  })
  @ApiResponse({ status: 200, description: "지역 저장 성공", type: UserLocationResponseDto })
  updateLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.usersService.updateLocation(user.id, updateLocationDto);
  }

  @Get("location")
  @ApiOperation({
    summary: "유저 지역 조회",
    description: "저장된 지역 정보를 반환합니다. 미설정 시 기본값 서울 중구가 반환됩니다. ",
  })
  @ApiResponse({ status: 200, description: "지역 조회 성공", type: UserLocationResponseDto })
  getLocation(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getLocation(user.id);
  }

  @Get("stats")
  @ApiOperation({
    summary: "유저 통계 조회",
    description:
      "분리배출 횟수, 누적 포인트, 이번 달 횟수, 연속 달성 일수, 카테고리별 비율을 반환합니다. ",
  })
  @ApiResponse({ status: 200, description: "통계 조회 성공", type: UserStatsResponseDto })
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getStats(user.id);
  }

  @Get("badges")
  @ApiOperation({
    summary: "뱃지 목록 조회",
    description: "전체 뱃지 정의와 현재 사용자의 획득 여부(earned)를 반환합니다. ",
  })
  @ApiResponse({ status: 200, description: "뱃지 목록", type: [UserBadgeResponseDto] })
  getBadges(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getBadges(user.id);
  }

  @Get("points")
  @ApiOperation({
    summary: "포인트 히스토리 조회",
    description: "포인트 적립 내역을 최신순으로 최대 50건 반환합니다. <br/>",
  })
  @ApiResponse({ status: 200, description: "포인트 내역", type: [PointHistoryResponseDto] })
  getPoints(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getPointHistory(user.id);
  }
}
