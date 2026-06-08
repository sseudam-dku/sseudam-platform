import { ApiProperty } from "@nestjs/swagger";

export class HealthResponseDto {
  @ApiProperty({ description: "서버 상태", example: "ok" })
  status!: string;

  @ApiProperty({ description: "서비스 이름", example: "sseudam-server" })
  service!: string;
}
