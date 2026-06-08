import Lottie from "lottie-react";

import chatbotAnimation from "../../../public/lottie/Chatbot.json";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import {
  ChatBubble,
  ChatbotLoadingBubble,
  type ChatBubbleProps,
} from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatbotHeader } from "@/components/layout/chatbot-header";
import { cn } from "@/lib/cn";
import { GUEST_MESSAGE_LIMIT } from "@/lib/guest-chat";

export const CHATBOT_QUICK_ACTIONS = [
  { emoji: "🧴", label: "플리스틱 배출 방법 알려줘." },
  { emoji: "🍱", label: "음식물이 많이 뭍은 용기는 어디에 버려?" },
  { emoji: "🪥", label: "칫솔은 일반쓰레기야 플라스틱이야?" },
] as const;

export type ChatbotMessage = Omit<ChatBubbleProps, "className"> & { id: string };

export interface ChatbotViewProps {
  messages: ChatbotMessage[];
  isSending: boolean;
  isExiting: boolean;
  error: string | null;
  isLoggedIn: boolean;
  remainingGuestMessages: number | null;
  isLoginRequired: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onSendMessage: (text: string) => void;
}

export function ChatbotView({
  messages,
  isSending,
  isExiting,
  error,
  isLoggedIn,
  remainingGuestMessages,
  isLoginRequired,
  messagesEndRef,
  onBack,
  onSendMessage,
}: ChatbotViewProps) {
  const isEmpty = messages.length === 0 && !isSending;
  const isInputDisabled = isSending || isLoginRequired;
  const showGuestHint = !isLoggedIn && !isLoginRequired;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden bg-white",
        isExiting && "animate-page-exit",
      )}>
      <ChatbotHeader onBack={onBack} />

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-neutral-100 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Lottie animationData={chatbotAnimation} loop autoplay className="size-25" />
            <div>
              <p className="head-4 text-neutral-900">안녕하세요!</p>
              <p className="body-4 mt-1 text-neutral-500">궁금한 점을 편하게 물어보세요</p>
              {showGuestHint && (
                <p className="body-5 mt-2 text-neutral-400">
                  비회원은 {GUEST_MESSAGE_LIMIT}회까지 무료로 이용할 수 있어요
                </p>
              )}
            </div>
          </div>

          <div className="rounded-16 w-full bg-white p-4 shadow-sm">
            <p className="body-5 mb-3 tracking-widest text-neutral-400 uppercase">자주 묻는 질문</p>
            <div className="flex flex-col gap-2">
              {CHATBOT_QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onSendMessage(action.label)}
                  disabled={isInputDisabled}
                  className="rounded-12 flex cursor-pointer items-center gap-3 bg-neutral-50 px-4 py-3 text-left transition-colors duration-200 hover:bg-neutral-100 active:bg-neutral-100 disabled:opacity-50">
                  <span className="head-3">{action.emoji}</span>
                  <span className="body-4 text-neutral-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="body-5 text-rose-500">{error}</p>}
        </div>
      ) : (
        <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
          <div className="flex flex-col gap-3 p-4">
            {messages.map(({ id, ...msg }) => (
              <ChatBubble key={id} {...msg} />
            ))}
            {isSending && <ChatbotLoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {isLoginRequired && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4">
          <p className="body-4 mb-1 text-center text-neutral-900">
            비회원은 {GUEST_MESSAGE_LIMIT}회까지 이용 가능합니다
          </p>
          <p className="body-5 mb-4 text-center text-neutral-500">
            로그인 후 계속 대화할 수 있어요
          </p>
          <GoogleAuthButton redirectTo="/chatbot" />
        </div>
      )}

      {!isLoginRequired && showGuestHint && remainingGuestMessages !== null && (
        <p className="body-5 border-t border-neutral-100 bg-white px-3 py-1.5 text-center text-neutral-400">
          남은 질문 {remainingGuestMessages}회
        </p>
      )}

      <ChatInput variant="chatbot" disabled={isInputDisabled} onSend={onSendMessage} />
    </div>
  );
}
