export interface WasteCategory {
  id: string;
  name: string;
  image: string;
  href: string;
  items: string[];
}

export const CATEGORY_IMAGES: Record<string, string> = {
  plastic: "/assets/category/icon-plastic.png",
  paper: "/assets/category/icon-paper.svg",
  glass: "/assets/category/icon-glass.svg",
  can: "/assets/category/icon-can.png",
  food: "/assets/category/icon-food.png",
  styrofoam: "/assets/category/icon-styrofoam.png",
  clothes: "/assets/category/icon-clothes.svg",
  lamp: "/assets/category/icon-bulb.svg",
  battery: "/assets/category/icon-battery.png",
};

export function getCategoryImage(categoryId: string): string {
  return CATEGORY_IMAGES[categoryId] ?? CATEGORY_IMAGES.plastic;
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: "plastic",
    name: "플라스틱",
    image: CATEGORY_IMAGES.plastic,
    href: "/category",
    items: ["PET병", "플라스틱 용기", "비닐봉투", "샴푸·린스 통", "요구르트병", "플라스틱 뚜껑"],
  },
  {
    id: "paper",
    name: "종이·박스",
    image: CATEGORY_IMAGES.paper,
    href: "/category",
    items: [
      "종이박스",
      "신문지",
      "책자·노트",
      "골판지",
      "종이팩",
      "종이봉투",
      "광고 전단지",
      "은박지",
    ],
  },
  {
    id: "glass",
    name: "유리",
    image: CATEGORY_IMAGES.glass,
    href: "/category",
    items: ["유리병", "향수병", "유리잔", "거울", "냄비유리뚜껑", "내열식기류", "도자기류"],
  },
  {
    id: "can",
    name: "캔·고철",
    image: CATEGORY_IMAGES.can,
    href: "/category",
    items: ["알루미늄 캔", "철캔", "고철·철사", "부탄가스 캔"],
  },
  {
    id: "food",
    name: "음식물",
    image: CATEGORY_IMAGES.food,
    href: "/category",
    items: [
      "야채",
      "과일 껍질",
      "남은 음식",
      "차 찌꺼기",
      "달걀 껍질",
      "견과류 껍질",
      "어패류 껍데기",
      "한약재",
      "뼈",
      "핵과류의 씨",
    ],
  },
  {
    id: "styrofoam",
    name: "스티로폼",
    image: CATEGORY_IMAGES.styrofoam,
    href: "/category",
    items: ["스티로폼 박스", "완충재", "스티로폼 트레이", "가전 포장재"],
  },
  {
    id: "clothes",
    name: "의류",
    image: CATEGORY_IMAGES.clothes,
    href: "/category",
    items: ["헌 옷", "바지·셔츠", "수건", "이불·담요", "가방"],
  },
  {
    id: "lamp",
    name: "형광등",
    image: CATEGORY_IMAGES.lamp,
    href: "/category",
    items: ["형광등", "삼파등", "LED 형광등", "깨진 형광등"],
  },
  {
    id: "battery",
    name: "건전지",
    image: CATEGORY_IMAGES.battery,
    href: "/category",
    items: ["건전지(AA·AAA)", "리튬 배터리", "휴대폰 배터리", "충전지"],
  },
];
