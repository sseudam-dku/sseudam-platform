import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { ExtractJwt } from "passport-jwt";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { AuthService } from "./auth.service";
import {
  AuthLoginResponseDto,
  AuthUserResponseDto,
  LogoutResponseDto,
} from "./dto/auth-response.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { JwtPayload } from "./models/jwt-payload.interface";

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
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
      "프론트엔드에서 받은 Google ID 토큰을 검증하고, 신규 유저는 자동 생성 후 JWT를 발급합니다. " +
      "응답 body의 accessToken과 함께 access_token httpOnly 쿠키도 설정됩니다. ",
  })
  @ApiResponse({ status: 201, description: "로그인 성공", type: AuthLoginResponseDto })
  @ApiUnauthorizedResponse({ description: "유효하지 않은 Google ID 토큰" })
  async loginWithGoogle(
    @Body() googleLoginDto: GoogleLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginWithGoogle(googleLoginDto.idToken);
    response.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
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
    description:
      "서버 세션을 삭제하고 access_token 쿠키를 제거합니다. " +
      "클라이언트는 localStorage의 토큰도 함께 삭제해야 합니다. ",
  })
  @ApiResponse({ status: 201, description: "로그아웃 성공", type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: "인증 필요" })
  async logout(@Req() request: RequestWithCookies, @Res({ passthrough: true }) response: Response) {
    const token =
      ExtractJwt.fromAuthHeaderAsBearerToken()(request) ?? request.cookies?.access_token;
    if (token) {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      await this.authService.logout(payload.sessionId);
    }
    response.clearCookie("access_token");
    return { success: true };
  }
}
