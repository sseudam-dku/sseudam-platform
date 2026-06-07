"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChatbotView, type ChatbotMessage } from "@/components/chatbot/chatbot-view";
import { sendChatMessage, sendGuestChatMessage } from "@/lib/api/chat";
import { ApiError } from "@/lib/api/client";
import {
  getOrCreateGuestSessionId,
  getRemainingGuestMessages,
  isGuestLimitReached,
  syncGuestMessageCountFromRemaining,
} from "@/lib/guest-chat";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useLocationStore } from "@/lib/store/use-location-store";

function getUniqueMessageId(role: string): string {
  return `${role}-${Date.now()}-${Math.random()}`;
}

function buildChatHistory(
  messages: ChatbotMessage[],
): { role: "user" | "assistant"; content: string }[] {
  return messages
    .filter(msg => msg.content.length > 0)
    .map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
}

export function ChatbotClient() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { city, district, isHydrated } = useLocationStore();
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingGuestMessages, setRemainingGuestMessages] = useState<number | null>(null);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  useEffect(() => {
    if (isLoggedIn) {
      setRemainingGuestMessages(null);
      setIsLoginRequired(false);
      return;
    }
    setRemainingGuestMessages(getRemainingGuestMessages());
    setIsLoginRequired(isGuestLimitReached());
  }, [isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    const currentIntervals = intervalsRef.current;
    return () => {
      currentIntervals.forEach(clearInterval);
      currentIntervals.clear();
    };
  }, []);

  function handleBack() {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => router.push("/"), 300);
  }

  function typeAssistantMessage(botMsgId: string, reply: string, timeString: string) {
    let charIndex = 0;
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
    setMessages(prev => [
      ...prev,
      {
        id: botMsgId,
        role: "assistant",
        content: "",
        senderName: "분리수거 도우미",
        timestamp: timeString,
      },
    ]);
  }

  async function sendMessage(text: string) {
    if (isSending) return;
    if (!isLoggedIn && isGuestLimitReached()) {
      setIsLoginRequired(true);
      setError("비회원은 3회까지 이용 가능합니다. 로그인 후 계속 이용해 주세요.");
      return;
    }
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userMsg: ChatbotMessage = {
      id: getUniqueMessageId("user"),
      role: "user",
      content: text,
      status: "sent",
      timestamp: timeString,
    };
    const historyBeforeSend = buildChatHistory(messages);
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);
    setError(null);
    try {
      if (isLoggedIn) {
        const result = await sendChatMessage(text, sessionId);
        setSessionId(result.sessionId);
        typeAssistantMessage(
          getUniqueMessageId("bot"),
          result.assistantMessage.content,
          timeString,
        );
      } else {
        const guestCity = isHydrated && city ? city : "서울";
        const guestDistrict = isHydrated && district ? district : "중구";
        const result = await sendGuestChatMessage({
          message: text,
          guestSessionId: getOrCreateGuestSessionId(),
          city: guestCity,
          district: guestDistrict,
          history: historyBeforeSend,
        });
        syncGuestMessageCountFromRemaining(result.remainingCount);
        setRemainingGuestMessages(result.remainingCount);
        if (result.remainingCount <= 0) {
          setIsLoginRequired(true);
        }
        typeAssistantMessage(
          getUniqueMessageId("bot"),
          result.assistantMessage.content,
          timeString,
        );
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setIsLoginRequired(true);
        setRemainingGuestMessages(0);
        syncGuestMessageCountFromRemaining(0);
        setError(err.message);
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : "답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.";
      setError(message);
      typeAssistantMessage(
        getUniqueMessageId("bot"),
        "죄송해요, 지금은 답변을 드리기 어려워요. 잠시 후 다시 시도해 주세요.",
        timeString,
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ChatbotView
      messages={messages}
      isSending={isSending}
      isExiting={isExiting}
      error={error}
      isLoggedIn={isLoggedIn}
      remainingGuestMessages={remainingGuestMessages}
      isLoginRequired={isLoginRequired}
      messagesEndRef={messagesEndRef}
      onBack={handleBack}
      onSendMessage={sendMessage}
    />
  );
}

export default ChatbotClient;
