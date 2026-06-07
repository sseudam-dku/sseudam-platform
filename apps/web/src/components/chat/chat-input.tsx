"use client";

import { Mic, MicOff } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { IconArrowUp } from "@/components/icons/arrow-up";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  variant?: "default" | "chatbot";
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "메시지를 입력하세요",
  className,
  variant = "default",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => ISpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("이 브라우저에서는 음성 인식을 지원하지 않습니다.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "ko-KR";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setValue(prev => {
              const trimmed = prev.trim();
              const combined = trimmed ? `${trimmed} ${transcript}` : transcript;
              if (combined.length > 100) {
                setToastMessage("최대 100자까지 입력할 수 있어요.");
                return combined.slice(0, 100);
              }
              return combined;
            });
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    if (val.length > 100) {
      setToastMessage("최대 100자까지 입력할 수 있어요.");
      setValue(val.slice(0, 100));
    } else {
      setValue(val);
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  const renderInput = () => {
    if (variant === "chatbot") {
      return (
        <div
          className={cn(
            "rounded-t-20 shrink-0 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px] shadow-neutral-900/10",
            className,
          )}>
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? "음성 입력 중지" : "음성 입력"}
              className={cn(
                "mb-0.5 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                isListening
                  ? "animate-pulse bg-red-50 text-red-500"
                  : "text-green-500 hover:bg-neutral-100",
              )}>
              {isListening ? (
                <Mic className="size-6 animate-bounce" strokeWidth={2} />
              ) : (
                <MicOff className="size-6" strokeWidth={2} />
              )}
            </button>
            <div className="rounded-20 flex flex-1 flex-col border border-transparent bg-neutral-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-500">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="body-2 scrollbar-hide max-h-30 min-h-11 w-full resize-none bg-transparent text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-50"
              />
              <span className="body-5 pointer-events-none mt-1 self-end text-neutral-400 select-none">
                {value.length}/100
              </span>
            </div>
            <button
              type="button"
              aria-label="메시지 보내기"
              disabled={!canSend}
              onClick={handleSend}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full bg-green-500 text-white transition-colors duration-200",
                canSend ? "cursor-pointer hover:bg-green-600" : "cursor-not-allowed opacity-50",
              )}>
              <IconArrowUp className="size-5" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "border-t border-neutral-200 bg-neutral-50 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
          className,
        )}>
        <div className="flex items-end gap-2">
          <div className="rounded-12 flex flex-1 flex-col border border-transparent bg-neutral-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-500">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="body-2 max-h-30 min-h-12 w-full resize-none bg-transparent text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-50"
            />
            <span className="body-5 pointer-events-none mt-1 self-end text-neutral-400 select-none">
              {value.length}/100
            </span>
          </div>
          <Button
            type="button"
            size="md"
            className="size-12 min-w-12 shrink-0 rounded-full px-0"
            disabled={!canSend}
            onClick={handleSend}
            aria-label="메시지 보내기">
            <IconArrowUp className="size-5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderInput()}
      {toastMessage && (
        <Toast message={toastMessage} variant="error" onClose={() => setToastMessage("")} />
      )}
    </>
  );
}
