import type { ReactNode } from "react";

export function SpeechBubble({
  children,
  tail = "l",
  className = "",
}: {
  children: ReactNode;
  tail?: "l" | "r" | "c";
  className?: string;
}) {
  return <div className={`bubble bubble-tail-${tail} ${className}`}>{children}</div>;
}
