"use client";

import { useState } from "react";

import { ChatBubble, type ChatBubbleProps } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";

const QUICK_ACTIONS = [
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

type Message = Omit<ChatBubbleProps, "className">;

export function ChatbotTab() {
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(text: string) {
    const userMsg: Message = { role: "user", content: text, status: "sent" };
    const reply = MOCK_REPLIES[text] ?? MOCK_REPLIES.default;
    const botMsg: Message = { role: "assistant", content: reply, senderName: "쓰담 AI" };
    setMessages(prev => [...prev, userMsg, botMsg]);
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-neutral-100 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-4xl">🤖</span>
            </div>
            <div>
              <p className="head-4 text-neutral-900">안녕하세요!</p>
              <p className="body-4 mt-1 text-neutral-500">쓰담에 무엇을 도와드릴까요?</p>
            </div>
          </div>

          <div className="rounded-16 w-full bg-white p-4 shadow-sm">
            <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
              자주 묻는 질문
            </p>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="rounded-12 flex items-center gap-3 bg-neutral-50 px-4 py-3 text-left hover:bg-neutral-100 active:bg-neutral-100">
                  <span className="text-xl">{action.emoji}</span>
                  <span className="body-4 text-neutral-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-neutral-100">
          <div className="flex flex-col gap-3 p-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} />
            ))}
          </div>
        </div>
      )}

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
