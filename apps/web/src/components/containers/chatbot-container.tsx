"use client";

import Lottie from "lottie-react";
import chatbotAnimation from "../../../public/lottie/Chatbot.json";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChatBubble, type ChatBubbleProps } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatbotHeader } from "@/components/layout/chatbot-header";
import { QUICK_ACTIONS, MOCK_REPLIES } from "@/data/mock";
import { cn } from "@/lib/cn";

type Message = Omit<ChatBubbleProps, "className">;

export function ChatbotContainer() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleBack() {
    if (isExiting) return;

    setIsExiting(true);
    window.setTimeout(() => router.push("/"), 300);
  }

  function sendMessage(text: string) {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: Message = { role: "user", content: text, status: "sent", timestamp: timeString };
    const reply = MOCK_REPLIES[text] ?? MOCK_REPLIES.default;
    const botMsg: Message = {
      role: "assistant",
      content: reply,
      senderName: "분리수거 도우미",
      timestamp: timeString,
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
  }

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden bg-white",
        isExiting && "animate-page-exit",
      )}>
      <ChatbotHeader onBack={handleBack} />

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-neutral-100 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Lottie animationData={chatbotAnimation} loop autoplay className="size-25" />
            <div>
              <p className="head-4 text-neutral-900">안녕하세요!</p>
              <p className="body-4 mt-1 text-neutral-500">쓰담에 무엇을 도와드릴까요?</p>
            </div>
          </div>

          <div className="rounded-16 w-full bg-white p-4 shadow-sm">
            <p className="body-5 mb-3 tracking-widest text-neutral-400 uppercase">자주 묻는 질문</p>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="rounded-12 flex cursor-pointer items-center gap-3 bg-neutral-50 px-4 py-3 text-left transition-colors duration-200 hover:bg-neutral-100 active:bg-neutral-100">
                  <span className="head-3">{action.emoji}</span>
                  <span className="body-4 text-neutral-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
          <div className="flex flex-col gap-3 p-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <ChatInput variant="chatbot" onSend={sendMessage} />
    </div>
  );
}

export default ChatbotContainer;
