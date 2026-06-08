import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface HouseholdWasteItem {
  CTPV_NM?: string;
  SGG_NM?: string;
  MNG_ZONE_NM?: string;
  MNG_ZONE_TRGT_RGN_NM?: string;
  EMSN_PLC?: string;
  EMSN_PLC_TYPE?: string;
  RCYCL_EMSN_MTHD?: string;
  FOD_WST_EMSN_MTHD?: string;
  LF_WST_EMSN_MTHD?: string;
  RCYCL_EMSN_DOW?: string;
  FOD_WST_EMSN_DOW?: string;
  LF_WST_EMSN_DOW?: string;
  RCYCL_EMSN_BGNG_TM?: string;
  RCYCL_EMSN_END_TM?: string;
  FOD_WST_EMSN_BGNG_TM?: string;
  FOD_WST_EMSN_END_TM?: string;
  LF_WST_EMSN_BGNG_TM?: string;
  LF_WST_EMSN_END_TM?: string;
  NCLCT_DAY?: string;
  UNCLLT_DAY?: string;
}

interface HouseholdWasteItemsWrapper {
  item?: HouseholdWasteItem[] | HouseholdWasteItem;
}

interface HouseholdWasteResponse {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: HouseholdWasteItem[] | HouseholdWasteItem | HouseholdWasteItemsWrapper;
      totalCount?: number;
    };
  };
}

export interface RegionalWasteInfo {
  method: string;
  caution: string;
  schedule: string | null;
  noCollectDay: string | null;
  disposalPlace: string | null;
  disposalPlaceType: string | null;
  disposalTimeStart: string | null;
  disposalTimeEnd: string | null;
  managementZone: string | null;
  generalWasteMethod: string | null;
  generalWasteSchedule: string | null;
  source: "api" | "fallback";
}

const RECYCLABLE_CATEGORY_IDS = new Set([
  "plastic",
  "paper",
  "glass",
  "can",
  "styrofoam",
  "clothes",
]);

const PLACEHOLDER_API_KEY_PATTERN = /your-data-go-kr-api-key|placeholder|changeme/i;

/**
 * Fetches regional waste disposal info from the public data API.
 */
@Injectable()
export class SeoulWasteApiService {
  private readonly logger = new Logger(SeoulWasteApiService.name);
  private readonly apiKey: string | undefined;
  private readonly baseUrl = "https://apis.data.go.kr/1741000/household_waste_info/info";

  constructor(configService: ConfigService) {
    this.apiKey = configService.get<string>("DATA_GO_KR_API_KEY");
  }

  async fetchRegionalGuide(
    city: string,
    district: string,
    categoryId: string,
  ): Promise<RegionalWasteInfo | null> {
    if (!this.isApiKeyConfigured()) {
      return null;
    }
    const searchTerms = this.buildSearchTerms(city, district);
    for (const searchTerm of searchTerms) {
      const result = await this.fetchByDistrict(searchTerm, city, district, categoryId);
      if (result) {
        return result;
      }
    }
    return null;
  }

  private isApiKeyConfigured(): boolean {
    if (!this.apiKey?.trim()) {
      return false;
    }
    return !PLACEHOLDER_API_KEY_PATTERN.test(this.apiKey);
  }

  private buildSearchTerms(city: string, district: string): string[] {
    const normalized = district.replace(/구$/, "").trim();
    const withGu = district.endsWith("구") ? district : `${district}구`;
    const cityPrefix = city.trim();
    return [
      ...new Set([
        withGu,
        district,
        normalized,
        cityPrefix ? `${cityPrefix} ${withGu}` : "",
        cityPrefix ? `${cityPrefix.replace("서울", "서울특별시")} ${withGu}` : "",
        cityPrefix ? `${cityPrefix.replace("서울특별시", "서울")} ${withGu}` : "",
      ]),
    ].filter(Boolean);
  }

