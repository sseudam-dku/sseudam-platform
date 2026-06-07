import { apiFetch } from "./client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendChatResponse {
  sessionId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

export async function sendGuestChatMessage(payload: {
  message: string;
  guestSessionId: string;
  city: string;
  district: string;
  history: { role: "user" | "assistant"; content: string }[];
}): Promise<{ assistantMessage: ChatMessage; remainingCount: number }> {
  return apiFetch<{ assistantMessage: ChatMessage; remainingCount: number }>("/chat/guest", {
    method: "POST",
    body: payload,
  });
}

export async function sendChatMessage(
  message: string,
  sessionId?: string,
): Promise<SendChatResponse> {
  return apiFetch<SendChatResponse>("/chat", {
    method: "POST",
    auth: true,
    body: { message, sessionId },
  });
}

export async function fetchChatSessions(): Promise<ChatSession[]> {
  return apiFetch<ChatSession[]>("/chat/sessions", { auth: true });
}

export async function fetchSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`, {
    auth: true,
  });
}
