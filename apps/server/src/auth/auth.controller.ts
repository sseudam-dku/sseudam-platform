import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { AuthService } from "./auth.service";
import {
  AuthLoginResponseDto,
  AuthUserResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
} from "./dto/auth-response.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { JwtPayload } from "./models/jwt-payload.interface";

import { IsString } from "class-validator";

class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("google")
  @ApiOperation({
    summary: "Google 소셜 로그인",
    description:
      "프론트엔드에서 받은 Google ID 토큰을 검증하고, 신규 유저는 자동 생성 후 JWT를 발급합니다. ",
  })
  @ApiResponse({ status: 201, description: "로그인 성공", type: AuthLoginResponseDto })
  @ApiUnauthorizedResponse({ description: "유효하지 않은 Google ID 토큰" })
  async loginWithGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    const result = await this.authService.loginWithGoogle(googleLoginDto.idToken);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post("refresh")
  @ApiOperation({
    summary: "액세스 토큰 갱신",
    description: "refreshToken으로 새 JWT 액세스 토큰을 발급합니다.",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 201, description: "토큰 갱신 성공", type: RefreshTokenResponseDto })
  @ApiUnauthorizedResponse({ description: "유효하지 않거나 만료된 refresh token" })
  async refreshAccessToken(@Body() body: RefreshTokenDto) {
    if (!body.refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }
    const result = await this.authService.refreshAccessToken(body.refreshToken);
    return { accessToken: result.accessToken };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "현재 로그인 유저 조회",
    description:
      "JWT로 인증된 사용자의 프로필 정보를 반환합니다. " +
      "city/district가 null이면 아직 위치 설정을 하지 않은 상태입니다. ",
  })
  @ApiResponse({ status: 200, description: "프로필 조회 성공", type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: "토큰 없음, 만료, 또는 세션 무효" })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "로그아웃",
    description: "서버 세션을 삭제합니다.",
  })
  @ApiResponse({ status: 201, description: "로그아웃 성공", type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: "인증 필요" })
  async logout(@Req() request: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (token) {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      await this.authService.logout(payload.sessionId);
    }
    return { success: true };
  }
}
