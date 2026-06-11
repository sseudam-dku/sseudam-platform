# 쓰담 (Sseudam) ♻️

> **AI 기반 올바른 분리배출 도우미 PWA** — 사진 한 장으로 헷갈리는 분리배출을 즉시 알려주고, 습관이 되도록 기록·포인트·뱃지로 동기를 부여합니다.
<img width="1920" height="1080" alt="처음 장표" src="https://github.com/user-attachments/assets/d8dd8716-9e2b-4d57-a7e0-49a5cc1c6f8d" />



---

## 1. 프로젝트 소개

### 기획 배경

분리배출은 누구나 매일 하지만, **"이건 무슨 쓰레기지?"** 하고 망설이는 순간이 잦습니다. 품목마다, 지자체마다 기준이 달라 잘못 버려지는 경우가 많고, 이는 곧 재활용률 저하로 이어집니다.

**쓰담**은 이런 일상의 작은 고민을 **AI 카메라**로 즉시 해결하고, 올바른 분리배출이 **꾸준한 습관**이 되도록 돕는 모바일 웹 서비스입니다.

### 해결하려는 문제

- 🤔 품목별로 헷갈리는 분리배출 기준 → **사진으로 즉시 판별**
- 📖 흩어져 있는 분리배출 정보 → **카테고리별 가이드 + 서울시 공공데이터**
- 😴 동기 부여 부족 → **기록 · 포인트 · 뱃지**로 지속 가능한 실천 유도

---

## 2. 주요 기능

### 📷 AI 카메라 분리배출 인식

쓰레기 사진을 촬영하면 **OpenAI Vision(gpt-4o-mini)** 이 품목을 분석해 분리배출 유형을 알려줍니다.

- 14종 분리배출 유형 분류: 종이 · 플라스틱 · PET · 비닐 · 스티로폼 · 유리 · 금속 · 의류/섬유 · 전자폐기물 · 유해 소형폐기물 · 음식물 · 일반쓰레기 · 대형폐기물 · 분류 불가
- 인식 결과에 맞는 배출 방법 가이드 연결
  
<img width="1920" height="1080" alt="핵심 기능 소개" src="https://github.com/user-attachments/assets/dcc60c1f-11a1-4f44-b946-b47266344fd3" />


### 📚 분리배출 카테고리 가이드

카테고리별 올바른 배출 방법을 정리해 제공합니다.

- **서울시 가정용 폐기물 공공데이터 API** 연동으로 품목 검색 지원
- 기본 가이드(category default guides) + 공공데이터 응답 결합

<img width="1920" height="1080" alt="Group 7" src="https://github.com/user-attachments/assets/30cccff5-12aa-4e0b-b3a1-8c681b2e0704" />


### 💬 AI 챗봇

분리배출 관련 궁금증을 자연어로 묻고 답을 받습니다.

- **OpenAI(gpt-4o-mini)** 기반 대화형 Q&A
- 세션 기반 대화 기록 저장 / 비회원(guest) 질문 지원
- **가드레일(Guardrails)** 내장 — 탈옥(jailbreak) · 프롬프트 인젝션 · 유해 콘텐츠 · 시스템 프롬프트 유출 방어(한/영 패턴 대응)

<img width="1920" height="1080" alt="핵심 기능 소개" src="https://github.com/user-attachments/assets/957fa359-851f-4d42-9370-2adf5a044428" />


### 📍 GPS 기반 위치 설정

GPS로 현재 위치의 지자체를 자동 인식하고, 검색을 통해 원하는 지역도 직접 설정할 수 있습니다. 지역마다 다른 분리배출 규정과 수거 일정까지 맞춤으로 안내합니다.

<img width="1920" height="1080" alt="핵심 기능 소개" src="https://github.com/user-attachments/assets/c68f36d7-8706-4c9b-81ab-98e1b11a5fd7" />


---

## 3. 기능 스크린샷

1️⃣ 홈 대시보드 — 오늘의 팁 + 카테고리 바로가기

2️⃣ AI 카메라 분리배출 인식 — Vision으로 14종 판별

3️⃣ AI 챗봇 — Q&A

4️⃣ 분리배출 카테고리 가이드 — 서울시 공공데이터 연동

5️⃣ 최근 기록 — 활동 내역

6️⃣ 마이페이지 — 포인트·뱃지

7️⃣ 위치 설정·로그인 — 구글 OAuth + Mapbox

