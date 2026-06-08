"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      gap={8}
      className="!items-center"
      style={
        {
          left: 0,
          right: 0,
          width: "min(430px, 100vw)",
          margin: "0 auto",
          transform: "none",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-row items-center justify-center gap-1.5 rounded-2xl px-3 py-4 text-sm font-medium text-white shadow-lg whitespace-nowrap",
          success: "bg-green-500",
          error: "bg-red-400",
          icon: "shrink-0 flex items-center",
          content: "shrink-0",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
