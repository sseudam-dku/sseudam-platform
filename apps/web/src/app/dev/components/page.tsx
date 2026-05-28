"use client";

import { Home, MessageCircle, Search, Settings, User } from "lucide-react";
import { useState } from "react";

import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { Profile } from "@/components/chat/profile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/ui/cta";
import { Header } from "@/components/ui/header";
import { SearchBar } from "@/components/ui/search-bar";
import { SocialLoginButton } from "@/components/ui/social-login-button";
import { TabBar } from "@/components/ui/tab-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border bg-surface space-y-4 rounded-xl border p-6">
      <h2 className="text-foreground text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsShowcasePage() {
  const [searchValue, setSearchValue] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>(["안녕하세요! 무엇을 도와드릴까요?"]);
  const [themePreview, setThemePreview] = useState(false);

  return (
    <div
      className="bg-background min-h-dvh pb-12"
      style={
        themePreview
          ? ({
              "--color-primary": "#2563eb",
              "--color-ring": "#2563eb",
              "--color-bubble-user": "#2563eb",
            } as React.CSSProperties)
          : undefined
      }>
      <Header
        title="컴포넌트 쇼케이스"
        onBack={() => window.history.back()}
        right={
          <Button
            variant="ghost"
            size="sm"
            className="size-11 min-w-11 px-0"
            onClick={() => setThemePreview(prev => !prev)}
            aria-label="테마 미리보기 토글">
            <Settings className="size-5" />
          </Button>
        }
      />

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
        <div className="border-border bg-surface-muted text-muted rounded-lg border px-4 py-3 text-sm">
          개발 전용 페이지입니다. 우측 상단 설정 아이콘으로 primary 색상 변경을 미리볼 수 있습니다.
        </div>

        <Section title="Button">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Social Login Button">
          <div className="mx-auto flex max-w-sm flex-col gap-3">
            <SocialLoginButton provider="google" />
            <SocialLoginButton provider="kakao" />
            <SocialLoginButton provider="apple" />
            <SocialLoginButton provider="naver" />
          </div>
        </Section>

        <Section title="CTA">
          <div className="space-y-6">
            <CTA
              variant="stacked"
              title="AI 상담을 시작해 보세요"
              description="24시간 언제든지 편하게 대화할 수 있습니다."
              action={<Button className="w-full sm:w-auto">시작하기</Button>}
            />
            <CTA
              variant="inline"
              title="프로필을 완성하세요"
              description="맞춤 상담을 위해 기본 정보를 입력해 주세요."
              action={<Button variant="outline">프로필 설정</Button>}
            />
            <CTA
              variant="banner"
              title="새로운 기능이 추가되었습니다"
              description="채팅 기록 저장 기능을 이용해 보세요."
              action={<Button>자세히 보기</Button>}
            />
          </div>
        </Section>

        <Section title="SearchBar">
          <div className="space-y-3">
            <SearchBar
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="검색어를 입력하세요"
            />
            <SearchBar
              readOnly
              placeholder="탭하면 검색 페이지로 이동"
              onReadOnlyClick={() => alert("검색 페이지로 이동")}
            />
          </div>
        </Section>

        <Section title="TabBar (Top)">
          <TabBar
            variant="top"
            items={[
              {
                id: "all",
                label: "전체",
                content: <p className="text-muted pt-4 text-sm">전체 목록 콘텐츠</p>,
              },
              {
                id: "active",
                label: "진행 중",
                content: <p className="text-muted pt-4 text-sm">진행 중 콘텐츠</p>,
              },
              {
                id: "done",
                label: "완료",
                content: <p className="text-muted pt-4 text-sm">완료 콘텐츠</p>,
              },
            ]}
          />
        </Section>

        <Section title="Table">
          <Table responsive="table">
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>김씨댐</TableCell>
                <TableCell>진행 중</TableCell>
                <TableCell>2026-05-26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>이씨댐</TableCell>
                <TableCell>완료</TableCell>
                <TableCell>2026-05-25</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <p className="text-muted text-sm">모바일 카드 모드 (좁은 화면에서 확인)</p>
          <Table responsive="card">
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell label="이름">김씨댐</TableCell>
                <TableCell label="상태">진행 중</TableCell>
                <TableCell label="날짜">2026-05-26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell label="이름">이씨댐</TableCell>
                <TableCell label="상태">완료</TableCell>
                <TableCell label="날짜">2026-05-25</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Bottom Sheet">
          <BottomSheet
            trigger={<Button variant="outline">바텀 시트 열기</Button>}
            title="옵션 선택"
            description="원하는 항목을 선택하세요."
            footer={
              <Button className="w-full" variant="primary">
                확인
              </Button>
            }>
            <div className="text-foreground space-y-2 text-sm">
              <p>첫 번째 옵션</p>
              <p>두 번째 옵션</p>
              <p>세 번째 옵션</p>
            </div>
          </BottomSheet>
        </Section>

        <Section title="Profile">
          <div className="space-y-4">
            <Profile name="씨댐 AI" subtitle="AI 상담사" size="sm" />
            <Profile name="홍길동" subtitle="사용자" size="md" />
            <Profile name="김씨댐" size="lg" />
          </div>
        </Section>

        <Section title="Chat">
          <div className="border-border bg-surface-muted space-y-4 rounded-xl border p-4">
            <ChatBubble
              role="assistant"
              content="안녕하세요! 무엇을 도와드릴까요?"
              timestamp="오전 10:00"
              senderName="씨댐 AI"
              senderSubtitle="AI 상담사"
            />
            <ChatBubble
              role="user"
              content="오늘 기분이 좋지 않아요."
              timestamp="오전 10:01"
              status="sent"
            />
            <ChatBubble
              role="assistant"
              content="그렇군요. 조금 더 이야기해 주실 수 있을까요?"
              timestamp="오전 10:01"
              senderName="씨댐 AI"
            />
            <ChatBubble role="user" content="전송 중..." status="sending" />
            <ChatBubble role="user" content="전송 실패" status="error" />
          </div>

          <div className="border-border overflow-hidden rounded-xl border">
            <div className="bg-surface-muted space-y-3 p-4">
              {chatMessages.map((message, index) => (
                <ChatBubble
                  key={`${message}-${index}`}
                  role={index % 2 === 0 ? "assistant" : "user"}
                  content={message}
                  senderName={index % 2 === 0 ? "씨댐 AI" : undefined}
                  status={index % 2 === 1 ? "sent" : undefined}
                />
              ))}
            </div>
            <ChatInput onSend={message => setChatMessages(prev => [...prev, message])} />
          </div>
        </Section>

        <Section title="TabBar (Bottom) — 미리보기">
          <div className="border-border bg-surface-muted relative h-40 overflow-hidden rounded-xl border">
            <TabBar
              variant="bottom"
              className="relative h-full"
              items={[
                { id: "home", label: "홈", icon: <Home /> },
                { id: "chat", label: "상담", icon: <MessageCircle /> },
                { id: "search", label: "검색", icon: <Search /> },
                { id: "profile", label: "내 정보", icon: <User /> },
              ]}
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
