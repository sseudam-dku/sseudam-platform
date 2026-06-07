import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HealthResponseDto } from "./core/swagger/health-response.dto";

@ApiTags("health")
@Controller()
export class AppController {
  @Get("health")
  @ApiOperation({
    summary: "서버 상태 확인",
    description: "API 서버가 정상 동작 중인지 확인합니다. DB 연결 상태는 포함하지 않습니다.",
  })
  @ApiResponse({ status: 200, description: "서버 정상", type: HealthResponseDto })
  health() {
    return {
      status: "ok",
      service: "sseudam-server",
    };
  }
}
