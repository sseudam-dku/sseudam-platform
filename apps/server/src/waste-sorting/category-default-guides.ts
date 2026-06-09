export interface CategoryDefaultGuide {
  method: string;
  caution: string;
}

export const CATEGORY_DEFAULT_GUIDES: Record<string, CategoryDefaultGuide> = {
  plastic: {
    method: "내용물을 깨끗이 비우고 압착한 후 뚜껑을 제거하여 플라스틱 수거함에 배출하세요.",
    caution: "이물질이 많이 묻은 경우 일반쓰레기로 배출하세요.",
  },
  paper: {
    method: "테이프·스티커를 제거한 후 묶어서 배출하거나 종이 수거함에 넣으세요.",
    caution: "음식물이 묻은 종이는 일반쓰레기로 배출하세요.",
  },
  glass: {
    method: "내용물을 비우고 깨끗이 씻은 후 유리 수거함에 배출하세요.",
    caution: "깨진 유리는 신문지에 싸서 일반쓰레기로 배출하세요.",
  },
  can: {
    method: "내용물을 비우고 가볍게 씻은 후 캔 수거함에 배출하세요.",
    caution: "부탄가스 등 압축가스 캔은 구멍을 뚫어 배출하세요.",
  },
  food: {
    method: "물기를 최대한 제거하여 음식물 전용 봉투나 수거함에 배출하세요.",
    caution: "뼈, 조개껍데기, 과일씨 등은 일반쓰레기로 배출하세요.",
  },
  styrofoam: {
    method: "내용물을 비우고 이물질을 제거한 후 스티로폼 수거함에 배출하세요.",
    caution: "색이 들어간 스티로폼은 일반쓰레기로 배출하세요.",
  },
  clothes: {
    method: "헌옷 수거함이나 의류 기증 센터에 배출하세요.",
    caution: "속옷, 양말 등 재사용이 어려운 의류는 일반쓰레기로 배출하세요.",
  },
  lamp: {
    method: "형광등 전용 수거함 또는 주민센터에 배출하세요.",
    caution: "깨진 형광등은 신문지에 감싸 형광등 수거함에 배출하세요.",
  },
  battery: {
    method: "건전지 전용 수거함(마트, 주민센터 등)에 배출하세요.",
    caution: "리튬·니카드 배터리는 별도 수거함에 배출하세요.",
  },
};
