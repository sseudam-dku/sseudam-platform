interface Stat {
  label: string;
  value: string;
  color: string;
}

interface Category {
  name: string;
  percent: number;
  color: string;
}

interface Badge {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  reward: string;
  earned: boolean;
}

interface Activity {
  date: string;
  category: string;
  points: number;
}

interface MockRecord {
  id: string;
  date: string;
  category: string;
  name: string;
  points: number;
  status: string;
  emoji: string;
}

interface HomeCategory {
  id: string;
  name: string;
  emoji: string;
  href: string;
}

interface QuickAction {
  emoji: string;
  label: string;
}

const STATS: Stat[] = [
  { label: "분리배출", value: "24회", color: "text-green-500" },
  { label: "획득 포인트", value: "250P", color: "text-amber-500" },
  { label: "이번 달", value: "8회", color: "text-blue-500" },
  { label: "연속 달성", value: "3일", color: "text-rose-500" },
];

const CATEGORIES: Category[] = [
  { name: "플라스틱", percent: 45, color: "bg-orange-400" },
  { name: "종이·박스", percent: 30, color: "bg-blue-400" },
  { name: "캔·금속", percent: 15, color: "bg-yellow-400" },
  { name: "유리", percent: 10, color: "bg-teal-400" },
];

const BADGES: Badge[] = [
  {
    id: "1",
    name: "연속 3일",
    emoji: "🔥",
    image: "/assets/badge/3days-master-badge.svg",
    description: "서비스에 3일 연속 빠짐없이 쓰레기 촬영을 완료한 경우",
    reward: "+300P",
    earned: true,
  },
  {
    id: "2",
    name: "분리수거 마스터",
    emoji: "🏆",
    image: "/assets/badge/all-trash-master-badge.svg",
    description: "서비스에 등록된 모든 종류의 쓰레기를 최소 한 번씩 모두 사진 촬영을 완료한 경우",
    reward: "+500P",
    earned: true,
  },
  {
    id: "3",
    name: "비닐 수집가",
    emoji: "🛍️",
    image: "/assets/badge/vinyl-master-badge.svg",
    description: "'비닐' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우",
    reward: "+100P",
    earned: false,
  },
  {
    id: "4",
    name: "플라스틱 수집가",
    emoji: "🧴",
    image: "/assets/badge/plastic-master-badge.svg",
    description: "'플라스틱' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우",
    reward: "+100P",
    earned: true,
  },
  {
    id: "5",
    name: "종이 수집가",
    emoji: "📦",
    image: "/assets/badge/paper-master-badge.svg",
    description: "'종이' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우",
    reward: "+100P",
    earned: false,
  },
];

const ACTIVITY: Activity[] = [
  { date: "2024.05.28", category: "플라스틱 분리배출", points: 10 },
  { date: "2024.05.27", category: "종이·박스 분리배출", points: 10 },
  { date: "2024.05.26", category: "캔·금속 분리배출", points: 15 },
  { date: "2024.05.25", category: "유리 분리배출", points: 20 },
  { date: "2024.05.24", category: "플라스틱 분리배출", points: 10 },
];

const MOCK_RECORDS: MockRecord[] = [
  {
    id: "1",
    date: "2026-06-07 14:30",
    category: "플라스틱",
    name: "생수 페트병",
    points: 10,
    status: "success",
    emoji: "🧴",
  },
  {
    id: "2",
    date: "2026-06-06 09:15",
    category: "종이·박스",
    name: "택배 상자",
    points: 10,
    status: "success",
    emoji: "📦",
  },
  {
    id: "3",
    date: "2026-06-05 18:45",
    category: "캔·고철",
    name: "알루미늄 음료 캔",
    points: 15,
    status: "success",
    emoji: "🥫",
  },
  {
    id: "4",
    date: "2026-06-04 11:20",
    category: "유리",
    name: "유리 음료 병",
    points: 20,
    status: "success",
    emoji: "🍶",
  },
  {
    id: "5",
    date: "2026-06-03 13:05",
    category: "스티로폼",
    name: "배송용 스티로폼 상자",
    points: 10,
    status: "success",
    emoji: "📫",
  },
];

const HOME_CATEGORIES: HomeCategory[] = [
  { id: "plastic", name: "플라스틱", emoji: "🧴", href: "/category" },
  { id: "paper", name: "종이·박스", emoji: "📦", href: "/category" },
  { id: "glass", name: "유리", emoji: "🍶", href: "/category" },
  { id: "can", name: "캔·고철", emoji: "🥫", href: "/category" },
  { id: "food", name: "음식물", emoji: "🥦", href: "/category" },
  { id: "styrofoam", name: "스티로폼", emoji: "📫", href: "/category" },
];

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: "🧴", label: "플라스틱 배출 방법 알려줘" },
  { emoji: "📍", label: "내 지역 규정 알려줘" },
  { emoji: "♻️", label: "재활용 마크 설명해줘" },
];

const MOCK_REPLIES: Record<string, string> = {
  default: "죄송해요, 아직 개발 중인 기능이에요. 곧 더 많은 답변을 드릴 수 있을 거예요!",
  "플라스틱 배출 방법 알려줘":
    "플라스틱은 내용물을 비우고 압착한 후 플라스틱 수거함에 배출하세요. 뚜껑은 제거하고, 이물질이 많으면 일반쓰레기로 배출합니다.",
  "내 지역 규정 알려줘":
    "서울 마포구 기준으로 분리배출 안내를 드리고 있어요. 지역별 세부 규정은 구청 홈페이지에서 확인하실 수 있어요.",
  "재활용 마크 설명해줘":
    "재활용 마크는 재활용 가능 여부와 소재를 표시해요. 삼각형 안의 숫자로 플라스틱 종류를 구분할 수 있어요.",
};

const MOCK_DATA = {
  STATS,
  CATEGORIES,
  BADGES,
  ACTIVITY,
  MOCK_RECORDS,
  HOME_CATEGORIES,
  QUICK_ACTIONS,
  MOCK_REPLIES,
};

export default MOCK_DATA;
