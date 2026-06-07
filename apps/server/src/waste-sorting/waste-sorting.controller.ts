import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryDetailQueryDto } from "./dto/category-detail-query.dto";
import {
  WasteCategoryDetailResponseDto,
  WasteCategoryResponseDto,
} from "./dto/waste-category-response.dto";
import { WasteSortingService } from "./waste-sorting.service";

@ApiTags("waste-sorting")
@Controller("waste-sorting")
export class WasteSortingController {
  constructor(private readonly wasteSortingService: WasteSortingService) {}

  @Get("categories")
  @ApiOperation({
    summary: "카테고리 목록 조회",
    description: "분리배출 카테고리 전체 목록을 반환합니다. 인증 불필요. ",
  })
  @ApiResponse({
    status: 200,
    description: "카테고리 목록 (plastic, paper, glass, can, food, styrofoam 등)",
    type: [WasteCategoryResponseDto],
  })
  findAllCategories() {
    return this.wasteSortingService.findAllCategories();
  }

  @Get("categories/:id")
  @ApiOperation({
    summary: "카테고리별 배출 방법 조회",
    description:
      "지정 카테고리의 지역별 배출 방법과 주의사항을 반환합니다. " +
      "DATA_GO_KR_API_KEY 설정 시 행정안전부 생활쓰레기배출정보 API를 우선 조회하고, " +
      "실패 시 DB 시드 데이터(fallback)를 사용합니다. source 필드로 출처 확인 가능. ",
  })
  @ApiParam({
    name: "id",
    description: "카테고리 ID",
    example: "plastic",
    enum: ["plastic", "paper", "glass", "can", "food", "styrofoam", "clothes", "lamp", "battery"],
  })
  @ApiResponse({ status: 200, description: "카테고리 상세", type: WasteCategoryDetailResponseDto })
  @ApiNotFoundResponse({ description: "존재하지 않는 카테고리 ID" })
  findCategoryDetail(@Param("id") id: string, @Query() query: CategoryDetailQueryDto) {
    const city = query.city ?? "서울";
    const district = query.district ?? "중구";
    return this.wasteSortingService.findCategoryDetail(id, city, district);
  }
}
