"use client";

import Lottie from "lottie-react";
import chatbotAnimation from "../../../public/lottie/Chatbot.json";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChatBubble, type ChatBubbleProps } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatbotHeader } from "@/components/layout/chatbot-header";
import mockData from "@/data/mock";
import { cn } from "@/lib/cn";

// Helper function to generate unique message IDs without triggering react-hooks/purity errors inside the component
function getUniqueMessageId(role: string): string {
  return `${role}-${Date.now()}-${Math.random()}`;
}

type Message = Omit<ChatBubbleProps, "className"> & { id: string };

export function ChatbotContainer() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const currentIntervals = intervalsRef.current;
    return () => {
      // Clean up all active intervals when the component unmounts
      currentIntervals.forEach(clearInterval);
      currentIntervals.clear();
    };
  }, []);

  function handleBack() {
    if (isExiting) return;

    setIsExiting(true);
    window.setTimeout(() => router.push("/"), 300);
  }

  function sendMessage(text: string) {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsgId = getUniqueMessageId("user");
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      status: "sent",
      timestamp: timeString,
    };
    const reply = mockData.MOCK_REPLIES[text] ?? mockData.MOCK_REPLIES.default;

    setMessages(prev => [...prev, userMsg]);

    // 타이핑 효과로 봇 메시지 추가
    let charIndex = 0;
    const botMsgId = getUniqueMessageId("bot");
    const botMsg: Message = {
      id: botMsgId,
      role: "assistant",
      content: "",
      senderName: "분리수거 도우미",
      timestamp: timeString,
    };

    setMessages(prev => [...prev, botMsg]);

    const interval = setInterval(() => {
      charIndex++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMsgId ? { ...msg, content: reply.slice(0, charIndex) } : msg,
        ),
      );
      if (charIndex >= reply.length) {
        clearInterval(interval);
        intervalsRef.current.delete(interval);
      }
    }, 30);
    intervalsRef.current.add(interval);
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
              {mockData.QUICK_ACTIONS.map(action => (
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
            {messages.map(({ id, ...msg }) => (
              <ChatBubble key={id} {...msg} />
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
