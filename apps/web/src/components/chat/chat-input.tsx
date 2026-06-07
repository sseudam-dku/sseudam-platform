"use client";

import { ArrowUp, Mic, MicOff } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/toast";
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

interface ISpeechRecognitionResult {
  [index: number]: { transcript: string };
  isFinal: boolean;
}

interface ISpeechRecognitionResultList {
  [index: number]: ISpeechRecognitionResult;
  length: number;
}

interface ISpeechRecognitionEvent {
  results: ISpeechRecognitionResultList;
  resultIndex: number;
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

const SPEECH_RECOGNITION_MAX_MS = 8000;

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
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preVoiceTextRef = useRef("");

  function clearListeningTimeout() {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }
  }

  function stopListening() {
    clearListeningTimeout();
    recognitionRef.current?.stop();
  }

  useEffect(() => {
    return () => {
      clearListeningTimeout();
      recognitionRef.current?.stop();
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
      stopListening();
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "ko-KR";

        preVoiceTextRef.current = value;

        recognition.onstart = () => {
          setIsListening(true);
          clearListeningTimeout();
          listeningTimeoutRef.current = setTimeout(() => {
            stopListening();
          }, SPEECH_RECOGNITION_MAX_MS);
        };

        recognition.onend = () => {
          clearListeningTimeout();
          setIsListening(false);
        };

        recognition.onerror = () => {
          clearListeningTimeout();
          setIsListening(false);
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          let finalText = "";
          let interimText = "";

          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalText += result[0].transcript;
            } else {
              interimText += result[0].transcript;
            }
          }

          const base = preVoiceTextRef.current.trim();
          const combined = [base, finalText, interimText].filter(Boolean).join(" ");

          if (combined.length > 100) {
            setToastMessage("최대 100자까지 입력할 수 있어요.");
            setValue(combined.slice(0, 100));
          } else {
            setValue(combined);
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
              <ArrowUp className="size-5" />
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
            <ArrowUp className="size-5" />
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