  private async fetchByDistrict(
    searchTerm: string,
    city: string,
    district: string,
    categoryId: string,
  ): Promise<RegionalWasteInfo | null> {
    try {
      const url = this.buildRequestUrl(searchTerm);
      const response = await fetch(url);
      if (!response.ok) {
        this.logger.warn(
          `Household waste API HTTP ${response.status} for searchTerm=${searchTerm}`,
        );
        return null;
      }
      const data = (await response.json()) as HouseholdWasteResponse;
      const resultCode = data.response?.header?.resultCode;
      if (resultCode && resultCode !== "00") {
        this.logger.warn(
          `Household waste API error ${resultCode}: ${data.response?.header?.resultMsg ?? "unknown"}`,
        );
        return null;
      }
      const itemList = this.parseItemList(data.response?.body?.items);
      if (itemList.length === 0) {
        return null;
      }
      const target = this.selectTarget(itemList, city, district);
      if (!target) {
        return null;
      }
      const method = this.extractMethod(target, categoryId);
      const schedule = this.formatScheduleValue(this.extractSchedule(target, categoryId));
      const disposalTime = this.extractDisposalTime(target, categoryId);
      const noCollectDay = this.formatScheduleValue(
        this.trimOrNull(target.NCLCT_DAY) ?? this.trimOrNull(target.UNCLLT_DAY),
      );
      const managementZone =
        this.trimOrNull(target.MNG_ZONE_TRGT_RGN_NM) ?? this.trimOrNull(target.MNG_ZONE_NM);
      return {
        method: method || "지역별 재활용 배출 안내를 확인해 주세요.",
        caution: "세부 규정은 구청 홈페이지에서 확인하세요.",
        schedule,
        noCollectDay,
        disposalPlace: this.trimOrNull(target.EMSN_PLC),
        disposalPlaceType: this.trimOrNull(target.EMSN_PLC_TYPE),
        disposalTimeStart: disposalTime.start,
        disposalTimeEnd: disposalTime.end,
        managementZone,
        generalWasteMethod: this.trimOrNull(target.LF_WST_EMSN_MTHD),
        generalWasteSchedule: this.formatScheduleValue(this.trimOrNull(target.LF_WST_EMSN_DOW)),
        source: "api",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.warn(`Household waste API error: ${message}`);
      return null;
    }
  }

  private parseItemList(
    items: HouseholdWasteItem[] | HouseholdWasteItem | HouseholdWasteItemsWrapper | undefined,
  ): HouseholdWasteItem[] {
    if (!items) {
      return [];
    }
    if (Array.isArray(items)) {
      return items;
    }
    if ("item" in items && items.item) {
      return Array.isArray(items.item) ? items.item : [items.item];
    }
    return [items as HouseholdWasteItem];
  }

  private selectTarget(
    itemList: HouseholdWasteItem[],
    city: string,
    district: string,
  ): HouseholdWasteItem | null {
    const strictMatches = itemList.filter(item => this.matchesLocation(item, city, district, true));
    if (strictMatches[0]) {
      return strictMatches[0];
    }
    const districtMatches = itemList.filter(item =>
      this.matchesLocation(item, city, district, false),
    );
    return districtMatches[0] ?? null;
  }

  private matchesLocation(
    item: HouseholdWasteItem,
    city: string,
    district: string,
    requireCityMatch: boolean,
  ): boolean {
    const sgg = this.trimOrNull(item.SGG_NM) ?? "";
    const ctpv = this.trimOrNull(item.CTPV_NM) ?? "";
    const districtGu = district.endsWith("구") ? district : `${district}구`;
    const sggMatches = sgg === districtGu || sgg === district;
    if (!sggMatches) {
      return false;
    }
    if (!requireCityMatch || !city.trim()) {
      return true;
    }
    const cityVariants = [
      city.trim(),
      city.replace("서울", "서울특별시"),
      city.replace("서울특별시", "서울"),
      `${city.trim()}특별시`,
      `${city.trim()}광역시`,
    ];
    return cityVariants.some(variant => ctpv.includes(variant) || variant.includes(ctpv));
  }

  private buildRequestUrl(searchTerm: string): string {
    const params = new URLSearchParams({
      pageNo: "1",
      numOfRows: "100",
      returnType: "json",
    });
    params.set("cond[SGG_NM::LIKE]", searchTerm);
    const serviceKey = this.formatServiceKey(this.apiKey!);
    return `${this.baseUrl}?serviceKey=${serviceKey}&${params.toString()}`;
  }

  private formatServiceKey(apiKey: string): string {
    if (apiKey.includes("%")) {
      return apiKey;
    }
    return encodeURIComponent(apiKey);
  }

  private trimOrNull(value: string | undefined): string | null {
    const trimmed = value?.trim();
    if (!trimmed || trimmed === "없음") {
      return null;
    }
    return trimmed;
  }

  private formatScheduleValue(value: string | null): string | null {
    if (!value) {
      return null;
    }
    return value.replace(/\+/g, "·");
  }

  private extractDisposalTime(
    item: HouseholdWasteItem,
    categoryId: string,
  ): { start: string | null; end: string | null } {
    if (categoryId === "food") {
      return {
        start: this.trimOrNull(item.FOD_WST_EMSN_BGNG_TM),
        end: this.trimOrNull(item.FOD_WST_EMSN_END_TM),
      };
    }
    if (RECYCLABLE_CATEGORY_IDS.has(categoryId)) {
      return {
        start: this.trimOrNull(item.RCYCL_EMSN_BGNG_TM),
        end: this.trimOrNull(item.RCYCL_EMSN_END_TM),
      };
    }
    return {
      start: this.trimOrNull(item.LF_WST_EMSN_BGNG_TM),
      end: this.trimOrNull(item.LF_WST_EMSN_END_TM),
    };
  }

  private extractMethod(item: HouseholdWasteItem, categoryId: string): string {
    if (categoryId === "food") {
      return item.FOD_WST_EMSN_MTHD?.trim() ?? "";
    }
    if (RECYCLABLE_CATEGORY_IDS.has(categoryId)) {
      return item.RCYCL_EMSN_MTHD?.trim() ?? "";
    }
    return (
      item.RCYCL_EMSN_MTHD?.trim() ||
      item.LF_WST_EMSN_MTHD?.trim() ||
      item.FOD_WST_EMSN_MTHD?.trim() ||
      ""
    );
  }

  private extractSchedule(item: HouseholdWasteItem, categoryId: string): string {
    if (categoryId === "food") {
      return item.FOD_WST_EMSN_DOW?.trim() ?? "";
    }
    if (RECYCLABLE_CATEGORY_IDS.has(categoryId)) {
      return item.RCYCL_EMSN_DOW?.trim() ?? "";
    }
    return (
      item.RCYCL_EMSN_DOW?.trim() ||
      item.LF_WST_EMSN_DOW?.trim() ||
      item.FOD_WST_EMSN_DOW?.trim() ||
      ""
    );
  }
}
