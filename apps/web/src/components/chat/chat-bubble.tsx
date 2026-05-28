import { AlertCircle, Check, Clock } from "lucide-react";

import { Profile } from "@/components/chat/profile";
import { cn } from "@/lib/cn";

export type ChatBubbleRole = "user" | "assistant";
export type ChatBubbleStatus = "sending" | "sent" | "error";

export interface ChatBubbleProps {
  role: ChatBubbleRole;
  content: string;
  timestamp?: string;
  status?: ChatBubbleStatus;
  senderName?: string;
  senderSubtitle?: string;
  avatarUrl?: string;
  className?: string;
}

function StatusIcon({ status }: { status: ChatBubbleStatus }) {
  if (status === "sending") {
    return <Clock className="size-3" aria-hidden="true" />;
  }
  if (status === "error") {
    return <AlertCircle className="size-3" aria-hidden="true" />;
  }
  return <Check className="size-3" aria-hidden="true" />;
}

export function ChatBubble({
  role,
  content,
  timestamp,
  status,
  senderName,
  senderSubtitle,
  avatarUrl,
  className,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full gap-2", isUser ? "justify-end" : "justify-start", className)}>
      {!isUser && senderName ? (
        <Profile
          name={senderName}
          subtitle={senderSubtitle}
          avatarUrl={avatarUrl}
          size="sm"
          className="mt-1 shrink-0 self-start"
        />
      ) : null}

      <div className={cn("flex max-w-[85%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-6 break-words whitespace-pre-wrap select-text",
            isUser
              ? "bg-bubble-user text-bubble-user-text rounded-br-md"
              : "border-border bg-bubble-assistant text-bubble-assistant-text rounded-bl-md border",
          )}>
          {content}
        </div>

        {(timestamp || status) && (
          <div className="text-muted flex items-center gap-1 px-1 text-[11px]">
            {timestamp ? <time>{timestamp}</time> : null}
            {isUser && status ? (
              <span
                className={cn("inline-flex items-center", status === "error" && "text-destructive")}
                aria-label={
                  status === "sending" ? "전송 중" : status === "error" ? "전송 실패" : "전송 완료"
                }>
                <StatusIcon status={status} />
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
