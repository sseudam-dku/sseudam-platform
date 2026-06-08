import { ApiProperty } from "@nestjs/swagger";

export class AuthUserResponseDto {
  @ApiProperty({ description: "사용자 UUID", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" })
  id!: string;

  @ApiProperty({ description: "Google 계정 이메일", example: "user@example.com" })
  email!: string;

  @ApiProperty({ description: "닉네임 (Google 프로필 이름)", example: "홍길동", nullable: true })
  nickname!: string | null;

  @ApiProperty({ description: "프로필 이미지 URL", nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ description: "설정된 시/도", example: "서울", nullable: true })
  city!: string | null;

  @ApiProperty({ description: "설정된 구", example: "중구", nullable: true })
  district!: string | null;
}

export class AuthLoginResponseDto {
  @ApiProperty({
    description: "JWT 액세스 토큰. Authorization: Bearer {token} 또는 access_token 쿠키로 전달",
  })
  accessToken!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({ description: "로그아웃 성공 여부", example: true })
  success!: boolean;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: "새 JWT 액세스 토큰. Authorization: Bearer {token} 또는 access_token 쿠키로 전달",
  })
  accessToken!: string;
}
