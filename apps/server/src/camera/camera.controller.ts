import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../core/decorators/current-user.decorator";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { CameraService } from "./camera.service";
import { AnalyzeImageDto } from "./dto/analyze-image.dto";
import { CameraAnalysisResponseDto } from "./dto/camera-analysis-response.dto";

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
}

@ApiTags("camera")
@Controller("camera")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access-token")
@ApiUnauthorizedResponse({ description: "로그인이 필요합니다" })
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Post("analyze")
  @ApiOperation({
    summary: "이미지 업로드 → AI 분류",
    description:
      "촬영/업로드한 쓰레기 이미지를 OpenAI Vision으로 분석합니다. " +
      "품목명, 카테고리, 구성 부품, 단계별 배출 방법을 반환합니다. <br/>" +
      "최대 10MB. ",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: AnalyzeImageDto })
  @ApiResponse({ status: 201, description: "분석 성공", type: CameraAnalysisResponseDto })
  @ApiResponse({ status: 400, description: "image 파일 누락" })
  @ApiServiceUnavailableResponse({ description: "OPENAI_API_KEY 미설정" })
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  analyzeImage(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: UploadedImageFile | undefined,
  ) {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }
    const city = user.city ?? "서울";
    const district = user.district ?? "중구";
    const mimeType = file.mimetype || "image/jpeg";
    return this.cameraService.analyzeImage(file.buffer, mimeType, city, district);
  }
}
