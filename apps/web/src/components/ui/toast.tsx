"use client";

import { useEffect, useRef, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  variant?: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, duration = 2500, variant = "success", onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onCloseRef.current();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const isError = variant === "error";
  const styleClass = isError
    ? "border-red-200 bg-red-50 text-red-600"
    : "border-neutral-200 bg-white text-neutral-900";

  return (
    <div
      className={`rounded-12 fixed top-20 left-1/2 z-50 w-[calc(100%-var(--spacing-8))] max-w-xs -translate-x-1/2 border p-4 text-center shadow-lg transition-all duration-300 ${styleClass} ${
        isVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-95 opacity-0"
      }`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}>
      <p className="body-4">{message}</p>
    </div>
  );
};

export default Toast;
