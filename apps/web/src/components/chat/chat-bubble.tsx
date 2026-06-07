import { AlertCircle, Clock } from "lucide-react";
import Lottie from "lottie-react";

import chatbotAnimation from "../../../public/lottie/Chatbot.json";
import { cn } from "@/lib/cn";

export type ChatBubbleRole = "user" | "assistant";
export type ChatBubbleStatus = "sending" | "sent" | "error";

export interface ChatBubbleProps {
  role: ChatBubbleRole;
  content: string;
  timestamp?: string;
  status?: ChatBubbleStatus;
  senderName?: string;
  avatarUrl?: string;
  className?: string;
}

function StatusIcon({ status }: { status: ChatBubbleStatus }) {
  if (status === "sending") return <Clock className="size-3" aria-hidden="true" />;
  if (status === "error") return <AlertCircle className="size-3" aria-hidden="true" />;
  return null;
}

function Avatar({ name, avatarUrl }: { name?: string; avatarUrl?: string }) {
  if (name === "분리수거 도우미") {
    return (
      <div className="size-8 shrink-0">
        <Lottie animationData={chatbotAnimation} loop autoplay className="size-8" />
      </div>
    );
  }

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? "")
      .join("") ?? "";

  return (
    <div className="body-5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-600">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="size-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export function ChatBubble({
  role,
  content,
  timestamp,
  status,
  senderName,
  avatarUrl,
  className,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full gap-2", isUser ? "justify-end" : "justify-start", className)}>
      {!isUser && <Avatar name={senderName} avatarUrl={avatarUrl} />}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        {!isUser && senderName && (
          <span className="body-5 px-1 text-neutral-500">{senderName}</span>
        )}

        <div
          className={cn(
            "rounded-16 body-2 px-4 py-3 whitespace-pre-wrap select-text",
            isUser
              ? "rounded-br-4 bg-green-500 text-neutral-50"
              : "rounded-bl-4 border border-neutral-200 bg-white text-neutral-900",
          )}>
          {content}
        </div>

        {(timestamp || status) && (
          <div className="body-5 flex items-center gap-1 px-1 text-neutral-400">
            {timestamp ? <time>{timestamp}</time> : null}
            {isUser && status && status !== "sent" ? (
              <span
                className={cn("inline-flex items-center", status === "error" && "text-red-500")}
                aria-label={status === "sending" ? "전송 중" : "전송 실패"}>
                <StatusIcon status={status} />
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
