export const WASTE_TYPES = [
  "PAPER",
  "PLASTIC",
  "PET",
  "VINYL_FILM",
  "STYROFOAM",
  "GLASS",
  "METAL",
  "TEXTILES",
  "E_WASTE",
  "HAZARDOUS_SMALL_WASTE",
  "FOOD_WASTE",
  "NON_RECYCLABLE",
  "BULKY_WASTE",
  "UNKNOWN",
] as const;

export type WasteType = (typeof WASTE_TYPES)[number];

export const ITEMS_BY_TYPE: Partial<Record<WasteType, string[]>> = {};

export const WASTE_TYPE_LABELS: Record<WasteType, string> = {
  PAPER: "종이",
  PLASTIC: "플라스틱",
  PET: "PET(페트)",
  VINYL_FILM: "비닐",
  STYROFOAM: "스티로폼",
  GLASS: "유리",
  METAL: "금속(캔·고철)",
  TEXTILES: "의류·섬유",
  E_WASTE: "전자폐기물",
  HAZARDOUS_SMALL_WASTE: "유해·위험 소형폐기물",
  FOOD_WASTE: "음식물",
  NON_RECYCLABLE: "일반쓰레기",
  BULKY_WASTE: "대형폐기물",
  UNKNOWN: "분류 불가",
};

export const WASTE_TYPE_TO_CATEGORY_ID: Record<WasteType, string> = {
  PAPER: "paper",
  PLASTIC: "plastic",
  PET: "plastic",
  VINYL_FILM: "plastic",
  STYROFOAM: "styrofoam",
  GLASS: "glass",
  METAL: "can",
  TEXTILES: "clothes",
  E_WASTE: "lamp",
  HAZARDOUS_SMALL_WASTE: "battery",
  FOOD_WASTE: "food",
  NON_RECYCLABLE: "plastic",
  BULKY_WASTE: "plastic",
  UNKNOWN: "plastic",
};

export const CAMERA_MODEL = "gpt-4o-mini";
export const CAMERA_TEMPERATURE = 0.2;
export const CAMERA_MAX_TOKENS = 1500;
