import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { QueryResultRow } from "pg";
import { InMemoryCacheService } from "../core/cache/in-memory-cache.service";
import { DatabaseService } from "../database.service";
import { CATEGORY_DEFAULT_GUIDES } from "./category-default-guides";
import { RegionalWasteInfo, SeoulWasteApiService } from "./seoul-waste-api.service";

interface CategoryRow extends QueryResultRow {
  id: string;
  name: string;
}

interface GuideRow extends QueryResultRow {
  method: string;
  caution: string;
  schedule: string | null;
  no_collect_day: string | null;
  disposal_place: string | null;
  disposal_place_type: string | null;
  disposal_time_start: string | null;
  disposal_time_end: string | null;
  management_zone: string | null;
  general_waste_method: string | null;
  general_waste_schedule: string | null;
}

export interface WasteCategory {
  id: string;
  name: string;
  href: string;
}

export interface WasteCategoryDetail extends WasteCategory {
  district: string;
  displayLocation: string;
  method: string;
  schedule: string | null;
  noCollectDay: string | null;
  disposalPlace: string | null;
  disposalPlaceType: string | null;
  disposalTimeStart: string | null;
  disposalTimeEnd: string | null;
  managementZone: string | null;
  generalWasteMethod: string | null;
  generalWasteSchedule: string | null;
  caution: string;
  source: "api" | "fallback";
}

const WASTE_GUIDE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour for faster updates

/**
 * Provides waste sorting categories and region-aware disposal guides.
 */
@Injectable()
export class WasteSortingService implements OnModuleInit {
  private readonly logger = new Logger(WasteSortingService.name);
  private cachedCategories: WasteCategory[] | null = null;

  constructor(
    private readonly database: DatabaseService,
    private readonly seoulWasteApiService: SeoulWasteApiService,
    private readonly cache: InMemoryCacheService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.cachedCategories = await this.loadCategoriesFromDb();
  }

  async findAllCategories(): Promise<WasteCategory[]> {
    if (this.cachedCategories) {
      return this.cachedCategories;
    }
    this.cachedCategories = await this.loadCategoriesFromDb();
    return this.cachedCategories;
  }

  async findCategoryDetail(
    categoryId: string,
    city: string,
    district: string,
  ): Promise<WasteCategoryDetail> {
    const cacheKey = this.buildGuideCacheKey(city, district, categoryId);
    const cached = this.cache.get<WasteCategoryDetail>(cacheKey);
    if (cached) {
      return cached;
    }
    const { rows } = await this.database.query<CategoryRow>(
      "SELECT id, name FROM waste_categories WHERE id = $1",
      [categoryId],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Category not found: ${categoryId}`);
    }
    const apiGuide = await this.seoulWasteApiService.fetchRegionalGuide(city, district, categoryId);
    if (apiGuide) {
      this.logger.log(
        `Successfully fetched guide from API for ${city} ${district} (${categoryId})`,
      );
      const detail = this.buildCategoryDetailFromApi(rows[0], city, district, apiGuide);
      this.cache.set(cacheKey, detail, WASTE_GUIDE_CACHE_TTL_MS);
      return detail;
    }

    this.logger.warn(
      `API guide not found for ${city} ${district} (${categoryId}). Using default fallback.`,
    );
    const fallback = this.getDefaultGuide(categoryId);
    const detail = this.buildCategoryDetail(rows[0], city, district, fallback, "fallback");
    this.cache.set(cacheKey, detail, WASTE_GUIDE_CACHE_TTL_MS);
    return detail;
  }

  private buildGuideCacheKey(city: string, district: string, categoryId: string): string {
    return `waste-guide:v2:${city}:${district}:${categoryId}`;
  }

  private async loadCategoriesFromDb(): Promise<WasteCategory[]> {
    const { rows } = await this.database.query<CategoryRow>(
      "SELECT id, name FROM waste_categories ORDER BY sort_order ASC",
    );
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      href: "/category",
    }));
  }

  private buildCategoryDetailFromApi(
    category: CategoryRow,
    city: string,
    district: string,
    apiGuide: RegionalWasteInfo,
  ): WasteCategoryDetail {
    return {
      id: category.id,
      name: category.name,
      href: "/category",
      district,
      displayLocation: `${city} ${district}`,
      method: apiGuide.method,
      schedule: apiGuide.schedule,
      noCollectDay: apiGuide.noCollectDay,
      disposalPlace: apiGuide.disposalPlace,
      disposalPlaceType: apiGuide.disposalPlaceType,
      disposalTimeStart: apiGuide.disposalTimeStart,
      disposalTimeEnd: apiGuide.disposalTimeEnd,
      managementZone: apiGuide.managementZone,
      generalWasteMethod: apiGuide.generalWasteMethod,
      generalWasteSchedule: apiGuide.generalWasteSchedule,
      caution: apiGuide.caution,
      source: apiGuide.source,
    };
  }

  private buildCategoryDetail(
    category: CategoryRow,
    city: string,
    district: string,
    guide: GuideRow,
    source: "api" | "fallback",
  ): WasteCategoryDetail {
    return {
      id: category.id,
      name: category.name,
      href: "/category",
      district,
      displayLocation: `${city} ${district}`,
      method: guide.method,
      schedule: guide.schedule,
      noCollectDay: guide.no_collect_day,
      disposalPlace: guide.disposal_place,
      disposalPlaceType: guide.disposal_place_type,
      disposalTimeStart: guide.disposal_time_start,
      disposalTimeEnd: guide.disposal_time_end,
      managementZone: guide.management_zone,
      generalWasteMethod: guide.general_waste_method,
      generalWasteSchedule: guide.general_waste_schedule,
      caution: guide.caution,
      source,
    };
  }

  private getDefaultGuide(categoryId: string): GuideRow {
    const categoryGuide = CATEGORY_DEFAULT_GUIDES[categoryId];
    return {
      method: categoryGuide?.method ?? "지역별 분리배출 규정을 확인해 주세요.",
      caution: categoryGuide?.caution ?? "구청 홈페이지에서 세부 배출 방법을 확인할 수 있습니다.",
      schedule: null,
      no_collect_day: null,
      disposal_place: null,
      disposal_place_type: null,
      disposal_time_start: null,
      disposal_time_end: null,
      management_zone: null,
      general_waste_method: null,
      general_waste_schedule: null,
    };
  }
}