---

## 4. 서비스 아키텍처 및 기술 스택

<img width="1353" height="757" alt="image 33" src="https://github.com/user-attachments/assets/26b32c7a-3f91-4474-8b81-491fbaafe581" />


### Frontend (`apps/web`)

| 구분         | 기술                                                          |
| ------------ | ------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19, React Compiler             |
| Language     | TypeScript 6                                                  |
| Styling      | Tailwind CSS v4                                               |
| State / Data | TanStack Query (React Query)                                  |
| UI           | Radix UI, lucide-react, sonner, vaul, Lottie                 |
| Map          | Mapbox GL, react-map-gl                                       |
| Auth         | @react-oauth/google                                          |
| 기타         | PWA                                                            |

### Backend (`apps/server`)

| 구분         | 기술                                            |
| ------------ | ----------------------------------------------- |
| Framework    | NestJS 11 (REST API)                            |
| Language     | TypeScript 6                                    |
| Database     | PostgreSQL                                      |
| Auth         | Passport-JWT, @nestjs/jwt, google-auth-library  |
| AI           | OpenAI SDK (gpt-4o-mini, Vision)                |
| API 문서     | Swagger (@nestjs/swagger)                       |
| 검증         | class-validator, class-transformer              |

### Infra & 외부 API

- **Infra:** pnpm 모노레포(workspace), Docker Compose(PostgreSQL), GitHub Actions CI, Husky + lint-staged + Commitlint
- **외부 API:** OpenAI API · 서울시 가정용 폐기물 공공데이터 · Mapbox

---

## 5. 시스템 아키텍처

### 모노레포 구조

```
sseudam/
├── apps/
│   ├── web/      # Next.js 16 PWA 클라이언트
│   └── server/   # NestJS 11 REST API 서버
├── deploy/       # 로컬 PostgreSQL Docker Compose
└── .github/      # CI 워크플로우
```

### 데이터 흐름 (개요)

```
[사용자]
   │  사진 / 질문 / 활동
   ▼
[Web · Next.js PWA] ──REST──> [Server · NestJS]
                                   │
              ┌────────────────────┼───────────────────┐
              ▼                    ▼                   ▼
        [OpenAI API]        [PostgreSQL]        서울시 공공데이터 API]
       (Vision · Chat)    (유저·기록·포인트·뱃지)       (분리배출 정보)
```

### 주요 API 모듈

| 모듈            | 역할                                  |
| --------------- | ------------------------------------- |
| `auth`          | Google OAuth · JWT 인증               |
| `camera`        | 이미지 분석(Vision) 분리배출 인식     |
| `chat`          | AI 챗봇 · 세션 · 가드레일             |
| `waste-sorting` | 카테고리 가이드 · 서울시 공공데이터   |
| `records`       | 분리배출 기록                         |
| `points`        | 포인트 적립 · 거래 내역               |
| `users`         | 프로필 · 위치 · 통계 · 뱃지 · 포인트  |

---

## 6. 디렉터리 구조

```
sseudam/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (tabs)/        # 메인 탭 라우트
│   │       │   │   ├── camera/    # AI 카메라
│   │       │   │   ├── category/  # 분리배출 가이드
│   │       │   │   ├── chatbot/   # AI 챗봇
│   │       │   │   ├── records/   # 기록
│   │       │   │   └── mypage/    # 마이페이지(뱃지·포인트)
│   │       │   └── onboarding/    # 온보딩
│   │       ├── components/        # 공용 컴포넌트
│   │       ├── lib/               # 유틸 · API 클라이언트
│   │       └── middleware.ts
│   └── server/
│       └── src/
│           ├── auth/              # 인증
│           ├── camera/            # 카메라(Vision)
│           ├── chat/              # 챗봇(+ guardrails)
│           ├── waste-sorting/     # 분리배출 가이드 · 서울시 API
│           ├── records/           # 기록
│           ├── points/            # 포인트
│           ├── users/             # 유저
│           ├── core/              # 공통 모듈
│           ├── migration/         # DB 마이그레이션
│           └── main.ts
├── deploy/                        # Docker Compose (PostgreSQL)
├── .github/                       # CI
└── package.json                   # 워크스페이스 루트
```

---

## 7. 팀 소개

| 이름     | 담당                |
| -------- | ------------------- |
| _임세윤_ | _기획, 디자인, FE, BE_       |
| _강신호_ | _AI_       |


