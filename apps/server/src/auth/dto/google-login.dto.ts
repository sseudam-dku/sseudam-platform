import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @ApiProperty({
    description:
      "Google Identity Services에서 발급받은 ID 토큰(credential). @react-oauth/google의 GoogleLogin onSuccess 응답에서 credential 필드 값",
    example: "eyJhbGciOiJSUzI1NiIs...",
  })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
